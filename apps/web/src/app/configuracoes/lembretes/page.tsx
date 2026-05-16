import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/auth';
import { isDatabaseConfigured } from '@/lib/prisma';
import { getReminderSetting } from '@/lib/reminder-settings';

type ReminderSettingsPageProps = {
  searchParams?: Promise<{
    saved?: string;
    error?: string;
    run?: string;
    sent?: string;
    failed?: string;
    skipped?: string;
  }>;
};

const dayOptions = [
  { value: 7, label: '7 dias antes (Recomendado)' },
  { value: 3, label: '3 dias antes' },
  { value: 1, label: '1 dia antes' },
  { value: 0, label: 'No dia do evento (Recomendado)' },
] as const;

const errorMessages: Record<string, string> = {
  database: 'O banco ainda nao esta configurado para salvar lembretes.',
  validation:
    'Revise os destinatarios e selecione pelo menos uma antecedencia valida.',
  smtp:
    'Configure SMTP_HOST, SMTP_PORT e SMTP_FROM antes de disparar lembretes por e-mail.',
  send: 'Nao foi possivel processar os lembretes agora. Tente novamente.',
};

export default async function ReminderSettingsPage({
  searchParams,
}: ReminderSettingsPageProps) {
  const session = await getAdminSession();

  if (!session) {
    redirect('/login');
  }

  const params = await searchParams;
  const setting = await getReminderSetting();
  const databaseReady = isDatabaseConfigured();
  const saved = params?.saved === '1';
  const run = params?.run === '1';
  const errorMessage = params?.error ? errorMessages[params.error] : null;
  const sentCount = Number(params?.sent ?? '0');
  const failedCount = Number(params?.failed ?? '0');
  const skippedCount = Number(params?.skipped ?? '0');

  return (
    <main className="page-shell admin-shell">
      <header className="admin-header">
        <div>
          <p className="eyebrow">Configuracoes</p>
          <h1>Lembretes administrativos</h1>
          <p className="lead">
            Defina quem recebe os avisos de datas importantes e com quantos dias
            de antecedencia eles devem ser disparados.
          </p>
        </div>

        <div className="header-actions">
          <Link className="button button-secondary" href="/admin">
            Voltar ao painel
          </Link>
        </div>
      </header>

      {saved ? (
        <p className="form-message form-message-success">
          Configuracoes de lembrete salvas com sucesso.
        </p>
      ) : null}

      {run ? (
        <p className="form-message form-message-success">
          Processamento concluido: {sentCount} enviados, {failedCount} falharam e{' '}
          {skippedCount} foram ignorados.
        </p>
      ) : null}

      {errorMessage ? (
        <p className="form-message form-message-error" role="alert">
          {errorMessage}
        </p>
      ) : null}

      {!databaseReady ? (
        <p className="form-message form-message-error">
          Configure `DATABASE_URL` antes de persistir a configuracao de lembretes.
        </p>
      ) : null}

      <section className="onboarding-grid">
        <article className="admin-section onboarding-section">
          <header className="section-header">
            <div>
              <p className="eyebrow">Preferencias de envio</p>
              <h2>Destinatarios e antecedencia</h2>
            </div>
            <p className="section-copy">
              Use um e-mail por linha ou separe por virgula. A sugestao inicial do
              MVP e lembrar 7 dias antes e tambem no dia do evento.
            </p>
          </header>

          <form
            className="uniform-form"
            action="/api/admin/reminder-settings"
            method="post"
          >
            <label>
              Destinatarios dos lembretes
              <textarea
                name="recipientEmails"
                defaultValue={setting.recipientEmails.join('\n')}
                rows={6}
                placeholder="rh@duramo.com.br&#10;gestor@duramo.com.br"
                required
              />
            </label>

            <fieldset className="choice-group">
              <legend>Antecedencia em dias</legend>
              {dayOptions.map((option) => (
                <label className="choice-option" key={option.value}>
                  <input
                    type="checkbox"
                    name="daysBefore"
                    value={String(option.value)}
                    defaultChecked={setting.daysBefore.includes(option.value)}
                  />
                  {option.label}
                </label>
              ))}
            </fieldset>

            <button type="submit">Salvar configuracoes</button>
          </form>
        </article>

        <aside className="admin-section onboarding-section">
          <header className="section-header">
            <div>
              <p className="eyebrow">Resumo atual</p>
              <h2>Como os lembretes vao funcionar</h2>
            </div>
            <p className="section-copy">
              Esta configuracao sera usada nas proximas etapas de envio por e-mail.
            </p>
          </header>

          <div className="info-card">
            <strong>Destinatarios atuais</strong>
            <p>
              {setting.recipientEmails.length > 0
                ? setting.recipientEmails.join(', ')
                : 'Nenhum destinatario configurado ainda.'}
            </p>
          </div>

          <div className="info-card">
            <strong>Antecedencia atual</strong>
            <p>
              {setting.daysBefore.length > 0
                ? setting.daysBefore
                    .sort((left, right) => right - left)
                    .map((day) => (day === 0 ? 'no dia do evento' : `${day} dias antes`))
                    .join(', ')
                : 'Nenhuma antecedencia configurada.'}
            </p>
          </div>

          <div className="info-card">
            <strong>Escopo desta fase</strong>
            <p>
              O RH ja pode salvar a configuracao e executar um disparo manual. O
              endpoint protegido para cron fica disponivel na proxima integracao operacional.
            </p>
          </div>

          <div className="info-card">
            <strong>Executar agora</strong>
            <p>
              Use este botao para testar o envio dos lembretes que estiverem devidos hoje.
            </p>
            <form action="/api/admin/reminders/send" method="post">
              <button className="button button-primary button-small" type="submit">
                Processar lembretes agora
              </button>
            </form>
          </div>
        </aside>
      </section>
    </main>
  );
}
