import { NextResponse } from 'next/server';
import {
  adminSessionCookieName,
  createAdminSessionCookie,
  shouldUseSecureAuthCookie,
  verifyAdminCredentials,
} from '@/lib/auth';

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = String(formData.get('email') ?? '');
  const password = String(formData.get('password') ?? '');

  if (!verifyAdminCredentials(email, password)) {
    return NextResponse.redirect(new URL('/login?error=invalid', request.url), {
      status: 303,
    });
  }

  const sessionValue = createAdminSessionCookie(email);

  if (!sessionValue) {
    return NextResponse.redirect(new URL('/login?error=config', request.url), {
      status: 303,
    });
  }

  const response = NextResponse.redirect(new URL('/admin', request.url), {
    status: 303,
  });

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
