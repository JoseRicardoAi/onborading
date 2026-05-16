import { ReminderEventType, ReminderStatus } from '@prisma/client';
import nodemailer from 'nodemailer';
import { isDatabaseConfigured, prisma } from '@/lib/prisma';

type DueReminder = {
  employeeId: string;
  employeeName: string;
  eventType: ReminderEventType;
  eventDate: Date;
  relatedName: string | null;
};

type ReminderRunResult = {
  totalDue: number;
  sent: number;
  failed: number;
  skipped: number;
};

function isSmtpConfigured() {
  return Boolean(
    process.env.SMTP_HOST?.trim() &&
      process.env.SMTP_PORT?.trim() &&
      process.env.SMTP_FROM?.trim(),
  );
}

function getEventTypeLabel(eventType: ReminderEventType) {
  switch (eventType) {
    case 'employee_birthday':
      return 'aniversario de funcionario';
    case 'child_birthday':
      return 'aniversario de filho';
    case 'wedding_anniversary':
      return 'aniversario de casamento';
  }
}

function buildOccurrenceDate(baseDate: Date, year: number) {
  return new Date(
    Date.UTC(year, baseDate.getUTCMonth(), baseDate.getUTCDate(), 12, 0, 0),
  );
}

function addDays(referenceDate: Date, days: number) {
  const value = new Date(
    Date.UTC(
      referenceDate.getUTCFullYear(),
      referenceDate.getUTCMonth(),
      referenceDate.getUTCDate(),
      12,
      0,
      0,
    ),
  );

  value.setUTCDate(value.getUTCDate() + days);
  return value;
}

function sameMonthDay(left: Date, right: Date) {
  return (
    left.getUTCMonth() === right.getUTCMonth() &&
    left.getUTCDate() === right.getUTCDate()
  );
}

async function listDueReminders(referenceDate: Date) {
  const setting = await prisma.reminderSetting.findUnique({
    where: {
      name: 'default',
    },
    select: {
      id: true,
      enabled: true,
      daysBefore: true,
      recipientEmails: true,
      includeEmployeeBirthdays: true,
      includeChildBirthdays: true,
      includeWeddingAnniversaries: true,
    },
  });

  if (
    !setting ||
    !setting.enabled ||
    setting.recipientEmails.length === 0 ||
    setting.daysBefore.length === 0
  ) {
    return {
      settingId: setting?.id ?? null,
      recipientEmails: setting?.recipientEmails ?? [],
      reminders: [] as DueReminder[],
    };
  }

  const employees = await prisma.employee.findMany({
    where: {
      deletedAt: null,
    },
    select: {
      id: true,
      fullName: true,
      birthDate: true,
      children: {
        select: {
          name: true,
          birthDate: true,
        },
      },
      spouse: {
        select: {
          weddingAnniversary: true,
        },
      },
    },
  });

  const reminders: DueReminder[] = [];

  for (const employee of employees) {
    if (setting.includeEmployeeBirthdays && employee.birthDate) {
      for (const daysBefore of setting.daysBefore) {
        const targetDate = addDays(referenceDate, daysBefore);
        const occurrenceDate = buildOccurrenceDate(
          employee.birthDate,
          targetDate.getUTCFullYear(),
        );

        if (sameMonthDay(occurrenceDate, targetDate)) {
          reminders.push({
            employeeId: employee.id,
            employeeName: employee.fullName,
            eventType: 'employee_birthday',
            eventDate: occurrenceDate,
            relatedName: null,
          });
          break;
        }
      }
    }

    if (setting.includeChildBirthdays) {
      for (const child of employee.children) {
        for (const daysBefore of setting.daysBefore) {
          const targetDate = addDays(referenceDate, daysBefore);
          const occurrenceDate = buildOccurrenceDate(
            child.birthDate,
            targetDate.getUTCFullYear(),
          );

          if (sameMonthDay(occurrenceDate, targetDate)) {
            reminders.push({
              employeeId: employee.id,
              employeeName: employee.fullName,
              eventType: 'child_birthday',
              eventDate: occurrenceDate,
              relatedName: child.name,
            });
            break;
          }
        }
      }
    }

    if (
      setting.includeWeddingAnniversaries &&
      employee.spouse?.weddingAnniversary
    ) {
      for (const daysBefore of setting.daysBefore) {
        const targetDate = addDays(referenceDate, daysBefore);
        const occurrenceDate = buildOccurrenceDate(
          employee.spouse.weddingAnniversary,
          targetDate.getUTCFullYear(),
        );

        if (sameMonthDay(occurrenceDate, targetDate)) {
          reminders.push({
            employeeId: employee.id,
            employeeName: employee.fullName,
            eventType: 'wedding_anniversary',
            eventDate: occurrenceDate,
            relatedName: null,
          });
          break;
        }
      }
    }
  }

  return {
    settingId: setting.id,
    recipientEmails: setting.recipientEmails,
    reminders,
  };
}

function createReminderTransport() {
  if (!isSmtpConfigured()) {
    throw new Error('SMTP_NOT_CONFIGURED');
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? '587'),
    secure: Number(process.env.SMTP_PORT ?? '587') === 465,
    auth: process.env.SMTP_USER
      ? {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        }
      : undefined,
  });
}

async function sendReminderEmail(
  transporter: nodemailer.Transporter,
  recipientEmails: string[],
  reminder: DueReminder,
) {
  const eventDateText = reminder.eventDate.toLocaleDateString('pt-BR', {
    timeZone: 'UTC',
  });
  const subject = `Lembrete: ${getEventTypeLabel(reminder.eventType)} em ${eventDateText}`;
  const description =
    reminder.eventType === 'employee_birthday'
      ? `Aniversario de ${reminder.employeeName}`
      : reminder.eventType === 'child_birthday'
        ? `Aniversario de ${reminder.relatedName} (filho(a) de ${reminder.employeeName})`
        : `Aniversario de casamento de ${reminder.employeeName}`;

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: recipientEmails.join(', '),
    subject,
    text: [
      'Lembrete automatico do onboarding Du Ramo.',
      '',
      description,
      `Data do evento: ${eventDateText}`,
    ].join('\n'),
  });
}

export async function sendDueReminders(referenceDate = new Date()): Promise<ReminderRunResult> {
  if (!isDatabaseConfigured()) {
    throw new Error('DATABASE_NOT_CONFIGURED');
  }

  const normalizedDate = new Date(
    Date.UTC(
      referenceDate.getUTCFullYear(),
      referenceDate.getUTCMonth(),
      referenceDate.getUTCDate(),
      12,
      0,
      0,
    ),
  );

  const { settingId, recipientEmails, reminders } = await listDueReminders(normalizedDate);

  if (!settingId || reminders.length === 0) {
    return {
      totalDue: reminders.length,
      sent: 0,
      failed: 0,
      skipped: reminders.length,
    };
  }

  const transporter = createReminderTransport();
  const dayStart = new Date(
    Date.UTC(
      normalizedDate.getUTCFullYear(),
      normalizedDate.getUTCMonth(),
      normalizedDate.getUTCDate(),
      0,
      0,
      0,
    ),
  );
  const dayEnd = new Date(
    Date.UTC(
      normalizedDate.getUTCFullYear(),
      normalizedDate.getUTCMonth(),
      normalizedDate.getUTCDate(),
      23,
      59,
      59,
      999,
    ),
  );

  let sent = 0;
  let failed = 0;
  let skipped = 0;

  for (const reminder of reminders) {
    const existingEvent = await prisma.reminderEvent.findFirst({
      where: {
        employeeId: reminder.employeeId,
        settingId,
        eventType: reminder.eventType,
        eventDate: reminder.eventDate,
        relatedName: reminder.relatedName,
        createdAt: {
          gte: dayStart,
          lte: dayEnd,
        },
      },
      select: {
        id: true,
      },
    });

    if (existingEvent) {
      skipped += 1;
      continue;
    }

    const reminderEvent = await prisma.reminderEvent.create({
      data: {
        employeeId: reminder.employeeId,
        settingId,
        eventType: reminder.eventType,
        eventDate: reminder.eventDate,
        relatedName: reminder.relatedName,
        recipientEmails,
        status: ReminderStatus.pending,
      },
      select: {
        id: true,
      },
    });

    try {
      await sendReminderEmail(transporter, recipientEmails, reminder);

      await prisma.reminderEvent.update({
        where: {
          id: reminderEvent.id,
        },
        data: {
          status: ReminderStatus.sent,
          sentAt: new Date(),
        },
      });

      sent += 1;
    } catch (error) {
      await prisma.reminderEvent.update({
        where: {
          id: reminderEvent.id,
        },
        data: {
          status: ReminderStatus.failed,
          errorMessage:
            error instanceof Error ? error.message.slice(0, 500) : 'UNKNOWN_ERROR',
        },
      });

      failed += 1;
    }
  }

  return {
    totalDue: reminders.length,
    sent,
    failed,
    skipped,
  };
}
