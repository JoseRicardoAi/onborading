import { NextResponse } from 'next/server';
import { adminUserCreateSchema, createAdminUser } from '@/lib/admin-users';
import { getAdminSessionFromRequest } from '@/lib/auth';
import { buildRequestUrl } from '@/lib/request-url';

export async function POST(request: Request) {
  if (!getAdminSessionFromRequest(request)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const formData = await request.formData();
  const redirectUrl = buildRequestUrl(request, '/configuracoes/usuarios');
  const parsed = adminUserCreateSchema.safeParse({
    fullName: formData.get('fullName'),
    email: formData.get('email'),
    password: formData.get('password'),
    passwordConfirmation: formData.get('passwordConfirmation'),
  });

  if (!parsed.success) {
    redirectUrl.searchParams.set('error', 'validation');
    return NextResponse.redirect(redirectUrl, { status: 303 });
  }

  try {
    await createAdminUser(parsed.data);
    redirectUrl.searchParams.set('created', '1');
    return NextResponse.redirect(redirectUrl, { status: 303 });
  } catch (error) {
    redirectUrl.searchParams.set(
      'error',
      error instanceof Error && error.message === 'DATABASE_NOT_CONFIGURED'
        ? 'database'
        : error instanceof Error && error.message === 'ADMIN_USER_ALREADY_EXISTS'
          ? 'duplicate'
          : error instanceof Error && error.message === 'DATABASE_SCHEMA_NOT_READY'
            ? 'schema'
          : 'unknown',
    );
    return NextResponse.redirect(redirectUrl, { status: 303 });
  }
}
