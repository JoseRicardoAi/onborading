import { NextResponse } from 'next/server';
import {
  adminUserCreateSchema,
  createAdminAuditLog,
  createAdminUser,
} from '@/lib/admin-users';
import { getAdminSessionFromRequest } from '@/lib/auth';
import { buildRequestUrl } from '@/lib/request-url';

export async function POST(request: Request) {
  const session = getAdminSessionFromRequest(request);

  if (!session) {
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
    const adminUser = await createAdminUser(parsed.data);
    await createAdminAuditLog({
      actorAdminUserId: session.adminUserId,
      actorEmail: session.email,
      action: 'admin_user.created',
      entityType: 'admin_user',
      entityId: adminUser.id,
      metadata: {
        email: adminUser.email,
        fullName: adminUser.fullName,
      },
    });
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
