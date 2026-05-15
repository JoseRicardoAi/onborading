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

export const uniformFormSchema = z.object({
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

export type UniformFormValues = z.infer<typeof uniformFormSchema>;
