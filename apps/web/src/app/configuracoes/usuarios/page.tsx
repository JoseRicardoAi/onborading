import Link from 'next/link';
import { redirect } from 'next/navigation';
import { listAdminUsers } from '@/lib/admin-users';
import { getAdminSession } from '@/lib/auth';
import { isDatabaseConfigured } from '@/lib/prisma';

type AdminUsersPageProps = {
  searchParams?: Promise<{
    created?: string;
    error?: string;
  }>;
};

const errorMessages: Record<string, string> = {
  database: 'Configure DATABASE_URL e execute as migracoes antes de cadastrar operadores.',
  duplicate: 'Ja existe um operador cadastrado com este e-mail.',
  schema: 'O banco esta conectado, mas ainda precisa receber o schema atualizado de usuarios administrativos.',
  validation: 'Revise nome, e-mail e senha antes de cadastrar o operador.',
  unknown: 'Nao foi possivel cadastrar o operador agora. Tente novamente.',
};

export default async function AdminUsersPage({
  searchParams,
}: AdminUsersPageProps) {
  const session = await getAdminSession();

  if (!session) {
    redirect('/login');
  }

  const params = await searchParams;
  const databaseReady = isDatabaseConfigured();
  const users = await listAdminUsers();
  const errorMessage = params?.error ? errorMessages[params.error] : null;

  return (
    <main className="page-shell admin-shell">
      <header className="admin-header">
        <div>
          <p className="eyebrow">Configuracoes</p>
          <h1>Usuarios do RH</h1>
          <p className="lead">
            Cadastre operadores para que cada pessoa tenha seu proprio login ao
            acessar os cadastros de funcionarios.
          </p>
        </div>

        <div className="header-actions">
          <Link className="button button-secondary" href="/admin">
            Voltar ao painel
          </Link>
        </div>
      </header>

      {params?.created === '1' ? (
        <p className="form-message form-message-success">
          Operador cadastrado com sucesso.
        </p>
      ) : null}

      {errorMessage ? (
        <p className="form-message form-message-error" role="alert">
          {errorMessage}
        </p>
      ) : null}

      {!databaseReady ? (
        <p className="form-message form-message-error">
          Configure DATABASE_URL antes de cadastrar usuarios administrativos.
        </p>
      ) : null}

      <section className="onboarding-grid">
        <article className="admin-section onboarding-section">
          <header className="section-header">
            <div>
              <p className="eyebrow">Novo operador</p>
              <h2>Cadastrar login administrativo</h2>
            </div>
            <p className="section-copy">
              A senha fica armazenada como hash e nao aparece novamente depois do
              cadastro.
            </p>
          </header>

          <form className="uniform-form" action="/api/admin/users" method="post">
            <label>
              Nome completo
              <input type="text" name="fullName" autoComplete="name" required minLength={3} />
            </label>

            <label>
              E-mail de login
              <input type="email" name="email" autoComplete="email" required />
            </label>

            <div className="form-columns">
              <label>
                Senha temporaria
                <input
                  type="password"
                  name="password"
                  autoComplete="new-password"
                  required
                  minLength={8}
                />
              </label>

              <label>
                Confirmar senha
                <input
                  type="password"
                  name="passwordConfirmation"
                  autoComplete="new-password"
                  required
                  minLength={8}
                />
              </label>
            </div>

            <button type="submit">Cadastrar operador</button>
          </form>
        </article>

        <aside className="admin-section onboarding-section">
          <header className="section-header">
            <div>
              <p className="eyebrow">Acessos ativos</p>
              <h2>Operadores cadastrados</h2>
            </div>
            <p className="section-copy">
              Estes usuarios conseguem acessar o painel administrativo com login proprio.
            </p>
          </header>

          {users.length === 0 ? (
            <p className="empty-state">
              Nenhum operador cadastrado no banco ainda. O acesso por variavel de
              ambiente continua disponivel para bootstrap.
            </p>
          ) : (
            <div className="measurements-table-wrapper">
              <table className="measurements-table admin-table">
                <thead>
                  <tr>
                    <th scope="col">Nome</th>
                    <th scope="col">E-mail</th>
                    <th scope="col">Status</th>
                    <th scope="col">Ultimo acesso</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.fullName ?? 'Nao informado'}</td>
                      <td>{user.email}</td>
                      <td>
                        <span
                          className={`status-badge ${
                            user.isActive ? 'status-active' : 'status-inactive'
                          }`}
                        >
                          {user.isActive ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td>
                        {user.lastLoginAt
                          ? user.lastLoginAt.toLocaleString('pt-BR')
                          : 'Ainda nao acessou'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </aside>
      </section>
    </main>
  );
}
