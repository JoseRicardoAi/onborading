import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth';

const dashboardItems = [
  { label: 'Cadastros iniciados', value: '0' },
  { label: 'Pendentes', value: '0' },
  { label: 'Completos', value: '0' },
  { label: 'Revisados', value: '0' },
];

export default async function AdminPage() {
  const session = await getAdminSession();

  if (!session) {
    redirect('/login');
  }

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
