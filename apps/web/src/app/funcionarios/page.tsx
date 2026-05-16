import { CopyLinkField } from '@/components/copy-link-field';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth';
import { getEmployeeMetrics, listEmployees } from '@/lib/employees';
import { isDatabaseConfigured } from '@/lib/prisma';

type EmployeesPageProps = {
  searchParams?: Promise<{
    created?: string;
    generated?: string;
    employeeId?: string;
    link?: string;
    expiresAt?: string;
    error?: string;
    q?: string;
    status?: string;
  }>;
};

const statusLabels: Record<string, string> = {
  cadastro_iniciado: 'Cadastro iniciado',
  pendente_informacoes: 'Pendente de informacoes',
  cadastro_completo: 'Cadastro completo',
  revisado: 'Revisado',
};

const statusFilterOptions = [
  { value: 'all', label: 'Todos' },
  { value: 'cadastro_iniciado', label: 'Cadastro iniciado' },
  { value: 'pendente_informacoes', label: 'Pendente de informacoes' },
  { value: 'cadastro_completo', label: 'Cadastro completo' },
  { value: 'revisado', label: 'Revisado' },
] as const;

export default async function EmployeesPage({
  searchParams,
}: EmployeesPageProps) {
  const session = await getAdminSession();

  if (!session) {
    redirect('/login');
  }

  const params = await searchParams;
  const searchQuery = params?.q?.trim() ?? '';
  const selectedStatus = statusFilterOptions.some(
    (option) => option.value === params?.status,
  )
    ? (params?.status as (typeof statusFilterOptions)[number]['value'])
    : 'all';
  const employees = await listEmployees({
    search: searchQuery,
    status: selectedStatus,
  });
  const metrics = await getEmployeeMetrics();
  const databaseReady = isDatabaseConfigured();
  const generatedEmployee = params?.employeeId
    ? employees.find((employee) => employee.id === params.employeeId)
    : null;
  const generatedLink = params?.generated === '1' ? params.link : null;
  const generatedExpiresAt = params?.expiresAt ? new Date(params.expiresAt) : null;

  return (
    <main className="page-shell admin-shell">
      <header className="admin-header">
        <div>
          <p className="eyebrow">Funcionarios</p>
          <h1>Cadastros preliminares</h1>
          <p className="lead">
            Inicie o onboarding com nome completo e e-mail. Os proximos fluxos
            vao aproveitar esta base para gerar token, abrir formulario publico
            e acompanhar o preenchimento.
          </p>
        </div>

        <div className="header-actions">
          <Link className="button button-primary" href="/funcionarios/novo">
            Novo cadastro
          </Link>
          <a className="button button-secondary" href="/api/admin/export/employees">
            Exportar CSV
          </a>
          <Link className="button button-secondary" href="/admin">
            Voltar ao painel
          </Link>
        </div>
      </header>

      {params?.created === '1' ? (
        <p className="form-message form-message-success">
          Cadastro preliminar criado com sucesso.
        </p>
      ) : null}

      {generatedLink && generatedEmployee ? (
        <section className="admin-section generated-link-panel" aria-labelledby="generated-link-title">
          <div className="section-header">
            <div>
              <p className="eyebrow">Link gerado</p>
              <h2 id="generated-link-title">Convite pronto para compartilhar</h2>
            </div>
            <p className="section-copy">
              Link unico criado para {generatedEmployee.fullName}. Expira em{' '}
              {generatedExpiresAt?.toLocaleString('pt-BR')}.
            </p>
          </div>
          <CopyLinkField label="Link do formulario" value={generatedLink} />
        </section>
      ) : null}

      {params?.error === 'database' ? (
        <p className="form-message form-message-error">
          O banco ainda nao esta configurado para gerar links reais.
        </p>
      ) : null}

      {params?.error === 'token' ? (
        <p className="form-message form-message-error">
          Nao foi possivel gerar o link agora. Tente novamente.
        </p>
      ) : null}

      {!databaseReady ? (
        <p className="form-message form-message-error">
          Configure `DATABASE_URL` e rode o setup do Prisma para persistir os
          cadastros reais.
        </p>
      ) : null}

      <section className="dashboard-preview" aria-label="Resumo de funcionarios">
        <article className="metric-card">
          <span>Total de cadastros</span>
          <strong>{metrics.total}</strong>
        </article>
        <article className="metric-card">
          <span>Cadastros iniciados</span>
          <strong>{metrics.cadastroIniciado}</strong>
        </article>
        <article className="metric-card">
          <span>Pendentes</span>
          <strong>{metrics.pendenteInformacoes}</strong>
        </article>
        <article className="metric-card">
          <span>Concluidos ou revisados</span>
          <strong>{metrics.cadastroCompleto + metrics.revisado}</strong>
        </article>
      </section>

      <section className="admin-section" aria-labelledby="employees-list-title">
        <div className="section-header">
          <div>
            <p className="eyebrow">Lista administrativa</p>
            <h2 id="employees-list-title">Funcionarios cadastrados</h2>
          </div>
          <p className="section-copy">
            Esta lista representa a base persistente inicial para os proximos
            epics do onboarding.
          </p>
        </div>

        <p className="table-note">
          O arquivo CSV desta tela inclui dados administrativos e operacionais,
          mas exclui informacoes de saude nesta fase do MVP.
        </p>

        <form className="filters-bar" method="get">
          <label className="filters-field">
            Buscar por nome
            <input
              type="search"
              name="q"
              defaultValue={searchQuery}
              placeholder="Ex.: Maria Souza"
            />
          </label>

          <label className="filters-field">
            Filtrar por status
            <select name="status" defaultValue={selectedStatus}>
              {statusFilterOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <div className="filters-actions">
            <button className="button button-primary button-small" type="submit">
              Aplicar filtros
            </button>
            <Link className="button button-secondary button-small" href="/funcionarios">
              Limpar
            </Link>
          </div>
        </form>

        {employees.length === 0 ? (
          <p className="empty-state">
            Nenhum funcionario encontrado para os filtros informados.
          </p>
        ) : (
          <div className="measurements-table-wrapper">
            <table className="measurements-table admin-table">
              <thead>
                <tr>
                  <th scope="col">Nome</th>
                  <th scope="col">E-mail</th>
                  <th scope="col">Status</th>
                  <th scope="col">Ultimo link</th>
                  <th scope="col">Criado em</th>
                  <th scope="col">Atualizado em</th>
                  <th scope="col">Acoes</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((employee) => (
                  <tr key={employee.id}>
                    <td>{employee.fullName}</td>
                    <td>{employee.email ?? 'Nao informado'}</td>
                    <td>{statusLabels[employee.status]}</td>
                    <td>
                      {employee.latestAccessToken ? (
                        employee.latestAccessToken.usedAt ? (
                          'Finalizado'
                        ) : employee.latestAccessToken.revokedAt ? (
                          'Revogado'
                        ) : employee.latestAccessToken.expiresAt.getTime() <= Date.now() ? (
                          'Expirado'
                        ) : (
                          <>Ativo ate {employee.latestAccessToken.expiresAt.toLocaleDateString('pt-BR')}</>
                        )
                      ) : (
                        'Nenhum link'
                      )}
                    </td>
                    <td>{employee.createdAt.toLocaleString('pt-BR')}</td>
                    <td>{employee.updatedAt.toLocaleString('pt-BR')}</td>
                    <td>
                      <div className="table-actions">
                        <Link
                          className="button button-secondary button-small"
                          href={`/funcionarios/${employee.id}`}
                        >
                          Abrir cadastro
                        </Link>
                        {employee.status === 'cadastro_completo' ||
                        employee.status === 'revisado' ? (
                          <form action={`/api/admin/employees/${employee.id}/reopen`} method="post">
                            <button className="button button-secondary button-small" type="submit">
                              Reabrir
                            </button>
                          </form>
                        ) : (
                          <form action={`/api/admin/employees/${employee.id}/tokens`} method="post">
                            <button className="button button-secondary button-small" type="submit">
                              Gerar link
                            </button>
                          </form>
                        )}
                      </div>
                    </td>
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
