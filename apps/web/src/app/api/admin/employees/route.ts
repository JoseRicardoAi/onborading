import { NextResponse } from 'next/server';
import { employeeCreateSchema, listEmployees, createEmployee } from '@/lib/employees';
import { getAdminSessionFromRequest } from '@/lib/auth';

export async function GET(request: Request) {
  if (!getAdminSessionFromRequest(request)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const employees = await listEmployees();
  return NextResponse.json({ employees });
}

export async function POST(request: Request) {
  if (!getAdminSessionFromRequest(request)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const formData = await request.formData();
  const parsed = employeeCreateSchema.safeParse({
    fullName: formData.get('fullName'),
    email: formData.get('email'),
  });

  if (!parsed.success) {
    const redirectUrl = new URL('/funcionarios/novo', request.url);
    redirectUrl.searchParams.set('error', 'validation');
    return NextResponse.redirect(redirectUrl, { status: 303 });
  }

  try {
    await createEmployee(parsed.data);
    const redirectUrl = new URL('/funcionarios', request.url);
    redirectUrl.searchParams.set('created', '1');
    return NextResponse.redirect(redirectUrl, { status: 303 });
  } catch (error) {
    const redirectUrl = new URL('/funcionarios/novo', request.url);
    redirectUrl.searchParams.set(
      'error',
      error instanceof Error && error.message === 'DATABASE_NOT_CONFIGURED'
        ? 'database'
        : 'unknown',
    );
    return NextResponse.redirect(redirectUrl, { status: 303 });
  }
}
