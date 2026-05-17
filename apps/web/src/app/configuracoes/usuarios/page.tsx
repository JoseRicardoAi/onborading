import Link from 'next/link';
import { redirect } from 'next/navigation';
import { listAdminUsers, listRecentAdminAuditLogs } from '@/lib/admin-users';
import { getAdminSession } from '@/lib/auth';
import { isDatabaseConfigured } from '@/lib/prisma';

type AdminUsersPageProps = {
  searchParams?: Promise<{
    created?: string;
    updated?: string;
    deleted?: string;
    error?: string;
  }>;
};

const errorMessages: Record<string, string> = {
  database: 'Configure DATABASE_URL e execute as migracoes antes de cadastrar operadores.',
  duplicate: 'Ja existe um operador cadastrado com este e-mail.',
  'not-found': 'Operador nao encontrado ou ja excluido.',
  schema: 'O banco esta conectado, mas ainda precisa receber o schema atualizado de usuarios administrativos.',
  'super-admin-invalid': 'Credenciais do super admin invalidas. Exclusao bloqueada.',
  'super-admin-required': 'Informe as credenciais do super admin para excluir.',
  validation: 'Revise nome, e-mail, status e senha antes de salvar.',
  unknown: 'Nao foi possivel cadastrar o operador agora. Tente novamente.',
};

const auditActionLabels: Record<string, string> = {
  'admin_user.created': 'Operador criado',
  'admin_user.updated': 'Operador atualizado',
  'admin_user.deleted': 'Operador excluido',
};

function getAuditTarget(metadata: unknown) {
  if (!metadata || typeof metadata !== 'object') {
    return 'Registro administrativo';
  }

  const record = metadata as Record<string, unknown>;
  const email = record.email ?? record.deletedEmail;
  const fullName = record.fullName ?? record.deletedFullName;

  return [fullName, email].filter(Boolean).join(' - ') || 'Registro administrativo';
}

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
  const auditLogs = await listRecentAdminAuditLogs();
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

      {params?.updated === '1' ? (
        <p className="form-message form-message-success">
          Operador atualizado com sucesso.
        </p>
      ) : null}

      {params?.deleted === '1' ? (
        <p className="form-message form-message-success">
          Operador excluido com autorizacao do super admin.
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
              Edite dados, altere senha, bloqueie acesso ou exclua operadores.
              Exclusoes exigem credenciais do super admin.
            </p>
          </header>

          {users.length === 0 ? (
            <p className="empty-state">
              Nenhum operador cadastrado no banco ainda. O acesso por variavel de
              ambiente continua disponivel para bootstrap.
            </p>
          ) : (
            <div className="admin-user-list">
              {users.map((user) => (
                <article className="admin-user-card" key={user.id}>
                  <header className="admin-user-card-header">
                    <div>
                      <strong>{user.fullName ?? 'Nao informado'}</strong>
                      <span>{user.email}</span>
                    </div>
                    <span
                      className={`status-badge ${
                        user.isActive ? 'status-active' : 'status-inactive'
                      }`}
                    >
                      {user.isActive ? 'Ativo' : 'Bloqueado'}
                    </span>
                  </header>

                  <dl className="admin-user-meta">
                    <div>
                      <dt>Ultimo acesso</dt>
                      <dd>
                        {user.lastLoginAt
                          ? user.lastLoginAt.toLocaleString('pt-BR')
                          : 'Ainda nao acessou'}
                      </dd>
                    </div>
                    <div>
                      <dt>Atualizado em</dt>
                      <dd>{user.updatedAt.toLocaleString('pt-BR')}</dd>
                    </div>
                  </dl>

                  <form
                    className="uniform-form admin-user-edit-form"
                    action={`/api/admin/users/${user.id}`}
                    method="post"
                  >
                    <input type="hidden" name="action" value="update" />

                    <label>
                      Nome completo
                      <input
                        type="text"
                        name="fullName"
                        defaultValue={user.fullName ?? ''}
                        minLength={3}
                        required
                      />
                    </label>

                    <label>
                      E-mail de login
                      <input
                        type="email"
                        name="email"
                        defaultValue={user.email}
                        required
                      />
                    </label>

                    <label>
                      Status
                      <select
                        name="isActive"
                        defaultValue={user.isActive ? 'active' : 'blocked'}
                      >
                        <option value="active">Ativo</option>
                        <option value="blocked">Bloqueado</option>
                      </select>
                    </label>

                    <div className="form-columns">
                      <label>
                        Nova senha
                        <input
                          type="password"
                          name="password"
                          autoComplete="new-password"
                          minLength={8}
                          placeholder="Manter senha atual"
                        />
                      </label>

                      <label>
                        Confirmar nova senha
                        <input
                          type="password"
                          name="passwordConfirmation"
                          autoComplete="new-password"
                          minLength={8}
                          placeholder="Repita se alterar"
                        />
                      </label>
                    </div>

                    <button type="submit">Salvar operador</button>
                  </form>

                  <form
                    className="uniform-form danger-zone"
                    action={`/api/admin/users/${user.id}`}
                    method="post"
                  >
                    <input type="hidden" name="action" value="delete" />
                    <div className="section-header compact-header">
                      <div>
                        <p className="eyebrow">Exclusao controlada</p>
                        <h3>Requer super admin</h3>
                      </div>
                      <p className="section-copy">
                        A exclusao bloqueia o acesso e oculta o operador da lista.
                      </p>
                    </div>

                    <div className="form-columns">
                      <label>
                        E-mail do super admin
                        <input
                          type="email"
                          name="superAdminEmail"
                          autoComplete="off"
                          required
                        />
                      </label>

                      <label>
                        Senha do super admin
                        <input
                          type="password"
                          name="superAdminPassword"
                          autoComplete="off"
                          required
                        />
                      </label>
                    </div>

                    <button className="button-danger" type="submit">
                      Excluir operador
                    </button>
                  </form>
                </article>
              ))}
            </div>
          )}
        </aside>
      </section>

      <section className="admin-section onboarding-section" aria-labelledby="audit-title">
        <header className="section-header">
          <div>
            <p className="eyebrow">Auditoria</p>
            <h2 id="audit-title">Eventos administrativos recentes</h2>
          </div>
          <p className="section-copy">
            Registro inicial de criacao, edicao, bloqueio e exclusao de operadores.
          </p>
        </header>

        {auditLogs.length === 0 ? (
          <p className="empty-state">
            Nenhum evento administrativo registrado ainda.
          </p>
        ) : (
          <div className="measurements-table-wrapper">
            <table className="measurements-table admin-table">
              <thead>
                <tr>
                  <th scope="col">Quando</th>
                  <th scope="col">Acao</th>
                  <th scope="col">Operador</th>
                  <th scope="col">Autor</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map((log) => (
                  <tr key={log.id}>
                    <td>{log.createdAt.toLocaleString('pt-BR')}</td>
                    <td>{auditActionLabels[log.action] ?? log.action}</td>
                    <td>{getAuditTarget(log.metadata)}</td>
                    <td>{log.actorEmail ?? 'Sistema'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
