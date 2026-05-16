import { NextResponse } from 'next/server';
import { getAdminSessionFromRequest } from '@/lib/auth';
import { sendDueReminders } from '@/lib/reminders';
import { buildRequestUrl } from '@/lib/request-url';

export async function POST(request: Request) {
  if (!getAdminSessionFromRequest(request)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const redirectUrl = buildRequestUrl(request, '/configuracoes/lembretes');

  try {
    const result = await sendDueReminders();
    redirectUrl.searchParams.set('run', '1');
    redirectUrl.searchParams.set('sent', String(result.sent));
    redirectUrl.searchParams.set('failed', String(result.failed));
    redirectUrl.searchParams.set('skipped', String(result.skipped));
    return NextResponse.redirect(redirectUrl, { status: 303 });
  } catch (error) {
    redirectUrl.searchParams.set(
      'error',
      error instanceof Error && error.message === 'DATABASE_NOT_CONFIGURED'
        ? 'database'
        : error instanceof Error && error.message === 'SMTP_NOT_CONFIGURED'
          ? 'smtp'
          : 'send',
    );
    return NextResponse.redirect(redirectUrl, { status: 303 });
  }
}
