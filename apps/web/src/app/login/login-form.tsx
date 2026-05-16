'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';

type LoginFormProps = {
  loggedOut: boolean;
};

export function LoginForm({ loggedOut }: LoginFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<globalThis.HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await globalThis.fetch('/api/auth/login', {
        method: 'POST',
        body: new globalThis.FormData(event.currentTarget),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        setError(payload?.error ?? 'Nao foi possivel entrar agora. Tente novamente.');
        return;
      }

      router.replace('/admin');
      router.refresh();
    } catch {
      setError('Nao foi possivel conectar ao servidor. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      {error ? (
        <p className="form-message form-message-error" role="alert">
          {error}
        </p>
      ) : null}

      {loggedOut ? (
        <p className="form-message form-message-success">
          Sessao encerrada com sucesso.
        </p>
      ) : null}

      <form className="login-form" onSubmit={handleSubmit}>
        <label>
          E-mail
          <input
            type="email"
            name="email"
            autoComplete="email"
            disabled={isSubmitting}
            required
          />
        </label>

        <label>
          Senha
          <input
            type="password"
            name="password"
            autoComplete="current-password"
            disabled={isSubmitting}
            required
          />
        </label>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </>
  );
}
