type OnboardingCompletedPageProps = {
  searchParams?: Promise<{
    fullName?: string;
  }>;
};

export default async function OnboardingCompletedPage({
  searchParams,
}: OnboardingCompletedPageProps) {
  const params = await searchParams;
  const fullName = params?.fullName?.trim();

  return (
    <main className="page-shell onboarding-shell">
      <section className="onboarding-hero">
        <div>
          <p className="eyebrow">Cadastro concluido</p>
          <h1>Onboarding enviado com sucesso</h1>
          <p className="lead">
            {fullName
              ? `${fullName}, recebemos seu formulario e o RH ja pode seguir com a proxima etapa.`
              : 'Recebemos seu formulario e o RH ja pode seguir com a proxima etapa.'}
          </p>
        </div>

        <div className="info-card success-card">
          <strong>O que acontece agora</strong>
          <p>
            Seu link foi encerrado e nao aceita mais alteracoes. Se voce precisar
            corrigir alguma informacao depois deste envio, fale com o RH.
          </p>
        </div>
      </section>
    </main>
  );
}
