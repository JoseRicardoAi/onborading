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

export type EmployeeChildInput = {
  name: string;
  gender: string;
  birthDate: string;
};

export type EmployeeSpouseInput = {
  hasSpouse: 'yes' | 'no';
  spouseName: string;
  spousePhone: string;
  weddingAnniversary: string;
};

export type EmployeeHealthInput = {
  continuousMedication: string;
  allergies: string;
  relevantCondition: string;
  workRestriction: string;
  additionalNotes: string;
  healthConsent?: 'accepted';
};

export type EmployeeEmergencyContactInput = {
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactAddress: string;
};

export type EmployeeEducationInput = {
  hasEducation: 'yes' | 'no';
  institution: string;
  courseName: string;
  courseSchedule: string;
  expectedEndDate: string;
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

export async function saveEmployeeOnboardingProfile(employeeId: string, profile: {
  fullName: string;
  birthDate: string;
  phone: string;
  email: string;
  instagram: string;
  residentialAddress: string;
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
      fullName: profile.fullName,
      birthDate: new Date(profile.birthDate),
      phone: profile.phone,
      email: profile.email,
      instagram: profile.instagram || null,
      residentialAddress: profile.residentialAddress,
      uniformShirtSize: profile.shirtSize,
      uniformPantsSize: profile.pantsSize,
      uniformShoeSize: profile.shoeSize,
      completionPercent: 30,
      status: 'pendente_informacoes',
    },
    select: {
      id: true,
    },
  });
}

export async function replaceEmployeeChildren(
  employeeId: string,
  children: EmployeeChildInput[],
) {
  if (!isDatabaseConfigured()) {
    throw new Error('DATABASE_NOT_CONFIGURED');
  }

  await prisma.employee.update({
    where: {
      id: employeeId,
    },
    data: {
      completionPercent: children.length > 0 ? 45 : 35,
      status: 'pendente_informacoes',
      children: {
        deleteMany: {},
        create: children.map((child) => ({
          name: child.name,
          gender: child.gender,
          birthDate: new Date(child.birthDate),
        })),
      },
    },
  });
}

export async function upsertEmployeeSpouse(
  employeeId: string,
  spouse: EmployeeSpouseInput,
) {
  if (!isDatabaseConfigured()) {
    throw new Error('DATABASE_NOT_CONFIGURED');
  }

  if (spouse.hasSpouse === 'no') {
    await prisma.spouse.deleteMany({
      where: {
        employeeId,
      },
    });

    await prisma.employee.update({
      where: { id: employeeId },
      data: {
        completionPercent: 55,
        status: 'pendente_informacoes',
      },
    });

    return;
  }

  await prisma.spouse.upsert({
    where: {
      employeeId,
    },
    create: {
      employeeId,
      name: spouse.spouseName,
      phone: spouse.spousePhone,
      weddingAnniversary: new Date(spouse.weddingAnniversary),
    },
    update: {
      name: spouse.spouseName,
      phone: spouse.spousePhone,
      weddingAnniversary: new Date(spouse.weddingAnniversary),
    },
  });

  await prisma.employee.update({
    where: {
      id: employeeId,
    },
    data: {
      completionPercent: 60,
      status: 'pendente_informacoes',
    },
  });
}

export async function upsertEmployeeHealthProfile(
  employeeId: string,
  health: EmployeeHealthInput,
) {
  if (!isDatabaseConfigured()) {
    throw new Error('DATABASE_NOT_CONFIGURED');
  }

  const hasSensitiveData = [
    health.continuousMedication,
    health.allergies,
    health.relevantCondition,
    health.workRestriction,
    health.additionalNotes,
  ].some((field) => field.length > 0);

  if (!hasSensitiveData) {
    await prisma.healthProfile.deleteMany({
      where: {
        employeeId,
      },
    });

    await prisma.employee.update({
      where: { id: employeeId },
      data: {
        completionPercent: 65,
        status: 'pendente_informacoes',
      },
    });

    return;
  }

  await prisma.healthProfile.upsert({
    where: {
      employeeId,
    },
    create: {
      employeeId,
      continuousMedication: health.continuousMedication || null,
      allergies: health.allergies || null,
      relevantCondition: health.relevantCondition || null,
      workRestriction: health.workRestriction || null,
      additionalNotes: health.additionalNotes || null,
      consentAcceptedAt: new Date(),
    },
    update: {
      continuousMedication: health.continuousMedication || null,
      allergies: health.allergies || null,
      relevantCondition: health.relevantCondition || null,
      workRestriction: health.workRestriction || null,
      additionalNotes: health.additionalNotes || null,
      consentAcceptedAt: new Date(),
    },
  });

  await prisma.employee.update({
    where: { id: employeeId },
    data: {
      completionPercent: 75,
      status: 'pendente_informacoes',
    },
  });
}

export async function upsertEmployeeEmergencyContact(
  employeeId: string,
  contact: EmployeeEmergencyContactInput,
) {
  if (!isDatabaseConfigured()) {
    throw new Error('DATABASE_NOT_CONFIGURED');
  }

  await prisma.emergencyContact.upsert({
    where: {
      employeeId,
    },
    create: {
      employeeId,
      name: contact.emergencyContactName,
      phone: contact.emergencyContactPhone,
      address: contact.emergencyContactAddress,
    },
    update: {
      name: contact.emergencyContactName,
      phone: contact.emergencyContactPhone,
      address: contact.emergencyContactAddress,
    },
  });

  await prisma.employee.update({
    where: { id: employeeId },
    data: {
      completionPercent: 85,
      status: 'pendente_informacoes',
    },
  });
}

export async function upsertEmployeeEducationProfile(
  employeeId: string,
  education: EmployeeEducationInput,
) {
  if (!isDatabaseConfigured()) {
    throw new Error('DATABASE_NOT_CONFIGURED');
  }

  if (education.hasEducation === 'no') {
    await prisma.educationProfile.deleteMany({
      where: {
        employeeId,
      },
    });

    await prisma.employee.update({
      where: { id: employeeId },
      data: {
        completionPercent: 90,
        status: 'pendente_informacoes',
      },
    });

    return;
  }

  await prisma.educationProfile.upsert({
    where: {
      employeeId,
    },
    create: {
      employeeId,
      institution: education.institution,
      courseName: education.courseName,
      courseSchedule: education.courseSchedule,
      expectedEndDate: new Date(education.expectedEndDate),
    },
    update: {
      institution: education.institution,
      courseName: education.courseName,
      courseSchedule: education.courseSchedule,
      expectedEndDate: new Date(education.expectedEndDate),
    },
  });

  await prisma.employee.update({
    where: { id: employeeId },
    data: {
      completionPercent: 95,
      status: 'pendente_informacoes',
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
