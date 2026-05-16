import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth';
import { getEmployeeMetrics, listImportantDateEvents } from '@/lib/employees';

type AdminPageProps = {
  searchParams?: Promise<{
    month?: string;
  }>;
};

const monthNames = [
  'Janeiro',
  'Fevereiro',
  'Marco',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
] as const;

const eventLabels = {
  employee_birthday: 'Funcionario',
  child_birthday: 'Filho',
  wedding_anniversary: 'Casamento',
} as const;

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const session = await getAdminSession();

  if (!session) {
    redirect('/login');
  }

  const params = await searchParams;
  const metrics = await getEmployeeMetrics();
  const currentDate = new Date();
  const selectedMonthValue = Number(params?.month ?? currentDate.getMonth() + 1);
  const selectedMonth =
    Number.isInteger(selectedMonthValue) && selectedMonthValue >= 1 && selectedMonthValue <= 12
      ? selectedMonthValue
      : currentDate.getMonth() + 1;
  const importantDates = await listImportantDateEvents(
    new Date(currentDate.getFullYear(), selectedMonth - 1, 1),
  );
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
          <a className="button button-secondary" href="/configuracoes/lembretes">
            Configurar lembretes
          </a>
          <a className="button button-secondary" href="/api/admin/export/employees">
            Exportar funcionarios
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

      <section className="admin-section" aria-labelledby="important-dates-title">
        <div className="section-header">
          <div>
            <p className="eyebrow">Datas importantes</p>
            <h2 id="important-dates-title">Eventos do mes</h2>
          </div>
          <p className="section-copy">
            Visualize aniversarios de funcionarios, filhos e aniversarios de casamento
            para planejar mensagens e reconhecimento.
          </p>
        </div>

        <form className="filters-bar" method="get">
          <label className="filters-field">
            Mes de referencia
            <select name="month" defaultValue={String(selectedMonth)}>
              {monthNames.map((monthName, index) => (
                <option key={monthName} value={String(index + 1)}>
                  {monthName}
                </option>
              ))}
            </select>
          </label>

          <div className="filters-actions">
            <button className="button button-primary button-small" type="submit">
              Ver eventos
            </button>
            <a
              className="button button-secondary button-small"
              href={`/api/admin/export/important-dates?month=${selectedMonth}`}
            >
              Exportar CSV
            </a>
          </div>
        </form>

        <p className="table-note">
          A exportacao administrativa do MVP gera CSV e nao inclui dados de saude.
        </p>

        {importantDates.events.length === 0 ? (
          <p className="empty-state">
            Nenhuma data importante encontrada para {monthNames[selectedMonth - 1]}.
          </p>
        ) : (
          <div className="measurements-table-wrapper">
            <table className="measurements-table admin-table">
              <thead>
                <tr>
                  <th scope="col">Dia</th>
                  <th scope="col">Tipo</th>
                  <th scope="col">Evento</th>
                  <th scope="col">Colaborador</th>
                </tr>
              </thead>
              <tbody>
                {importantDates.events.map((event) => (
                  <tr key={`${event.kind}-${event.employeeId}-${event.label}-${event.day}`}>
                    <td>{String(event.day).padStart(2, '0')}/{String(importantDates.month).padStart(2, '0')}</td>
                    <td>{eventLabels[event.kind]}</td>
                    <td>{event.label}</td>
                    <td>{event.employeeName}</td>
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
