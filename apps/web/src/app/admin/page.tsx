import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth';
import { getEmployeeMetrics } from '@/lib/employees';

export default async function AdminPage() {
  const session = await getAdminSession();

  if (!session) {
    redirect('/login');
  }

  const metrics = await getEmployeeMetrics();
  const dashboardItems = [
    { label: 'Cadastros iniciados', value: String(metrics.cadastroIniciado) },
    { label: 'Pendentes', value: String(metrics.pendenteInformacoes) },
    { label: 'Completos', value: String(metrics.cadastroCompleto) },
    { label: 'Revisados', value: String(metrics.revisado) },
  ];

  return (
    <main className="page-shell admin-shell">
      <header className="admin-header">
        <div>
          <p className="eyebrow">Painel administrativo</p>
          <h1>Onboarding Du Ramo</h1>
          <p className="lead">
            Acompanhe os cadastros de novos colaboradores e prepare os proximos
            fluxos de convite, formulario e revisao.
          </p>
        </div>

        <form action="/api/auth/logout" method="post">
          <button className="button button-secondary" type="submit">
            Sair
          </button>
        </form>
      </header>

      <section className="admin-section admin-shortcuts" aria-labelledby="shortcuts-title">
        <div className="section-header">
          <div>
            <p className="eyebrow">Atalhos</p>
            <h2 id="shortcuts-title">Proximos passos do RH</h2>
          </div>
          <p className="section-copy">
            Comece o onboarding pela criacao do cadastro preliminar e acompanhe
            a base administrativa de funcionarios.
          </p>
        </div>

        <div className="actions" aria-label="Acoes administrativas">
          <a className="button button-primary" href="/funcionarios/novo">
            Novo cadastro
          </a>
          <a className="button button-secondary" href="/funcionarios">
            Ver funcionarios
          </a>
        </div>
      </section>

      <section className="dashboard-preview" aria-label="Resumo administrativo">
        {dashboardItems.map((item) => (
          <article className="metric-card" key={item.label}>
            <span>{item.label}</span>
            <strong>{item.value}</strong>
          </article>
        ))}
      </section>

      <section className="admin-section" aria-labelledby="session-title">
        <h2 id="session-title">Sessao ativa</h2>
        <dl className="session-list">
          <div>
            <dt>Usuario</dt>
            <dd>{session.email}</dd>
          </div>
          <div>
            <dt>Expira em</dt>
            <dd>{new Date(session.expiresAt).toLocaleString('pt-BR')}</dd>
          </div>
        </dl>
      </section>
    </main>
  );
}
