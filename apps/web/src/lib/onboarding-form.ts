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
