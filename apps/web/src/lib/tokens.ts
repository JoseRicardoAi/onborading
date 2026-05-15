import { createHmac, randomBytes } from 'node:crypto';
import { Prisma } from '@prisma/client';
import { getAppUrl } from '@/lib/app-url';
import { isDatabaseConfigured, prisma } from '@/lib/prisma';

type TokenValidationResult =
  | {
      kind: 'valid';
      employee: {
        id: string;
        fullName: string;
        email: string | null;
        status: string;
        uniformShirtSize: string | null;
        uniformPantsSize: string | null;
        uniformShoeSize: string | null;
      };
      tokenRecordId: string;
      expiresAt: Date;
    }
  | {
      kind: 'invalid' | 'expired' | 'finalized' | 'unavailable';
    };

export function getTokenTtlDays() {
  const rawValue = Number(process.env.ONBOARDING_TOKEN_TTL_DAYS ?? '7');

  if (!Number.isFinite(rawValue) || rawValue < 1) {
    return 7;
  }

  return Math.min(Math.floor(rawValue), 30);
}

function getTokenSecret() {
  const secret = process.env.TOKEN_SECRET || process.env.AUTH_SECRET;

  if (secret) {
    return secret;
  }

  if (process.env.NODE_ENV !== 'production') {
    return 'local-development-token-secret';
  }

  return null;
}

export function hashAccessToken(rawToken: string) {
  const secret = getTokenSecret();

  if (!secret) {
    throw new Error('TOKEN_SECRET_NOT_CONFIGURED');
  }

  return createHmac('sha256', secret).update(rawToken).digest('hex');
}

function createRawAccessToken() {
  return randomBytes(32).toString('base64url');
}

export function buildOnboardingLink(rawToken: string) {
  return `${getAppUrl()}/onboarding/${rawToken}`;
}

export async function createAccessToken(employeeId: string) {
  if (!isDatabaseConfigured()) {
    throw new Error('DATABASE_NOT_CONFIGURED');
  }

  const rawToken = createRawAccessToken();
  const tokenHash = hashAccessToken(rawToken);
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + getTokenTtlDays());

  try {
    await prisma.$transaction([
      prisma.onboardingAccessToken.updateMany({
        where: {
          employeeId,
          revokedAt: null,
          usedAt: null,
          expiresAt: {
            gt: new Date(),
          },
        },
        data: {
          revokedAt: new Date(),
        },
      }),
      prisma.onboardingAccessToken.create({
        data: {
          employeeId,
          tokenHash,
          expiresAt,
        },
      }),
    ]);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error('TOKEN_CREATE_FAILED');
    }

    throw error;
  }

  return {
    rawToken,
    link: buildOnboardingLink(rawToken),
    expiresAt,
  };
}

export async function validateAccessToken(rawToken: string): Promise<TokenValidationResult> {
  if (!isDatabaseConfigured()) {
    return { kind: 'unavailable' };
  }

  try {
    const tokenRecord = await prisma.onboardingAccessToken.findUnique({
      where: {
        tokenHash: hashAccessToken(rawToken),
      },
      select: {
        id: true,
        expiresAt: true,
        usedAt: true,
        revokedAt: true,
        employee: {
          select: {
            id: true,
            fullName: true,
            email: true,
            status: true,
            deletedAt: true,
            uniformShirtSize: true,
            uniformPantsSize: true,
            uniformShoeSize: true,
          },
        },
      },
    });

    if (!tokenRecord || tokenRecord.employee.deletedAt) {
      return { kind: 'invalid' };
    }

    if (tokenRecord.revokedAt || tokenRecord.expiresAt.getTime() <= Date.now()) {
      return { kind: 'expired' };
    }

    if (
      tokenRecord.usedAt ||
      tokenRecord.employee.status === 'cadastro_completo' ||
      tokenRecord.employee.status === 'revisado'
    ) {
      return { kind: 'finalized' };
    }

    return {
      kind: 'valid',
      employee: {
        id: tokenRecord.employee.id,
        fullName: tokenRecord.employee.fullName,
        email: tokenRecord.employee.email,
        status: tokenRecord.employee.status,
        uniformShirtSize: tokenRecord.employee.uniformShirtSize,
        uniformPantsSize: tokenRecord.employee.uniformPantsSize,
        uniformShoeSize: tokenRecord.employee.uniformShoeSize,
      },
      tokenRecordId: tokenRecord.id,
      expiresAt: tokenRecord.expiresAt,
    };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return { kind: 'unavailable' };
    }

    throw error;
  }
}
