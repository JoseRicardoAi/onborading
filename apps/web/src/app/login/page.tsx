export default function LoginPage() {
  return (
    <main className="auth-shell">
      <section className="auth-panel" aria-labelledby="login-title">
        <p className="eyebrow">Acesso administrativo</p>
        <h1 id="login-title">Entrar no onboarding</h1>
        <p className="auth-copy">
          A autenticacao completa sera implementada na Story 1.2. Esta tela
          reserva o ponto de entrada administrativo da aplicacao.
        </p>

        <form className="login-form">
          <label>
            E-mail
            <input type="email" name="email" autoComplete="email" disabled />
          </label>

          <label>
            Senha
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              disabled
            />
          </label>

          <button type="button" disabled>
            Entrar
          </button>
        </form>
      </section>
    </main>
  );
}
