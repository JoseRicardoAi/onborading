import { NextResponse } from 'next/server';
import { sendDueReminders } from '@/lib/reminders';

function isAuthorized(request: Request) {
  const configuredSecret = process.env.JOB_SECRET?.trim();

  if (!configuredSecret) {
    return false;
  }

  const bearerToken = request.headers
    .get('authorization')
    ?.replace(/^Bearer\s+/i, '')
    .trim();
  const headerSecret = request.headers.get('x-job-secret')?.trim();

  return bearerToken === configuredSecret || headerSecret === configuredSecret;
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  try {
    const result = await sendDueReminders();
    return NextResponse.json({
      ok: true,
      ...result,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : 'UNKNOWN_ERROR',
      },
      { status: 500 },
    );
  }
}
