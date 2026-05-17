import { NextResponse } from 'next/server';
import {
  adminSessionCookieName,
  createAdminSessionCookie,
  shouldUseSecureAuthCookie,
  verifyAdminCredentials,
} from '@/lib/auth';
import { authenticateAdminUser } from '@/lib/admin-users';

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = String(formData.get('email') ?? '');
  const password = String(formData.get('password') ?? '');
  const adminUser = await authenticateAdminUser(email, password);

  if (!adminUser && !verifyAdminCredentials(email, password)) {
    return NextResponse.json(
      { error: 'E-mail ou senha invalidos. Confira os dados e tente novamente.' },
      { status: 401 },
    );
  }

  const sessionValue = createAdminSessionCookie(adminUser?.email ?? email, {
    adminUserId: adminUser?.id,
    fullName: adminUser?.fullName,
    source: adminUser ? 'database' : 'environment',
  });

  if (!sessionValue) {
    return NextResponse.json(
      { error: 'A autenticacao ainda nao foi configurada no ambiente de deploy.' },
      { status: 500 },
    );
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: adminSessionCookieName,
    value: sessionValue,
    httpOnly: true,
    sameSite: 'lax',
    secure: shouldUseSecureAuthCookie(),
    path: '/',
    maxAge: 60 * 60 * 8,
  });

  return response;
}
