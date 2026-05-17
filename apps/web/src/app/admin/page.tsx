import Link from 'next/link';
import { redirect } from 'next/navigation';
import { listRecentAdminAuditLogs } from '@/lib/admin-users';
import { getAdminSession } from '@/lib/auth';
import {
  getEmployeeMetrics,
  getOnboardingDashboardInsights,
  listImportantDateEvents,
} from '@/lib/employees';

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

const actionToneLabels = {
  urgent: 'Urgente',
  attention: 'Atencao',
  ready: 'Pronto',
  neutral: 'Monitorar',
} as const;

const tokenStateLabels = {
  active: 'Link ativo',
  expired: 'Expirado',
  revoked: 'Revogado',
  used: 'Finalizado',
  missing: 'Sem link',
} as const;

const auditLabels: Record<string, string> = {
  'admin_user.created': 'Usuario RH criado',
  'admin_user.updated': 'Usuario RH atualizado',
  'admin_user.deleted': 'Usuario RH excluido',
};

function formatDateTime(value: Date) {
  return value.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const session = await getAdminSession();

  if (!session) {
    redirect('/login');
  }

  const params = await searchParams;
  const metrics = await getEmployeeMetrics();
  const insights = await getOnboardingDashboardInsights();
  const auditLogs = await listRecentAdminAuditLogs();
  const currentDate = new Date();
  const selectedMonthValue = Number(params?.month ?? currentDate.getMonth() + 1);
  const selectedMonth =
    Number.isInteger(selectedMonthValue) &&
    selectedMonthValue >= 1 &&
    selectedMonthValue <= 12
      ? selectedMonthValue
      : currentDate.getMonth() + 1;
  const importantDates = await listImportantDateEvents(
    new Date(currentDate.getFullYear(), selectedMonth - 1, 1),
  );
  const completionRate =
    metrics.total > 0
      ? Math.round(((metrics.cadastroCompleto + metrics.revisado) / metrics.total) * 100)
      : 0;
  const dashboardItems = [
    {
      label: 'Total de colaboradores',
      value: String(metrics.total),
      note: 'base ativa',
      tone: 'neutral',
    },
    {
      label: 'Pendentes',
      value: String(metrics.pendenteInformacoes + metrics.cadastroIniciado),
      note: 'exigem acompanhamento',
      tone: 'attention',
    },
    {
      label: 'Aguardando revisao',
      value: String(insights.waitingReview),
      note: 'prontos para conferir',
      tone: 'ready',
    },
    {
      label: 'Taxa concluida',
      value: `${completionRate}%`,
      note: `${insights.averageProgress}% de progresso medio`,
      tone: 'success',
    },
    {
      label: 'Links ativos',
      value: String(insights.links.active),
      note: `${insights.links.expired} expirados`,
      tone: insights.links.expired > 0 ? 'urgent' : 'neutral',
    },
    {
      label: 'Datas do mes',
      value: String(importantDates.events.length),
      note: monthNames[selectedMonth - 1],
      tone: 'neutral',
    },
  ];

  return (
    <main className="page-shell admin-shell">
      <header className="admin-header dashboard-header">
        <div>
          <p className="eyebrow">Painel RH</p>
          <h1>Onboarding Du Ramo</h1>
          <p className="lead">
            Operacao diaria de convites, preenchimentos, revisoes e datas
            importantes.
          </p>
        </div>

        <div className="dashboard-header-actions">
          <span className="status-badge">
            {session.fullName ? session.fullName : session.email}
          </span>
          <form action="/api/auth/logout" method="post">
            <button className="button button-secondary" type="submit">
              Sair
            </button>
          </form>
        </div>
      </header>

      <nav className="dashboard-toolbar" aria-label="Acoes principais">
        <Link className="button button-primary" href="/funcionarios/novo">
          Novo funcionario
        </Link>
        <Link className="button button-secondary" href="/funcionarios">
          Ver funcionarios
        </Link>
        <Link className="button button-secondary" href="/configuracoes/lembretes">
          Lembretes
        </Link>
        <Link className="button button-secondary" href="/configuracoes/usuarios">
          Usuarios RH
        </Link>
        <a className="button button-secondary" href="/api/admin/export/employees">
          Exportar CSV
        </a>
      </nav>

      <section className="dashboard-preview dashboard-kpis" aria-label="Resumo do RH">
        {dashboardItems.map((item) => (
          <article className={`metric-card metric-${item.tone}`} key={item.label}>
            <span>{item.label}</span>
            <strong>{item.value}</strong>
            <small>{item.note}</small>
          </article>
        ))}
      </section>

      <section className="dashboard-workbench">
        <article className="admin-section action-queue" aria-labelledby="queue-title">
          <div className="section-header">
            <div>
              <p className="eyebrow">Fila de acao</p>
              <h2 id="queue-title">Prioridades do RH</h2>
            </div>
            <Link className="button button-secondary button-small" href="/funcionarios">
              Abrir lista
            </Link>
          </div>

          {insights.actionItems.length === 0 ? (
            <p className="empty-state">Nenhuma pendencia operacional no momento.</p>
          ) : (
            <div className="action-list">
              {insights.actionItems.map((item) => (
                <article className={`action-item action-${item.tone}`} key={item.id}>
                  <div>
                    <span className={`status-badge status-${item.status}`}>
                      {actionToneLabels[item.tone]}
                    </span>
                    <h3>{item.fullName}</h3>
                    <p>{item.reason}</p>
                  </div>

                  <div className="action-item-meta">
                    <span>{tokenStateLabels[item.tokenState]}</span>
                    <span>{item.completionPercent}%</span>
                  </div>

                  <div className="progress-track" aria-label="Progresso do onboarding">
                    <div
                      className="progress-fill"
                      style={{ width: `${item.completionPercent}%` }}
                    />
                  </div>

                  <Link className="button button-primary button-small" href={item.href}>
                    {item.actionLabel}
                  </Link>
                </article>
              ))}
            </div>
          )}
        </article>

        <aside className="dashboard-side">
          <section className="admin-section" aria-labelledby="events-title">
            <div className="section-header compact-header">
              <div>
                <p className="eyebrow">Datas importantes</p>
                <h2 id="events-title">{monthNames[selectedMonth - 1]}</h2>
              </div>
            </div>

            <form className="compact-filter" method="get">
              <select name="month" defaultValue={String(selectedMonth)} aria-label="Mes">
                {monthNames.map((monthName, index) => (
                  <option key={monthName} value={String(index + 1)}>
                    {monthName}
                  </option>
                ))}
              </select>
              <button className="button button-secondary button-small" type="submit">
                Ver
              </button>
            </form>

            {importantDates.events.length === 0 ? (
              <p className="empty-state">Sem eventos neste mes.</p>
            ) : (
              <ul className="event-list">
                {importantDates.events.slice(0, 6).map((event) => (
                  <li
                    key={`${event.kind}-${event.employeeId}-${event.label}-${event.day}`}
                  >
                    <time>
                      {String(event.day).padStart(2, '0')}/
                      {String(importantDates.month).padStart(2, '0')}
                    </time>
                    <div>
                      <strong>{event.label}</strong>
                      <span>{eventLabels[event.kind]}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="admin-section system-alerts" aria-labelledby="alerts-title">
            <div className="section-header compact-header">
              <div>
                <p className="eyebrow">Controle</p>
                <h2 id="alerts-title">Saude operacional</h2>
              </div>
            </div>

            <dl className="system-list">
              <div>
                <dt>Links ativos</dt>
                <dd>{insights.links.active}</dd>
              </div>
              <div>
                <dt>Expirados</dt>
                <dd>{insights.links.expired}</dd>
              </div>
              <div>
                <dt>Sem link</dt>
                <dd>{insights.links.missing}</dd>
              </div>
              <div>
                <dt>Revogados</dt>
                <dd>{insights.links.revoked}</dd>
              </div>
            </dl>
          </section>
        </aside>
      </section>

      <section className="dashboard-lower">
        <article className="admin-section" aria-labelledby="funnel-title">
          <div className="section-header">
            <div>
              <p className="eyebrow">Funil</p>
              <h2 id="funnel-title">Etapas do onboarding</h2>
            </div>
          </div>

          <div className="funnel-list">
            {insights.funnel.map((item) => {
              const width =
                metrics.total > 0 ? Math.max((item.value / metrics.total) * 100, 4) : 0;

              return (
                <div className="funnel-row" key={item.status}>
                  <span>{item.label}</span>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${width}%` }} />
                  </div>
                  <strong>{item.value}</strong>
                </div>
              );
            })}
          </div>
        </article>

        <article className="admin-section" aria-labelledby="activity-title">
          <div className="section-header">
            <div>
              <p className="eyebrow">Auditoria</p>
              <h2 id="activity-title">Atividade recente</h2>
            </div>
            <Link className="button button-secondary button-small" href="/configuracoes/usuarios">
              Usuarios RH
            </Link>
          </div>

          {auditLogs.length === 0 ? (
            <p className="empty-state">Nenhuma atividade administrativa registrada.</p>
          ) : (
            <ul className="activity-list">
              {auditLogs.slice(0, 6).map((log) => (
                <li key={log.id}>
                  <div>
                    <strong>{auditLabels[log.action] ?? log.action}</strong>
                    <span>{log.actorEmail ?? 'Sistema'}</span>
                  </div>
                  <time>{formatDateTime(log.createdAt)}</time>
                </li>
              ))}
            </ul>
          )}
        </article>
      </section>
    </main>
  );
}
