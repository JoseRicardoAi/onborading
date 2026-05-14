const statusItems = [
  { label: 'Cadastros iniciados', value: '0' },
  { label: 'Pendentes', value: '0' },
  { label: 'Completos', value: '0' },
  { label: 'Revisados', value: '0' },
];

export default function HomePage() {
  return (
    <main className="page-shell">
      <section className="hero-panel" aria-labelledby="page-title">
        <div>
          <p className="eyebrow">Du Ramo Locacoes</p>
          <h1 id="page-title">Onboarding de Funcionarios</h1>
          <p className="lead">
            Base inicial do sistema para cadastro de novos colaboradores,
            links temporarios de formulario e acompanhamento administrativo.
          </p>
        </div>

        <div className="actions" aria-label="Acoes principais">
          <a className="button button-primary" href="/api/health">
            Ver health check
          </a>
          <a className="button button-secondary" href="/login">
            Acesso administrativo
          </a>
        </div>
      </section>

      <section className="dashboard-preview" aria-label="Resumo do onboarding">
        {statusItems.map((item) => (
          <article className="metric-card" key={item.label}>
            <span>{item.label}</span>
            <strong>{item.value}</strong>
          </article>
        ))}
      </section>
    </main>
  );
}
