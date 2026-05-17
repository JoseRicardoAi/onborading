import { NextResponse } from 'next/server';
import {
  adminUserDeleteSchema,
  adminUserUpdateSchema,
  createAdminAuditLog,
  deleteAdminUser,
  updateAdminUser,
} from '@/lib/admin-users';
import { getAdminSessionFromRequest, verifyAdminCredentials } from '@/lib/auth';
import { buildRequestUrl } from '@/lib/request-url';

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

function mapAdminUserError(error: unknown) {
  if (!(error instanceof Error)) {
    return 'unknown';
  }

  switch (error.message) {
    case 'DATABASE_NOT_CONFIGURED':
      return 'database';
    case 'ADMIN_USER_ALREADY_EXISTS':
      return 'duplicate';
    case 'ADMIN_USER_NOT_FOUND':
      return 'not-found';
    case 'DATABASE_SCHEMA_NOT_READY':
      return 'schema';
    default:
      return 'unknown';
  }
}

export async function POST(request: Request, context: RouteContext) {
  const session = getAdminSessionFromRequest(request);

  if (!session) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const { id } = await context.params;
  const formData = await request.formData();
  const action = String(formData.get('action') ?? 'update');
  const redirectUrl = buildRequestUrl(request, '/configuracoes/usuarios');

  if (action === 'delete') {
    const parsed = adminUserDeleteSchema.safeParse({
      superAdminEmail: formData.get('superAdminEmail'),
      superAdminPassword: formData.get('superAdminPassword'),
    });

    if (!parsed.success) {
      redirectUrl.searchParams.set('error', 'super-admin-required');
      return NextResponse.redirect(redirectUrl, { status: 303 });
    }

    if (
      !verifyAdminCredentials(
        parsed.data.superAdminEmail,
        parsed.data.superAdminPassword,
      )
    ) {
      redirectUrl.searchParams.set('error', 'super-admin-invalid');
      return NextResponse.redirect(redirectUrl, { status: 303 });
    }

    try {
      const deletedUser = await deleteAdminUser(id);
      await createAdminAuditLog({
        actorAdminUserId: session.adminUserId,
        actorEmail: session.email,
        action: 'admin_user.deleted',
        entityType: 'admin_user',
        entityId: deletedUser.id,
        metadata: {
          deletedEmail: deletedUser.email,
          deletedFullName: deletedUser.fullName,
          authorizedBy: parsed.data.superAdminEmail.trim().toLowerCase(),
        },
      });
      redirectUrl.searchParams.set('deleted', '1');
      return NextResponse.redirect(redirectUrl, { status: 303 });
    } catch (error) {
      redirectUrl.searchParams.set('error', mapAdminUserError(error));
      return NextResponse.redirect(redirectUrl, { status: 303 });
    }
  }

  const parsed = adminUserUpdateSchema.safeParse({
    fullName: formData.get('fullName'),
    email: formData.get('email'),
    isActive: formData.get('isActive'),
    password: formData.get('password'),
    passwordConfirmation: formData.get('passwordConfirmation'),
  });

  if (!parsed.success) {
    redirectUrl.searchParams.set('error', 'validation');
    return NextResponse.redirect(redirectUrl, { status: 303 });
  }

  try {
    const updatedUser = await updateAdminUser(id, parsed.data);
    await createAdminAuditLog({
      actorAdminUserId: session.adminUserId,
      actorEmail: session.email,
      action: 'admin_user.updated',
      entityType: 'admin_user',
      entityId: updatedUser.id,
      metadata: {
        email: updatedUser.email,
        fullName: updatedUser.fullName,
        isActive: updatedUser.isActive,
        passwordChanged: Boolean(parsed.data.password),
      },
    });
    redirectUrl.searchParams.set('updated', '1');
    return NextResponse.redirect(redirectUrl, { status: 303 });
  } catch (error) {
    redirectUrl.searchParams.set('error', mapAdminUserError(error));
    return NextResponse.redirect(redirectUrl, { status: 303 });
  }
}
