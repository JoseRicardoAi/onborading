import { NextResponse } from 'next/server';
import { getAdminSessionFromRequest } from '@/lib/auth';
import { createAccessToken } from '@/lib/tokens';

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(request: Request, context: RouteContext) {
  if (!getAdminSessionFromRequest(request)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const { id } = await context.params;

  try {
    const { link, expiresAt } = await createAccessToken(id);
    const redirectUrl = new URL('/funcionarios', request.url);
    redirectUrl.searchParams.set('generated', '1');
    redirectUrl.searchParams.set('employeeId', id);
    redirectUrl.searchParams.set('link', link);
    redirectUrl.searchParams.set('expiresAt', expiresAt.toISOString());
    return NextResponse.redirect(redirectUrl, { status: 303 });
  } catch (error) {
    const redirectUrl = new URL('/funcionarios', request.url);
    redirectUrl.searchParams.set(
      'error',
      error instanceof Error && error.message === 'DATABASE_NOT_CONFIGURED'
        ? 'database'
        : 'token',
    );
    return NextResponse.redirect(redirectUrl, { status: 303 });
  }
}
