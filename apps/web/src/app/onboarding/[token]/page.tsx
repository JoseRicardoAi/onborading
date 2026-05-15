import {
  measurementGuide,
  pantsSizes,
  shirtSizes,
  shoeSizes,
} from '@/lib/onboarding-uniform';
import { validateAccessToken } from '@/lib/tokens';

type OnboardingPageProps = {
  params: Promise<{
    token: string;
  }>;
  searchParams?: Promise<{
    error?: string;
    submitted?: string;
    shirtSize?: string;
    pantsSize?: string;
    shoeSize?: string;
  }>;
};

const errorMessages: Record<string, string> = {
  uniform: 'Revise os campos de uniforme e selecione apenas tamanhos validos.',
};

export default async function OnboardingTokenPage({
  params,
  searchParams,
}: OnboardingPageProps) {
  const { token } = await params;
  const resolvedSearchParams = await searchParams;
  const tokenState = await validateAccessToken(token);
  const errorMessage = resolvedSearchParams?.error
    ? errorMessages[resolvedSearchParams.error]
    : null;
  const isSubmitted = resolvedSearchParams?.submitted === '1';
  const selectedUniform = isSubmitted
    ? [
        `Camiseta ${resolvedSearchParams?.shirtSize}`,
        `Calca ${resolvedSearchParams?.pantsSize}`,
        `Calcado ${resolvedSearchParams?.shoeSize}`,
      ].join(' | ')
    : null;

  switch (tokenState.kind) {
    case 'invalid':
    case 'unavailable':
      return (
        <main className="page-shell onboarding-shell">
          <section className="onboarding-hero">
            <div>
              <p className="eyebrow">Link invalido</p>
              <h1>Este link nao pode ser usado</h1>
              <p className="lead">
                Confira se voce abriu o link completo enviado pelo RH. Se o problema
                continuar, solicite um novo convite.
              </p>
            </div>
          </section>
        </main>
      );
    case 'expired':
      return (
        <main className="page-shell onboarding-shell">
          <section className="onboarding-hero">
            <div>
              <p className="eyebrow">Link expirado</p>
              <h1>Este convite expirou</h1>
              <p className="lead">
                O prazo para preenchimento terminou. Fale com o RH para receber um
                novo link de onboarding.
              </p>
            </div>
          </section>
        </main>
      );
    case 'finalized':
      return (
        <main className="page-shell onboarding-shell">
          <section className="onboarding-hero">
            <div>
              <p className="eyebrow">Cadastro concluido</p>
              <h1>Este formulario ja foi finalizado</h1>
              <p className="lead">
                Este link nao aceita mais alteracoes. Se precisar corrigir alguma
                informacao, fale com o RH.
              </p>
            </div>
          </section>
        </main>
      );
    case 'valid':
      break;
  }

  return (
    <main className="page-shell onboarding-shell">
      <section className="onboarding-hero" aria-labelledby="onboarding-title">
        <div>
          <p className="eyebrow">Formulario do colaborador</p>
          <h1 id="onboarding-title">Dados de uniforme</h1>
          <p className="lead">
            Informe os tamanhos usando a tabela padrao brasileira para agilizar
            a separacao de camiseta, calca e calcado.
          </p>
        </div>

        <dl className="token-card">
          <div>
            <dt>Colaborador</dt>
            <dd>{tokenState.employee.fullName}</dd>
          </div>
          <div>
            <dt>Contato</dt>
            <dd>{tokenState.employee.email ?? 'Nao informado'}</dd>
          </div>
          <div>
            <dt>Link valido ate</dt>
            <dd>{tokenState.expiresAt.toLocaleString('pt-BR')}</dd>
          </div>
        </dl>
      </section>

      <section className="onboarding-grid">
        <article className="admin-section onboarding-section">
          <header className="section-header">
            <div>
              <p className="eyebrow">Preenchimento</p>
              <h2>Selecione seus tamanhos</h2>
            </div>
            <p className="section-copy">
              Use os tamanhos mais proximos das medidas que voce ja utiliza no
              dia a dia.
            </p>
          </header>

          {errorMessage ? (
            <p className="form-message form-message-error" role="alert">
              {errorMessage}
            </p>
          ) : null}

          {isSubmitted && selectedUniform ? (
            <p className="form-message form-message-success">
              Dados de uniforme enviados com sucesso: {selectedUniform}.
            </p>
          ) : null}

          <form
            className="uniform-form"
            action={`/api/public/onboarding/${token}/submit`}
            method="post"
          >
            <label>
              Tamanho da camiseta
              <select
                name="shirtSize"
                defaultValue={tokenState.employee.uniformShirtSize ?? ''}
                required
              >
                <option value="" disabled>
                  Selecione um tamanho
                </option>
                {shirtSizes.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
              <span className="field-help">
                Modelagem padrao brasileira: P, M, G e GG.
              </span>
            </label>

            <label>
              Numeracao da calca
              <select
                name="pantsSize"
                defaultValue={tokenState.employee.uniformPantsSize ?? ''}
                required
              >
                <option value="" disabled>
                  Selecione a numeracao
                </option>
                {pantsSizes.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
              <span className="field-help">
                Tabela com numeracao adulta brasileira.
              </span>
            </label>

            <label>
              Tamanho do calcado
              <select
                name="shoeSize"
                defaultValue={tokenState.employee.uniformShoeSize ?? ''}
                required
              >
                <option value="" disabled>
                  Selecione o tamanho
                </option>
                {shoeSizes.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
              <span className="field-help">
                Numeracao brasileira de calcados do 33 ao 45.
              </span>
            </label>

            <button type="submit">Salvar dados de uniforme</button>
          </form>
        </article>

        <aside className="admin-section onboarding-section">
          <header className="section-header">
            <div>
              <p className="eyebrow">Guia rapido</p>
              <h2>Tabela de medidas</h2>
            </div>
            <p className="section-copy">
              Referencia visual para ajudar na escolha dos tamanhos mais usados
              no Brasil.
            </p>
          </header>

          <div className="measurements-table-wrapper">
            <table className="measurements-table">
              <caption className="sr-only">
                Tabela padrao brasileira de medidas para uniforme
              </caption>
              <thead>
                <tr>
                  <th scope="col">Camiseta</th>
                  <th scope="col">Referencia corporal</th>
                  <th scope="col">Calca</th>
                  <th scope="col">Calcado</th>
                </tr>
              </thead>
              <tbody>
                {measurementGuide.map((item) => (
                  <tr key={item.shirtSize}>
                    <td>{item.shirtSize}</td>
                    <td>{item.shirtReference}</td>
                    <td>{item.pantsSize}</td>
                    <td>{item.shoeSize}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="table-note">
            Se houver duvida entre dois tamanhos, escolha o que voce costuma
            usar ou valide com o RH antes do envio final.
          </p>
        </aside>
      </section>
    </main>
  );
}
