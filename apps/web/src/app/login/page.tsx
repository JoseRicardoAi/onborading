import { LoginForm } from '@/app/login/login-form';

type LoginPageProps = {
  searchParams?: Promise<{
    loggedOut?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const loggedOut = params?.loggedOut === '1';

  return (
    <main className="auth-shell">
      <section className="auth-panel" aria-labelledby="login-title">
        <p className="eyebrow">Acesso administrativo</p>
        <h1 id="login-title">Entrar no onboarding</h1>
        <p className="auth-copy">
          Use suas credenciais internas para acessar o painel de onboarding.
        </p>

        <LoginForm loggedOut={loggedOut} />
      </section>
    </main>
  );
}
