import { NextResponse } from 'next/server';
import { adminSessionCookieName, shouldUseSecureAuthCookie } from '@/lib/auth';

export async function POST(request: Request) {
  const response = NextResponse.redirect(new URL('/login?loggedOut=1', request.url), {
    status: 303,
  });

  response.cookies.set({
    name: adminSessionCookieName,
    value: '',
    httpOnly: true,
    sameSite: 'lax',
    secure: shouldUseSecureAuthCookie(),
    path: '/',
    maxAge: 0,
  });

  return response;
}
