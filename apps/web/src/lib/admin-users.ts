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

export const adminUserUpdateSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(3, 'Informe o nome completo do operador.'),
    email: z.string().trim().email('Informe um e-mail valido.'),
    isActive: z.enum(['active', 'blocked']),
    password: z.string().optional().transform((value) => value?.trim() ?? ''),
    passwordConfirmation: z
      .string()
      .optional()
      .transform((value) => value?.trim() ?? ''),
  })
  .superRefine((value, ctx) => {
    if (value.password.length > 0 && value.password.length < 8) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'A nova senha deve ter pelo menos 8 caracteres.',
        path: ['password'],
      });
    }

    if (value.password !== value.passwordConfirmation) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'A confirmacao de senha precisa ser igual a nova senha.',
        path: ['passwordConfirmation'],
      });
    }
  });

export type AdminUserUpdateInput = z.infer<typeof adminUserUpdateSchema>;

export const adminUserDeleteSchema = z.object({
  superAdminEmail: z.string().trim().email('Informe o e-mail do super admin.'),
  superAdminPassword: z.string().min(1, 'Informe a senha do super admin.'),
});

export type AdminUserDeleteInput = z.infer<typeof adminUserDeleteSchema>;

export type AdminUserSummary = {
  id: string;
  fullName: string | null;
  email: string;
  isActive: boolean;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type AdminAuditLogSummary = {
  id: string;
  actorEmail: string | null;
  action: string;
  entityType: string;
  entityId: string | null;
  metadata: Prisma.JsonValue | null;
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
        deletedAt: true,
      },
    });

    if (!adminUser?.isActive || adminUser.deletedAt || !adminUser.passwordHash) {
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
      where: {
        deletedAt: null,
      },
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
        updatedAt: true,
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

export async function updateAdminUser(
  adminUserId: string,
  input: AdminUserUpdateInput,
) {
  if (!isDatabaseConfigured()) {
    throw new Error('DATABASE_NOT_CONFIGURED');
  }

  const parsed = adminUserUpdateSchema.parse(input);
  const passwordHash = parsed.password
    ? await hashPassword(parsed.password)
    : undefined;

  try {
    return await prisma.adminUser.update({
      where: {
        id: adminUserId,
        deletedAt: null,
      },
      data: {
        fullName: parsed.fullName,
        email: normalizeEmail(parsed.email),
        isActive: parsed.isActive === 'active',
        ...(passwordHash ? { passwordHash } : {}),
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        isActive: true,
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
      error.code === 'P2025'
    ) {
      throw new Error('ADMIN_USER_NOT_FOUND');
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

export async function deleteAdminUser(adminUserId: string) {
  if (!isDatabaseConfigured()) {
    throw new Error('DATABASE_NOT_CONFIGURED');
  }

  try {
    return await prisma.adminUser.update({
      where: {
        id: adminUserId,
        deletedAt: null,
      },
      data: {
        isActive: false,
        deletedAt: new Date(),
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
      error.code === 'P2025'
    ) {
      throw new Error('ADMIN_USER_NOT_FOUND');
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

export async function createAdminAuditLog(input: {
  actorAdminUserId?: string;
  actorEmail?: string;
  action: string;
  entityType: string;
  entityId?: string;
  metadata?: Prisma.InputJsonValue;
}) {
  if (!isDatabaseConfigured()) {
    return null;
  }

  try {
    return await prisma.adminAuditLog.create({
      data: {
        actorAdminUserId: input.actorAdminUserId,
        actorEmail: input.actorEmail,
        action: input.action,
        entityType: input.entityType,
        entityId: input.entityId,
        metadata: input.metadata,
      },
      select: {
        id: true,
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return null;
    }

    throw error;
  }
}

export async function listRecentAdminAuditLogs(): Promise<AdminAuditLogSummary[]> {
  if (!isDatabaseConfigured()) {
    return [];
  }

  try {
    return await prisma.adminAuditLog.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 8,
      select: {
        id: true,
        actorEmail: true,
        action: true,
        entityType: true,
        entityId: true,
        metadata: true,
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
