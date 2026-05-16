import { NextResponse } from 'next/server';
import { getAdminSessionFromRequest } from '@/lib/auth';
import { saveReminderSetting } from '@/lib/reminder-settings';
import { buildRequestUrl } from '@/lib/request-url';

export async function POST(request: Request) {
  if (!getAdminSessionFromRequest(request)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const formData = await request.formData();
  const redirectUrl = buildRequestUrl(request, '/configuracoes/lembretes');

  try {
    await saveReminderSetting({
      recipientEmails: String(formData.get('recipientEmails') ?? ''),
      daysBefore: formData
        .getAll('daysBefore')
        .map((value) => Number(value))
        .filter((value) => Number.isFinite(value)),
    });

    redirectUrl.searchParams.set('saved', '1');
    return NextResponse.redirect(redirectUrl, { status: 303 });
  } catch (error) {
    redirectUrl.searchParams.set(
      'error',
      error instanceof Error && error.message === 'DATABASE_NOT_CONFIGURED'
        ? 'database'
        : 'validation',
    );
    return NextResponse.redirect(redirectUrl, { status: 303 });
  }
}
