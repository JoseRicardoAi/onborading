import { z } from 'zod';

export const shirtSizes = ['P', 'M', 'G', 'GG'] as const;

export const pantsSizes = [
  '34',
  '36',
  '38',
  '40',
  '42',
  '44',
  '46',
  '48',
  '50',
  '52',
  '54',
  '56',
] as const;

export const shoeSizes = [
  '33',
  '34',
  '35',
  '36',
  '37',
  '38',
  '39',
  '40',
  '41',
  '42',
  '43',
  '44',
  '45',
] as const;

export const measurementGuide = [
  {
    shirtSize: 'P',
    shirtReference: 'veste busto entre 88 e 94 cm',
    pantsSize: '36-38',
    shoeSize: '33-35',
  },
  {
    shirtSize: 'M',
    shirtReference: 'veste busto entre 95 e 102 cm',
    pantsSize: '40-42',
    shoeSize: '36-38',
  },
  {
    shirtSize: 'G',
    shirtReference: 'veste busto entre 103 e 110 cm',
    pantsSize: '44-46',
    shoeSize: '39-41',
  },
  {
    shirtSize: 'GG',
    shirtReference: 'veste busto entre 111 e 118 cm',
    pantsSize: '48-52',
    shoeSize: '42-45',
  },
] as const;

const optionalTrimmedString = z
  .string()
  .trim()
  .optional()
  .transform((value) => value?.trim() || '');

export const onboardingPersonalDataSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(3, 'Informe seu nome completo.'),
  birthDate: z
    .string()
    .trim()
    .min(1, 'Informe sua data de nascimento.')
    .refine((value) => !Number.isNaN(Date.parse(value)), {
      message: 'Informe uma data de nascimento valida.',
    }),
  phone: z
    .string()
    .trim()
    .min(8, 'Informe um numero de celular valido.'),
  email: z
    .string()
    .trim()
    .email('Informe um e-mail valido.'),
  instagram: optionalTrimmedString,
  residentialAddress: z
    .string()
    .trim()
    .min(8, 'Informe seu endereco residencial.'),
});

export const onboardingUniformSchema = z.object({
  shirtSize: z.enum(shirtSizes, {
    errorMap: () => ({ message: 'Selecione um tamanho de camiseta valido.' }),
  }),
  pantsSize: z.enum(pantsSizes, {
    errorMap: () => ({ message: 'Selecione uma numeracao de calca valida.' }),
  }),
  shoeSize: z.enum(shoeSizes, {
    errorMap: () => ({ message: 'Selecione um tamanho de calcado valido.' }),
  }),
});

export const onboardingProfileSchema = onboardingPersonalDataSchema.merge(
  onboardingUniformSchema,
);

export type OnboardingProfileValues = z.infer<typeof onboardingProfileSchema>;

export const childSchema = z.object({
  name: z.string().trim().min(2, 'Informe o nome da crianca.'),
  gender: z.string().trim().min(1, 'Selecione o genero.'),
  birthDate: z
    .string()
    .trim()
    .min(1, 'Informe a data de aniversario.')
    .refine((value) => !Number.isNaN(Date.parse(value)), {
      message: 'Informe uma data de aniversario valida.',
    }),
});

export const onboardingChildrenSchema = z
  .object({
    hasChildren: z.enum(['yes', 'no']),
    children: z.array(childSchema),
  })
  .superRefine((value, ctx) => {
    if (value.hasChildren === 'yes' && value.children.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Adicione pelo menos um filho para continuar.',
        path: ['children'],
      });
    }

    if (value.hasChildren === 'no' && value.children.length > 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Remova os filhos ou marque que possui filhos.',
        path: ['children'],
      });
    }
  });

export type OnboardingChildrenValues = z.infer<typeof onboardingChildrenSchema>;

export const onboardingSpouseSchema = z
  .object({
    hasSpouse: z.enum(['yes', 'no']),
    spouseName: optionalTrimmedString,
    spousePhone: optionalTrimmedString,
    weddingAnniversary: optionalTrimmedString,
  })
  .superRefine((value, ctx) => {
    if (value.hasSpouse === 'yes') {
      if (value.spouseName.length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Informe o nome do conjuge.',
          path: ['spouseName'],
        });
      }

      if (value.spousePhone.length < 8) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Informe o telefone do conjuge.',
          path: ['spousePhone'],
        });
      }

      if (
        value.weddingAnniversary.length === 0 ||
        Number.isNaN(Date.parse(value.weddingAnniversary))
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Informe a data de aniversario de casamento.',
          path: ['weddingAnniversary'],
        });
      }
    }
  });

export type OnboardingSpouseValues = z.infer<typeof onboardingSpouseSchema>;

export const onboardingHealthSchema = z
  .object({
    continuousMedication: optionalTrimmedString,
    allergies: optionalTrimmedString,
    relevantCondition: optionalTrimmedString,
    workRestriction: optionalTrimmedString,
    additionalNotes: optionalTrimmedString,
    healthConsent: z.enum(['accepted']).optional(),
  })
  .superRefine((value, ctx) => {
    const hasSensitiveData = [
      value.continuousMedication,
      value.allergies,
      value.relevantCondition,
      value.workRestriction,
      value.additionalNotes,
    ].some((field) => field.length > 0);

    if (hasSensitiveData && value.healthConsent !== 'accepted') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Aceite o consentimento para salvar informacoes de saude.',
        path: ['healthConsent'],
      });
    }
  });

export type OnboardingHealthValues = z.infer<typeof onboardingHealthSchema>;

export const onboardingEmergencyContactSchema = z.object({
  emergencyContactName: z
    .string()
    .trim()
    .min(2, 'Informe o nome do familiar ou responsavel.'),
  emergencyContactPhone: z
    .string()
    .trim()
    .min(8, 'Informe o numero de celular do contato de emergencia.'),
  emergencyContactAddress: z
    .string()
    .trim()
    .min(8, 'Informe o endereco do contato de emergencia.'),
});

export type OnboardingEmergencyContactValues = z.infer<
  typeof onboardingEmergencyContactSchema
>;

export const onboardingEducationSchema = z
  .object({
    hasEducation: z.enum(['yes', 'no']),
    institution: optionalTrimmedString,
    courseName: optionalTrimmedString,
    courseSchedule: optionalTrimmedString,
    expectedEndDate: optionalTrimmedString,
  })
  .superRefine((value, ctx) => {
    if (value.hasEducation === 'yes') {
      if (value.institution.length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Informe a instituicao.',
          path: ['institution'],
        });
      }

      if (value.courseName.length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Informe o curso.',
          path: ['courseName'],
        });
      }

      if (value.courseSchedule.length < 3) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Informe o horario do curso.',
          path: ['courseSchedule'],
        });
      }

      if (
        value.expectedEndDate.length === 0 ||
        Number.isNaN(Date.parse(value.expectedEndDate))
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Informe a previsao de termino.',
          path: ['expectedEndDate'],
        });
      }
    }
  });

export type OnboardingEducationValues = z.infer<typeof onboardingEducationSchema>;

export const onboardingFinalizeSchema = z.object({
  finalConfirmation: z.literal('accepted', {
    errorMap: () => ({
      message: 'Confirme a revisao dos dados antes de finalizar.',
    }),
  }),
});

export type OnboardingFinalizeValues = z.infer<typeof onboardingFinalizeSchema>;

export type OnboardingCompletionSnapshot = {
  fullName: string;
  birthDate: Date | null;
  phone: string | null;
  email: string | null;
  residentialAddress: string | null;
  uniformShirtSize: string | null;
  uniformPantsSize: string | null;
  uniformShoeSize: string | null;
  emergencyContact: {
    name: string;
    phone: string;
    address: string | null;
  } | null;
};

export function getOnboardingCompletionIssues(
  snapshot: OnboardingCompletionSnapshot,
) {
  const issues: string[] = [];

  if (!snapshot.fullName || snapshot.fullName.trim().length < 3) {
    issues.push('Nome completo');
  }

  if (!snapshot.birthDate) {
    issues.push('Data de nascimento');
  }

  if (!snapshot.phone || snapshot.phone.trim().length < 8) {
    issues.push('Celular');
  }

  if (!snapshot.email || snapshot.email.trim().length === 0) {
    issues.push('E-mail');
  }

  if (
    !snapshot.residentialAddress ||
    snapshot.residentialAddress.trim().length < 8
  ) {
    issues.push('Endereco residencial');
  }

  if (!snapshot.uniformShirtSize) {
    issues.push('Tamanho da camiseta');
  }

  if (!snapshot.uniformPantsSize) {
    issues.push('Numeracao da calca');
  }

  if (!snapshot.uniformShoeSize) {
    issues.push('Tamanho do calcado');
  }

  if (!snapshot.emergencyContact) {
    issues.push('Contato de emergencia');
  } else {
    if (snapshot.emergencyContact.name.trim().length < 2) {
      issues.push('Nome do contato de emergencia');
    }

    if (snapshot.emergencyContact.phone.trim().length < 8) {
      issues.push('Celular do contato de emergencia');
    }

    if (
      !snapshot.emergencyContact.address ||
      snapshot.emergencyContact.address.trim().length < 8
    ) {
      issues.push('Endereco do contato de emergencia');
    }
  }

  return issues;
}
