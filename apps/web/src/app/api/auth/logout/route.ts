import { NextResponse } from 'next/server';
import { adminSessionCookieName, shouldUseSecureAuthCookie } from '@/lib/auth';
import { buildRequestUrl } from '@/lib/request-url';

export async function POST(request: Request) {
  const response = NextResponse.redirect(buildRequestUrl(request, '/login?loggedOut=1'), {
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
