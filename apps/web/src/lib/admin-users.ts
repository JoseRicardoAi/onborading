import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { isDatabaseConfigured, prisma } from '@/lib/prisma';

const scrypt = promisify(scryptCallback);
const passwordKeyLength = 64;

export const adminUserCreateSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(3, 'Informe o nome completo do operador.'),
    email: z.string().trim().email('Informe um e-mail valido.'),
    password: z
      .string()
      .min(8, 'A senha deve ter pelo menos 8 caracteres.'),
    passwordConfirmation: z.string(),
  })
  .refine((value) => value.password === value.passwordConfirmation, {
    message: 'A confirmacao de senha precisa ser igual a senha.',
    path: ['passwordConfirmation'],
  });

export type AdminUserCreateInput = z.infer<typeof adminUserCreateSchema>;

export type AdminUserSummary = {
  id: string;
  fullName: string | null;
  email: string;
  isActive: boolean;
  lastLoginAt: Date | null;
  createdAt: Date;
};

export type AdminAuthenticationResult = {
  id: string;
  fullName: string | null;
  email: string;
} | null;

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString('base64url');
  const derivedKey = (await scrypt(password, salt, passwordKeyLength)) as Buffer;

  return `scrypt:${salt}:${derivedKey.toString('base64url')}`;
}

async function verifyPassword(password: string, passwordHash: string) {
  const [algorithm, salt, storedKey] = passwordHash.split(':');

  if (algorithm !== 'scrypt' || !salt || !storedKey) {
    return false;
  }

  const derivedKey = (await scrypt(password, salt, passwordKeyLength)) as Buffer;
  const storedBuffer = Buffer.from(storedKey, 'base64url');

  if (storedBuffer.length !== derivedKey.length) {
    return false;
  }

  return timingSafeEqual(storedBuffer, derivedKey);
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export async function authenticateAdminUser(
  email: string,
  password: string,
): Promise<AdminAuthenticationResult> {
  if (!isDatabaseConfigured()) {
    return null;
  }

  try {
    const adminUser = await prisma.adminUser.findUnique({
      where: {
        email: normalizeEmail(email),
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        passwordHash: true,
        isActive: true,
      },
    });

    if (!adminUser?.isActive || !adminUser.passwordHash) {
      return null;
    }

    const passwordMatches = await verifyPassword(password, adminUser.passwordHash);

    if (!passwordMatches) {
      return null;
    }

    await prisma.adminUser.update({
      where: {
        id: adminUser.id,
      },
      data: {
        lastLoginAt: new Date(),
      },
    });

    return {
      id: adminUser.id,
      email: adminUser.email,
      fullName: adminUser.fullName,
    };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return null;
    }

    throw error;
  }
}

export async function listAdminUsers(): Promise<AdminUserSummary[]> {
  if (!isDatabaseConfigured()) {
    return [];
  }

  try {
    return await prisma.adminUser.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return [];
    }

    throw error;
  }
}

export async function createAdminUser(input: AdminUserCreateInput) {
  if (!isDatabaseConfigured()) {
    throw new Error('DATABASE_NOT_CONFIGURED');
  }

  const parsed = adminUserCreateSchema.parse(input);
  const passwordHash = await hashPassword(parsed.password);

  try {
    return await prisma.adminUser.create({
      data: {
        fullName: parsed.fullName,
        email: normalizeEmail(parsed.email),
        passwordHash,
        isActive: true,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      throw new Error('ADMIN_USER_ALREADY_EXISTS');
    }

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      (error.code === 'P2021' || error.code === 'P2022')
    ) {
      throw new Error('DATABASE_SCHEMA_NOT_READY');
    }

    throw error;
  }
}
