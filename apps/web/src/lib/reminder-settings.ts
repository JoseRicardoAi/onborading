import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { isDatabaseConfigured, prisma } from '@/lib/prisma';

const reminderDaysSchema = z
  .array(z.number().int().min(0).max(30))
  .min(1, 'Selecione pelo menos uma antecedencia.')
  .transform((value) => Array.from(new Set(value)).sort((left, right) => right - left));

export const reminderSettingsSchema = z.object({
  recipientEmails: z
    .string()
    .transform((value) =>
      value
        .split(/[\n,;]+/)
        .map((item) => item.trim().toLowerCase())
        .filter(Boolean),
    )
    .pipe(z.array(z.string().email('Informe apenas e-mails validos.')).min(1)),
  daysBefore: reminderDaysSchema,
});

export type ReminderSettingsInput = z.input<typeof reminderSettingsSchema>;
export type ReminderSettingsValues = z.infer<typeof reminderSettingsSchema>;

export type ReminderSettingSummary = {
  name: string;
  enabled: boolean;
  recipientEmails: string[];
  daysBefore: number[];
  includeEmployeeBirthdays: boolean;
  includeChildBirthdays: boolean;
  includeWeddingAnniversaries: boolean;
};

const defaultReminderSetting: ReminderSettingSummary = {
  name: 'default',
  enabled: true,
  recipientEmails: [],
  daysBefore: [7, 0],
  includeEmployeeBirthdays: true,
  includeChildBirthdays: true,
  includeWeddingAnniversaries: true,
};

export async function getReminderSetting(): Promise<ReminderSettingSummary> {
  if (!isDatabaseConfigured()) {
    return defaultReminderSetting;
  }

  try {
    const setting = await prisma.reminderSetting.findUnique({
      where: {
        name: 'default',
      },
      select: {
        name: true,
        enabled: true,
        recipientEmails: true,
        daysBefore: true,
        includeEmployeeBirthdays: true,
        includeChildBirthdays: true,
        includeWeddingAnniversaries: true,
      },
    });

    if (!setting) {
      return defaultReminderSetting;
    }

    return setting;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return defaultReminderSetting;
    }

    throw error;
  }
}

export async function saveReminderSetting(input: ReminderSettingsInput) {
  if (!isDatabaseConfigured()) {
    throw new Error('DATABASE_NOT_CONFIGURED');
  }

  const parsed = reminderSettingsSchema.parse(input);

  return prisma.reminderSetting.upsert({
    where: {
      name: 'default',
    },
    create: {
      name: 'default',
      enabled: true,
      recipientEmails: parsed.recipientEmails,
      daysBefore: parsed.daysBefore,
      includeEmployeeBirthdays: true,
      includeChildBirthdays: true,
      includeWeddingAnniversaries: true,
    },
    update: {
      recipientEmails: parsed.recipientEmails,
      daysBefore: parsed.daysBefore,
    },
    select: {
      name: true,
    },
  });
}
