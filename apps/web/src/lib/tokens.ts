import { createHmac, randomBytes } from 'node:crypto';
import { Prisma } from '@prisma/client';
import { getAppUrl } from '@/lib/app-url';
import { isDatabaseConfigured, prisma } from '@/lib/prisma';

type TokenRecordShape = {
  id: string;
  expiresAt: Date;
  usedAt: Date | null;
  revokedAt: Date | null;
  employee: {
    id: string;
    fullName: string;
    email: string | null;
    birthDate: Date | null;
    phone: string | null;
    instagram: string | null;
    residentialAddress: string | null;
    status: string;
    deletedAt: Date | null;
    uniformShirtSize: string | null;
    uniformPantsSize: string | null;
    uniformShoeSize: string | null;
    educationProfile: {
      institution: string | null;
      courseName: string | null;
      courseSchedule: string | null;
      expectedEndDate: Date | null;
    } | null;
    emergencyContact: {
      name: string;
      phone: string;
      address: string | null;
    } | null;
    healthProfile: {
      continuousMedication: string | null;
      allergies: string | null;
      relevantCondition: string | null;
      workRestriction: string | null;
      additionalNotes: string | null;
      consentAcceptedAt: Date | null;
    } | null;
    spouse: {
      name: string;
      phone: string | null;
      weddingAnniversary: Date | null;
    } | null;
    children: Array<{
      id: string;
      name: string;
      gender: string | null;
      birthDate: Date;
    }>;
  };
};

type TokenValidationResult =
  | {
      kind: 'valid';
      employee: {
        id: string;
        fullName: string;
        email: string | null;
        birthDate: Date | null;
        phone: string | null;
        instagram: string | null;
        residentialAddress: string | null;
        status: string;
        uniformShirtSize: string | null;
        uniformPantsSize: string | null;
        uniformShoeSize: string | null;
        educationProfile: {
          institution: string | null;
          courseName: string | null;
          courseSchedule: string | null;
          expectedEndDate: Date | null;
        } | null;
        emergencyContact: {
          name: string;
          phone: string;
          address: string | null;
        } | null;
        healthProfile: {
          continuousMedication: string | null;
          allergies: string | null;
          relevantCondition: string | null;
          workRestriction: string | null;
          additionalNotes: string | null;
          consentAcceptedAt: Date | null;
        } | null;
        spouse: {
          name: string;
          phone: string | null;
          weddingAnniversary: Date | null;
        } | null;
        children: Array<{
          id: string;
          name: string;
          gender: string | null;
          birthDate: Date;
        }>;
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
    const tokenRecordSelect: Prisma.OnboardingAccessTokenFindUniqueArgs['select'] = {
      id: true,
      expiresAt: true,
      usedAt: true,
      revokedAt: true,
      employee: {
        select: {
          id: true,
          fullName: true,
          email: true,
          birthDate: true,
          phone: true,
          instagram: true,
          residentialAddress: true,
          status: true,
          deletedAt: true,
          uniformShirtSize: true,
          uniformPantsSize: true,
          uniformShoeSize: true,
          educationProfile: {
            select: {
              institution: true,
              courseName: true,
              courseSchedule: true,
              expectedEndDate: true,
            },
          },
          emergencyContact: {
            select: {
              name: true,
              phone: true,
              address: true,
            },
          },
          healthProfile: {
            select: {
              continuousMedication: true,
              allergies: true,
              relevantCondition: true,
              workRestriction: true,
              additionalNotes: true,
              consentAcceptedAt: true,
            },
          },
          spouse: {
            select: {
              name: true,
              phone: true,
              weddingAnniversary: true,
            },
          },
          children: {
            orderBy: {
              createdAt: 'asc',
            },
            select: {
              id: true,
              name: true,
              gender: true,
              birthDate: true,
            },
          },
        },
      },
    };

    const tokenRecord = (await prisma.onboardingAccessToken.findUnique({
      where: {
        tokenHash: hashAccessToken(rawToken),
      },
      select: tokenRecordSelect,
    })) as TokenRecordShape | null;

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
        birthDate: tokenRecord.employee.birthDate,
        phone: tokenRecord.employee.phone,
        instagram: tokenRecord.employee.instagram,
        residentialAddress: tokenRecord.employee.residentialAddress,
        status: tokenRecord.employee.status,
        uniformShirtSize: tokenRecord.employee.uniformShirtSize,
        uniformPantsSize: tokenRecord.employee.uniformPantsSize,
        uniformShoeSize: tokenRecord.employee.uniformShoeSize,
        educationProfile: tokenRecord.employee.educationProfile,
        emergencyContact: tokenRecord.employee.emergencyContact,
        healthProfile: tokenRecord.employee.healthProfile,
        spouse: tokenRecord.employee.spouse,
        children: tokenRecord.employee.children,
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

export async function finalizeOnboardingToken(
  tokenRecordId: string,
  employeeId: string,
) {
  if (!isDatabaseConfigured()) {
    throw new Error('DATABASE_NOT_CONFIGURED');
  }

  try {
    const finalizedAt = new Date();

    return await prisma.$transaction([
      prisma.employee.update({
        where: {
          id: employeeId,
        },
        data: {
          completionPercent: 100,
          status: 'cadastro_completo',
          submittedAt: finalizedAt,
        },
        select: {
          id: true,
        },
      }),
      prisma.onboardingAccessToken.update({
        where: {
          id: tokenRecordId,
        },
        data: {
          usedAt: finalizedAt,
        },
        select: {
          id: true,
        },
      }),
    ]);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new Error('TOKEN_FINALIZE_FAILED');
    }

    throw error;
  }
}
