import { NextResponse } from 'next/server';
import { getAdminSessionFromRequest } from '@/lib/auth';
import { getEmployeeDetail, markEmployeeAsReviewed } from '@/lib/employees';
import { buildRequestUrl } from '@/lib/request-url';

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

  if (employee.status !== 'cadastro_completo') {
    redirectUrl.searchParams.set('error', 'review-status');
    return NextResponse.redirect(redirectUrl, { status: 303 });
  }

  try {
    await markEmployeeAsReviewed(id);
    redirectUrl.searchParams.set('reviewed', '1');
    return NextResponse.redirect(redirectUrl, { status: 303 });
  } catch (error) {
    redirectUrl.searchParams.set(
      'error',
      error instanceof Error && error.message === 'DATABASE_NOT_CONFIGURED'
        ? 'database'
        : 'review',
    );
    return NextResponse.redirect(redirectUrl, { status: 303 });
  }
}
