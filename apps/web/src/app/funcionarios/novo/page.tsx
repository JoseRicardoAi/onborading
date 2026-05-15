import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth';
import { isDatabaseConfigured } from '@/lib/prisma';

type NewEmployeePageProps = {
  searchParams?: Promise<{
    error?: string;
  }>;
};

const errorMessages: Record<string, string> = {
  validation: 'Preencha nome completo e um e-mail valido antes de salvar.',
  database: 'O banco ainda nao esta configurado para salvar cadastros.',
  unknown: 'Nao foi possivel salvar o cadastro agora. Tente novamente.',
};

export default async function NewEmployeePage({
  searchParams,
}: NewEmployeePageProps) {
  const session = await getAdminSession();

  if (!session) {
    redirect('/login');
  }

  const params = await searchParams;
  const errorMessage = params?.error ? errorMessages[params.error] : null;

  return (
    <main className="page-shell admin-shell">
      <header className="admin-header">
        <div>
          <p className="eyebrow">Novo cadastro</p>
          <h1>Cadastro preliminar do funcionario</h1>
          <p className="lead">
            Registre o nome completo e o e-mail inicial para abrir o onboarding
            administrativo e preparar a geracao do link unico.
          </p>
        </div>

        <div className="header-actions">
          <Link className="button button-secondary" href="/funcionarios">
            Ver lista
          </Link>
          <Link className="button button-secondary" href="/admin">
            Voltar ao painel
          </Link>
        </div>
      </header>

      {!isDatabaseConfigured() ? (
        <p className="form-message form-message-error">
          Defina `DATABASE_URL`, gere o cliente Prisma e execute as migracoes
          antes de usar este fluxo em producao.
        </p>
      ) : null}

      <section className="admin-section" aria-labelledby="new-employee-title">
        <div className="section-header">
          <div>
            <p className="eyebrow">Formulario administrativo</p>
            <h2 id="new-employee-title">Dados iniciais</h2>
          </div>
          <p className="section-copy">
            Esta etapa atende ao MVP do RH para iniciar o cadastro com o minimo
            necessario.
          </p>
        </div>

        {errorMessage ? (
          <p className="form-message form-message-error" role="alert">
            {errorMessage}
          </p>
        ) : null}

        <form className="uniform-form" action="/api/admin/employees" method="post">
          <label>
            Nome completo
            <input
              type="text"
              name="fullName"
              autoComplete="name"
              required
              minLength={3}
            />
            <span className="field-help">
              Use o nome como deve aparecer no cadastro de onboarding.
            </span>
          </label>

          <label>
            E-mail
            <input
              type="email"
              name="email"
              autoComplete="email"
              placeholder="nome@empresa.com.br"
              required
            />
            <span className="field-help">
              Este contato sera usado nos proximos passos de convite e
              acompanhamento.
            </span>
          </label>

          <button type="submit">Criar cadastro preliminar</button>
        </form>
      </section>
    </main>
  );
}
