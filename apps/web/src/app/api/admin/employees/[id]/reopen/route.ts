import { NextResponse } from 'next/server';
import { getAdminSessionFromRequest } from '@/lib/auth';
import { getEmployeeDetail } from '@/lib/employees';
import { buildRequestUrl } from '@/lib/request-url';
import { reopenEmployeeOnboarding } from '@/lib/tokens';

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
  const employee = await getEmployeeDetail(id);

  if (!employee) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 });
  }

  const redirectUrl = buildRequestUrl(request, `/funcionarios/${id}`);

  if (
    employee.status !== 'cadastro_completo' &&
    employee.status !== 'revisado'
  ) {
    redirectUrl.searchParams.set('error', 'reopen-status');
    return NextResponse.redirect(redirectUrl, { status: 303 });
  }

  try {
    const { link, expiresAt } = await reopenEmployeeOnboarding(id);
    redirectUrl.searchParams.set('reopened', '1');
    redirectUrl.searchParams.set('link', link);
    redirectUrl.searchParams.set('expiresAt', expiresAt.toISOString());
    return NextResponse.redirect(redirectUrl, { status: 303 });
  } catch (error) {
    redirectUrl.searchParams.set(
      'error',
      error instanceof Error && error.message === 'DATABASE_NOT_CONFIGURED'
        ? 'database'
        : 'reopen',
    );
    return NextResponse.redirect(redirectUrl, { status: 303 });
  }
}
