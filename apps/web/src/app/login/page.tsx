type LoginPageProps = {
  searchParams?: Promise<{
    error?: string;
    loggedOut?: string;
  }>;
};

const errorMessages: Record<string, string> = {
  invalid: 'E-mail ou senha invalidos. Confira os dados e tente novamente.',
  config: 'A autenticacao ainda nao foi configurada no ambiente de deploy.',
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const errorMessage = params?.error ? errorMessages[params.error] : null;
  const loggedOut = params?.loggedOut === '1';

  return (
    <main className="auth-shell">
      <section className="auth-panel" aria-labelledby="login-title">
        <p className="eyebrow">Acesso administrativo</p>
        <h1 id="login-title">Entrar no onboarding</h1>
        <p className="auth-copy">
          Use suas credenciais internas para acessar o painel de onboarding.
        </p>

        {errorMessage ? (
          <p className="form-message form-message-error" role="alert">
            {errorMessage}
          </p>
        ) : null}

        {loggedOut ? (
          <p className="form-message form-message-success">
            Sessao encerrada com sucesso.
          </p>
        ) : null}

        <form className="login-form" action="/api/auth/login" method="post">
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

          <button type="submit">
            Entrar
          </button>
        </form>
      </section>
    </main>
  );
}
