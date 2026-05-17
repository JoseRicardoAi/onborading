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

export type EmployeeListFilters = {
  search?: string;
  status?: OnboardingStatus | 'all';
};

export type EmployeeDetail = {
  id: string;
  fullName: string;
  birthDate: Date | null;
  phone: string | null;
  email: string | null;
  instagram: string | null;
  residentialAddress: string | null;
  uniformShirtSize: string | null;
  uniformPantsSize: string | null;
  uniformShoeSize: string | null;
  status: OnboardingStatus;
  completionPercent: number;
  submittedAt: Date | null;
  reviewedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  latestAccessToken: {
    expiresAt: Date;
    usedAt: Date | null;
    revokedAt: Date | null;
    createdAt: Date;
  } | null;
  children: Array<{
    id: string;
    name: string;
    gender: string | null;
    birthDate: Date;
  }>;
  spouse: {
    name: string;
    phone: string | null;
    weddingAnniversary: Date | null;
  } | null;
  healthProfile: {
    continuousMedication: string | null;
    allergies: string | null;
    relevantCondition: string | null;
    workRestriction: string | null;
    additionalNotes: string | null;
    consentAcceptedAt: Date | null;
  } | null;
  emergencyContact: {
    name: string;
    phone: string;
    address: string | null;
  } | null;
  educationProfile: {
    institution: string | null;
    courseName: string | null;
    courseSchedule: string | null;
    expectedEndDate: Date | null;
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

export type ImportantDateEvent = {
  kind: 'employee_birthday' | 'child_birthday' | 'wedding_anniversary';
  label: string;
  employeeId: string;
  employeeName: string;
  eventDate: Date;
  month: number;
  day: number;
};

export type EmployeeExportRow = {
  fullName: string;
  email: string;
  phone: string;
  status: string;
  birthDate: string;
  instagram: string;
  residentialAddress: string;
  uniformShirtSize: string;
  uniformPantsSize: string;
  uniformShoeSize: string;
  spouseName: string;
  spousePhone: string;
  weddingAnniversary: string;
  childrenSummary: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactAddress: string;
  educationInstitution: string;
  educationCourseName: string;
  educationCourseSchedule: string;
  educationExpectedEndDate: string;
  createdAt: string;
  updatedAt: string;
  submittedAt: string;
  reviewedAt: string;
};

export type ImportantDateExportRow = {
  referenceMonth: string;
  eventType: string;
  eventLabel: string;
  employeeName: string;
  eventDay: string;
  originalDate: string;
};

export type DashboardActionItem = {
  id: string;
  fullName: string;
  email: string | null;
  status: OnboardingStatus;
  completionPercent: number;
  reason: string;
  actionLabel: string;
  tone: 'urgent' | 'attention' | 'ready' | 'neutral';
  href: string;
  tokenState: 'active' | 'expired' | 'revoked' | 'used' | 'missing';
  updatedAt: Date;
};

export type OnboardingDashboardInsights = {
  averageProgress: number;
  waitingReview: number;
  links: {
    active: number;
    expired: number;
    missing: number;
    revoked: number;
  };
  funnel: Array<{
    status: OnboardingStatus;
    label: string;
    value: number;
  }>;
  actionItems: DashboardActionItem[];
};

function formatDateOnly(value: Date | null | undefined) {
  if (!value) {
    return '';
  }

  return value.toLocaleDateString('pt-BR', {
    timeZone: 'UTC',
  });
}

function formatDateTime(value: Date | null | undefined) {
  if (!value) {
    return '';
  }

  return value.toLocaleString('pt-BR');
}

export function getOnboardingStatusLabel(status: OnboardingStatus) {
  switch (status) {
    case 'cadastro_iniciado':
      return 'Cadastro iniciado';
    case 'pendente_informacoes':
      return 'Pendente de informacoes';
    case 'cadastro_completo':
      return 'Cadastro completo';
    case 'revisado':
      return 'Revisado';
    default:
      return status;
  }
}

function getImportantDateTypeLabel(kind: ImportantDateEvent['kind']) {
  switch (kind) {
    case 'employee_birthday':
      return 'Aniversario de funcionario';
    case 'child_birthday':
      return 'Aniversario de filho';
    case 'wedding_anniversary':
      return 'Aniversario de casamento';
    default:
      return kind;
  }
}

export async function listEmployees(
  filters: EmployeeListFilters = {},
): Promise<EmployeeSummary[]> {
  if (!isDatabaseConfigured()) {
    return [];
  }

  const trimmedSearch = filters.search?.trim();
  const normalizedStatus =
    filters.status && filters.status !== 'all' ? filters.status : undefined;

  try {
    const employees = await prisma.employee.findMany({
      where: {
        deletedAt: null,
        ...(trimmedSearch
          ? {
              fullName: {
                contains: trimmedSearch,
                mode: 'insensitive',
              },
            }
          : {}),
        ...(normalizedStatus
          ? {
              status: normalizedStatus,
            }
          : {}),
      },
      orderBy: {
        updatedAt: 'desc',
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

export async function getEmployeeDetail(
  employeeId: string,
): Promise<EmployeeDetail | null> {
  if (!isDatabaseConfigured()) {
    return null;
  }

  try {
    const employee = await prisma.employee.findFirst({
      where: {
        id: employeeId,
        deletedAt: null,
      },
      select: {
        id: true,
        fullName: true,
        birthDate: true,
        phone: true,
        email: true,
        instagram: true,
        residentialAddress: true,
        uniformShirtSize: true,
        uniformPantsSize: true,
        uniformShoeSize: true,
        status: true,
        completionPercent: true,
        submittedAt: true,
        reviewedAt: true,
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
        spouse: {
          select: {
            name: true,
            phone: true,
            weddingAnniversary: true,
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
        emergencyContact: {
          select: {
            name: true,
            phone: true,
            address: true,
          },
        },
        educationProfile: {
          select: {
            institution: true,
            courseName: true,
            courseSchedule: true,
            expectedEndDate: true,
          },
        },
      },
    });

    if (!employee) {
      return null;
    }

    return {
      ...employee,
      latestAccessToken: employee.onboardingAccessTokens[0] ?? null,
    };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return null;
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

export async function markEmployeeAsReviewed(employeeId: string) {
  if (!isDatabaseConfigured()) {
    throw new Error('DATABASE_NOT_CONFIGURED');
  }

  return prisma.employee.update({
    where: {
      id: employeeId,
    },
    data: {
      status: 'revisado',
      completionPercent: 100,
      reviewedAt: new Date(),
    },
    select: {
      id: true,
      status: true,
      reviewedAt: true,
    },
  });
}

export async function listImportantDateEvents(referenceDate = new Date()) {
  if (!isDatabaseConfigured()) {
    return {
      month: referenceDate.getMonth() + 1,
      year: referenceDate.getFullYear(),
      events: [] as ImportantDateEvent[],
    };
  }

  const month = referenceDate.getMonth() + 1;
  const year = referenceDate.getFullYear();

  try {
    const employees = await prisma.employee.findMany({
      where: {
        deletedAt: null,
      },
      select: {
        id: true,
        fullName: true,
        birthDate: true,
        spouse: {
          select: {
            weddingAnniversary: true,
          },
        },
        children: {
          select: {
            id: true,
            name: true,
            birthDate: true,
          },
        },
      },
    });

    const events = employees.flatMap((employee) => {
      const employeeEvents: ImportantDateEvent[] = [];

      if (employee.birthDate && employee.birthDate.getUTCMonth() + 1 === month) {
        employeeEvents.push({
          kind: 'employee_birthday',
          label: `Aniversario de ${employee.fullName}`,
          employeeId: employee.id,
          employeeName: employee.fullName,
          eventDate: employee.birthDate,
          month,
          day: employee.birthDate.getUTCDate(),
        });
      }

      if (
        employee.spouse?.weddingAnniversary &&
        employee.spouse.weddingAnniversary.getUTCMonth() + 1 === month
      ) {
        employeeEvents.push({
          kind: 'wedding_anniversary',
          label: `Aniversario de casamento de ${employee.fullName}`,
          employeeId: employee.id,
          employeeName: employee.fullName,
          eventDate: employee.spouse.weddingAnniversary,
          month,
          day: employee.spouse.weddingAnniversary.getUTCDate(),
        });
      }

      for (const child of employee.children) {
        if (child.birthDate.getUTCMonth() + 1 !== month) {
          continue;
        }

        employeeEvents.push({
          kind: 'child_birthday',
          label: `Aniversario de ${child.name} (${employee.fullName})`,
          employeeId: employee.id,
          employeeName: employee.fullName,
          eventDate: child.birthDate,
          month,
          day: child.birthDate.getUTCDate(),
        });
      }

      return employeeEvents;
    });

    events.sort((left, right) => {
      if (left.day !== right.day) {
        return left.day - right.day;
      }

      return left.label.localeCompare(right.label, 'pt-BR');
    });

    return {
      month,
      year,
      events,
    };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return {
        month,
        year,
        events: [] as ImportantDateEvent[],
      };
    }

    throw error;
  }
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

function getTokenState(
  token: DashboardActionItemSource['onboardingAccessTokens'][number] | null,
  referenceDate: Date,
): DashboardActionItem['tokenState'] {
  if (!token) {
    return 'missing';
  }

  if (token.usedAt) {
    return 'used';
  }

  if (token.revokedAt) {
    return 'revoked';
  }

  if (token.expiresAt.getTime() <= referenceDate.getTime()) {
    return 'expired';
  }

  return 'active';
}

type DashboardActionItemSource = {
  id: string;
  fullName: string;
  email: string | null;
  status: OnboardingStatus;
  completionPercent: number;
  updatedAt: Date;
  onboardingAccessTokens: Array<{
    expiresAt: Date;
    usedAt: Date | null;
    revokedAt: Date | null;
    createdAt: Date;
  }>;
};

function createDashboardActionItem(
  employee: DashboardActionItemSource,
  referenceDate: Date,
): DashboardActionItem | null {
  const latestToken = employee.onboardingAccessTokens[0] ?? null;
  const tokenState = getTokenState(latestToken, referenceDate);

  if (employee.status === 'cadastro_completo') {
    return {
      id: employee.id,
      fullName: employee.fullName,
      email: employee.email,
      status: employee.status,
      completionPercent: employee.completionPercent,
      reason: 'Cadastro completo aguardando conferencia do RH.',
      actionLabel: 'Revisar',
      tone: 'ready',
      href: `/funcionarios/${employee.id}`,
      tokenState,
      updatedAt: employee.updatedAt,
    };
  }

  if (employee.status === 'revisado') {
    return null;
  }

  if (tokenState === 'expired') {
    return {
      id: employee.id,
      fullName: employee.fullName,
      email: employee.email,
      status: employee.status,
      completionPercent: employee.completionPercent,
      reason: 'Link expirado antes da conclusao do cadastro.',
      actionLabel: 'Reenviar link',
      tone: 'urgent',
      href: `/funcionarios/${employee.id}`,
      tokenState,
      updatedAt: employee.updatedAt,
    };
  }

  if (tokenState === 'missing' || tokenState === 'revoked') {
    return {
      id: employee.id,
      fullName: employee.fullName,
      email: employee.email,
      status: employee.status,
      completionPercent: employee.completionPercent,
      reason:
        tokenState === 'missing'
          ? 'Cadastro ainda sem link ativo para o colaborador.'
          : 'Ultimo link foi revogado e precisa ser substituido.',
      actionLabel: 'Gerar link',
      tone: 'attention',
      href: `/funcionarios/${employee.id}`,
      tokenState,
      updatedAt: employee.updatedAt,
    };
  }

  if (employee.status === 'pendente_informacoes') {
    return {
      id: employee.id,
      fullName: employee.fullName,
      email: employee.email,
      status: employee.status,
      completionPercent: employee.completionPercent,
      reason: 'Formulario em andamento; acompanhe se o progresso estagnar.',
      actionLabel: 'Acompanhar',
      tone: 'neutral',
      href: `/funcionarios/${employee.id}`,
      tokenState,
      updatedAt: employee.updatedAt,
    };
  }

  return null;
}

function sortDashboardActions(
  left: DashboardActionItem,
  right: DashboardActionItem,
) {
  const priority = {
    urgent: 0,
    ready: 1,
    attention: 2,
    neutral: 3,
  } satisfies Record<DashboardActionItem['tone'], number>;

  if (priority[left.tone] !== priority[right.tone]) {
    return priority[left.tone] - priority[right.tone];
  }

  return right.updatedAt.getTime() - left.updatedAt.getTime();
}

export async function getOnboardingDashboardInsights(): Promise<OnboardingDashboardInsights> {
  const emptyFunnel = [
    'cadastro_iniciado',
    'pendente_informacoes',
    'cadastro_completo',
    'revisado',
  ].map((status) => ({
    status: status as OnboardingStatus,
    label: getOnboardingStatusLabel(status as OnboardingStatus),
    value: 0,
  }));

  if (!isDatabaseConfigured()) {
    return {
      averageProgress: 0,
      waitingReview: 0,
      links: {
        active: 0,
        expired: 0,
        missing: 0,
        revoked: 0,
      },
      funnel: emptyFunnel,
      actionItems: [],
    };
  }

  try {
    const referenceDate = new Date();
    const employees = await prisma.employee.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: {
        updatedAt: 'desc',
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        status: true,
        completionPercent: true,
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

    const links = employees.reduce(
      (acc, employee) => {
        const tokenState = getTokenState(
          employee.onboardingAccessTokens[0] ?? null,
          referenceDate,
        );

        if (tokenState === 'active') {
          acc.active += 1;
        }

        if (tokenState === 'expired') {
          acc.expired += 1;
        }

        if (tokenState === 'missing') {
          acc.missing += 1;
        }

        if (tokenState === 'revoked') {
          acc.revoked += 1;
        }

        return acc;
      },
      {
        active: 0,
        expired: 0,
        missing: 0,
        revoked: 0,
      },
    );

    const funnel = emptyFunnel.map((item) => ({
      ...item,
      value: employees.filter((employee) => employee.status === item.status).length,
    }));
    const actionItems = employees
      .map((employee) => createDashboardActionItem(employee, referenceDate))
      .filter((item): item is DashboardActionItem => Boolean(item))
      .sort(sortDashboardActions)
      .slice(0, 7);

    return {
      averageProgress:
        employees.length > 0
          ? Math.round(
              employees.reduce(
                (sum, employee) => sum + employee.completionPercent,
                0,
              ) / employees.length,
            )
          : 0,
      waitingReview: employees.filter(
        (employee) => employee.status === 'cadastro_completo',
      ).length,
      links,
      funnel,
      actionItems,
    };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return {
        averageProgress: 0,
        waitingReview: 0,
        links: {
          active: 0,
          expired: 0,
          missing: 0,
          revoked: 0,
        },
        funnel: emptyFunnel,
        actionItems: [],
      };
    }

    throw error;
  }
}

export async function listEmployeeExportRows(): Promise<EmployeeExportRow[]> {
  if (!isDatabaseConfigured()) {
    return [];
  }

  try {
    const employees = await prisma.employee.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: {
        fullName: 'asc',
      },
      select: {
        fullName: true,
        email: true,
        phone: true,
        status: true,
        birthDate: true,
        instagram: true,
        residentialAddress: true,
        uniformShirtSize: true,
        uniformPantsSize: true,
        uniformShoeSize: true,
        createdAt: true,
        updatedAt: true,
        submittedAt: true,
        reviewedAt: true,
        spouse: {
          select: {
            name: true,
            phone: true,
            weddingAnniversary: true,
          },
        },
        children: {
          orderBy: {
            birthDate: 'asc',
          },
          select: {
            name: true,
            gender: true,
            birthDate: true,
          },
        },
        emergencyContact: {
          select: {
            name: true,
            phone: true,
            address: true,
          },
        },
        educationProfile: {
          select: {
            institution: true,
            courseName: true,
            courseSchedule: true,
            expectedEndDate: true,
          },
        },
      },
    });

    return employees.map((employee) => ({
      fullName: employee.fullName,
      email: employee.email ?? '',
      phone: employee.phone ?? '',
      status: getOnboardingStatusLabel(employee.status),
      birthDate: formatDateOnly(employee.birthDate),
      instagram: employee.instagram ?? '',
      residentialAddress: employee.residentialAddress ?? '',
      uniformShirtSize: employee.uniformShirtSize ?? '',
      uniformPantsSize: employee.uniformPantsSize ?? '',
      uniformShoeSize: employee.uniformShoeSize ?? '',
      spouseName: employee.spouse?.name ?? '',
      spousePhone: employee.spouse?.phone ?? '',
      weddingAnniversary: formatDateOnly(employee.spouse?.weddingAnniversary),
      childrenSummary: employee.children
        .map((child) => {
          const childParts = [child.name];

          if (child.gender) {
            childParts.push(child.gender);
          }

          childParts.push(formatDateOnly(child.birthDate));
          return childParts.filter(Boolean).join(' - ');
        })
        .join(' | '),
      emergencyContactName: employee.emergencyContact?.name ?? '',
      emergencyContactPhone: employee.emergencyContact?.phone ?? '',
      emergencyContactAddress: employee.emergencyContact?.address ?? '',
      educationInstitution: employee.educationProfile?.institution ?? '',
      educationCourseName: employee.educationProfile?.courseName ?? '',
      educationCourseSchedule: employee.educationProfile?.courseSchedule ?? '',
      educationExpectedEndDate: formatDateOnly(
        employee.educationProfile?.expectedEndDate,
      ),
      createdAt: formatDateTime(employee.createdAt),
      updatedAt: formatDateTime(employee.updatedAt),
      submittedAt: formatDateTime(employee.submittedAt),
      reviewedAt: formatDateTime(employee.reviewedAt),
    }));
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return [];
    }

    throw error;
  }
}

export async function listImportantDateExportRows(referenceDate = new Date()) {
  const importantDates = await listImportantDateEvents(referenceDate);
  const referenceMonth = new Date(
    importantDates.year,
    importantDates.month - 1,
    1,
  ).toLocaleDateString('pt-BR', {
    month: 'long',
    year: 'numeric',
  });

  return importantDates.events.map<ImportantDateExportRow>((event) => ({
    referenceMonth,
    eventType: getImportantDateTypeLabel(event.kind),
    eventLabel: event.label,
    employeeName: event.employeeName,
    eventDay: `${String(event.day).padStart(2, '0')}/${String(
      importantDates.month,
    ).padStart(2, '0')}`,
    originalDate: formatDateOnly(event.eventDate),
  }));
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
