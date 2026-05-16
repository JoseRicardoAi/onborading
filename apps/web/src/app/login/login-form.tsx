'use client';

import { useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  initialLoginActionState,
  loginAction,
  type LoginActionState,
} from '@/app/login/actions';

type LoginFormProps = {
  loggedOut: boolean;
};

export function LoginForm({ loggedOut }: LoginFormProps) {
  const router = useRouter();
  const [state, formAction] = useActionState<LoginActionState, globalThis.FormData>(
    loginAction,
    initialLoginActionState,
  );

  useEffect(() => {
    if (!state.success) {
      return;
    }

    router.replace('/admin');
    router.refresh();
  }, [router, state.success]);

  return (
    <>
      {state.error ? (
        <p className="form-message form-message-error" role="alert">
          {state.error}
        </p>
      ) : null}

      {loggedOut ? (
        <p className="form-message form-message-success">
          Sessao encerrada com sucesso.
        </p>
      ) : null}

      <form className="login-form" action={formAction}>
        <label>
          E-mail
          <input type="email" name="email" autoComplete="email" required />
        </label>

        <label>
          Senha
          <input
            type="password"
            name="password"
            autoComplete="current-password"
            required
          />
        </label>

        <button type="submit">Entrar</button>
      </form>
    </>
  );
}
