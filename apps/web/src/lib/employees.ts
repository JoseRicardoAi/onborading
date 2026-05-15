import { Prisma, type OnboardingStatus } from '@prisma/client';
import { z } from 'zod';
import { isDatabaseConfigured, prisma } from '@/lib/prisma';

export const employeeCreateSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(3, 'Informe o nome completo do funcionario.'),
  email: z
    .string()
    .trim()
    .email('Informe um e-mail valido.')
    .or(z.literal(''))
    .transform((value) => value.trim()),
});

export type EmployeeCreateInput = z.infer<typeof employeeCreateSchema>;

export type EmployeeSummary = {
  id: string;
  fullName: string;
  email: string | null;
  status: OnboardingStatus;
  createdAt: Date;
  updatedAt: Date;
  latestAccessToken: {
    expiresAt: Date;
    usedAt: Date | null;
    revokedAt: Date | null;
    createdAt: Date;
  } | null;
};

export async function listEmployees(): Promise<EmployeeSummary[]> {
  if (!isDatabaseConfigured()) {
    return [];
  }

  try {
    const employees = await prisma.employee.findMany({
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
        status: true,
        createdAt: true,
        updatedAt: true,
        onboardingAccessTokens: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
          select: {
            expiresAt: true,
            usedAt: true,
            revokedAt: true,
            createdAt: true,
          },
        },
      },
    });

    return employees.map((employee) => ({
      id: employee.id,
      fullName: employee.fullName,
      email: employee.email,
      status: employee.status,
      createdAt: employee.createdAt,
      updatedAt: employee.updatedAt,
      latestAccessToken: employee.onboardingAccessTokens[0] ?? null,
    }));
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return [];
    }

    throw error;
  }
}

export async function saveEmployeeUniformData(employeeId: string, uniform: {
  shirtSize: string;
  pantsSize: string;
  shoeSize: string;
}) {
  if (!isDatabaseConfigured()) {
    throw new Error('DATABASE_NOT_CONFIGURED');
  }

  return prisma.employee.update({
    where: {
      id: employeeId,
    },
    data: {
      uniformShirtSize: uniform.shirtSize,
      uniformPantsSize: uniform.pantsSize,
      uniformShoeSize: uniform.shoeSize,
      status: 'pendente_informacoes',
    },
    select: {
      id: true,
    },
  });
}

export async function getEmployeeMetrics() {
  const employees = await listEmployees();

  return {
    total: employees.length,
    cadastroIniciado: employees.filter((item) => item.status === 'cadastro_iniciado').length,
    pendenteInformacoes: employees.filter((item) => item.status === 'pendente_informacoes').length,
    cadastroCompleto: employees.filter((item) => item.status === 'cadastro_completo').length,
    revisado: employees.filter((item) => item.status === 'revisado').length,
  };
}

export async function createEmployee(input: EmployeeCreateInput) {
  if (!isDatabaseConfigured()) {
    throw new Error('DATABASE_NOT_CONFIGURED');
  }

  const parsed = employeeCreateSchema.parse(input);

  return prisma.employee.create({
    data: {
      fullName: parsed.fullName,
      email: parsed.email || null,
      status: 'cadastro_iniciado',
    },
    select: {
      id: true,
      fullName: true,
      email: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}
