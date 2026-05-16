'use server';

import { cookies } from 'next/headers';
import {
  adminSessionCookieName,
  createAdminSessionCookie,
  shouldUseSecureAuthCookie,
  verifyAdminCredentials,
} from '@/lib/auth';

export type LoginActionState = {
  error: string | null;
  success: boolean;
};

export const initialLoginActionState: LoginActionState = {
  error: null,
  success: false,
};

export async function loginAction(
  _previousState: LoginActionState,
  formData: globalThis.FormData,
): Promise<LoginActionState> {
  const email = String(formData.get('email') ?? '');
  const password = String(formData.get('password') ?? '');

  if (!verifyAdminCredentials(email, password)) {
    return {
      error: 'E-mail ou senha invalidos. Confira os dados e tente novamente.',
      success: false,
    };
  }

  const sessionValue = createAdminSessionCookie(email);

  if (!sessionValue) {
    return {
      error: 'A autenticacao ainda nao foi configurada no ambiente de deploy.',
      success: false,
    };
  }

  const cookieStore = await cookies();
  cookieStore.set({
    name: adminSessionCookieName,
    value: sessionValue,
    httpOnly: true,
    sameSite: 'lax',
    secure: shouldUseSecureAuthCookie(),
    path: '/',
    maxAge: 60 * 60 * 8,
  });

  return {
    error: null,
    success: true,
  };
}
