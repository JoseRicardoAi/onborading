import { ChildrenFields } from '@/components/children-fields';
import {
  measurementGuide,
  pantsSizes,
  shirtSizes,
  shoeSizes,
} from '@/lib/onboarding-form';
import { validateAccessToken } from '@/lib/tokens';

type OnboardingPageProps = {
  params: Promise<{
    token: string;
  }>;
  searchParams?: Promise<{
    error?: string;
    submitted?: string;
    fullName?: string;
    shirtSize?: string;
    pantsSize?: string;
    shoeSize?: string;
  }>;
};

const errorMessages: Record<string, string> = {
  profile: 'Revise seus dados pessoais e os campos de uniforme antes de continuar.',
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
        resolvedSearchParams?.fullName,
        `Camiseta ${resolvedSearchParams?.shirtSize}`,
        `Calca ${resolvedSearchParams?.pantsSize}`,
        `Calcado ${resolvedSearchParams?.shoeSize}`,
      ]
        .filter(Boolean)
        .join(' | ')
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
          <h1 id="onboarding-title">Dados pessoais e uniforme</h1>
          <p className="lead">
            Preencha suas informacoes basicas para o onboarding e confirme os
            tamanhos de uniforme usando a tabela padrao brasileira. Se tiver
            filhos, voce tambem ja pode cadastrar os aniversarios nesta etapa.
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
              <p className="eyebrow">Etapa 1</p>
              <h2>Seus dados de onboarding</h2>
            </div>
            <p className="section-copy">
              Comece pelos seus dados pessoais e, em seguida, confirme os itens
              de uniforme que o RH vai preparar.
            </p>
          </header>

          {errorMessage ? (
            <p className="form-message form-message-error" role="alert">
              {errorMessage}
            </p>
          ) : null}

          {isSubmitted && selectedUniform ? (
            <p className="form-message form-message-success">
              Primeira etapa salva com sucesso: {selectedUniform}.
            </p>
          ) : null}

          <form
            className="uniform-form"
            action={`/api/public/onboarding/${token}/submit`}
            method="post"
          >
            <div className="form-group">
              <div className="section-header compact-header">
                <div>
                  <p className="eyebrow">Dados pessoais</p>
                  <h3>Informacoes basicas</h3>
                </div>
              </div>

              <label>
                Nome completo
                <input
                  type="text"
                  name="fullName"
                  defaultValue={tokenState.employee.fullName}
                  minLength={3}
                  required
                />
              </label>

              <div className="form-columns">
                <label>
                  Data de nascimento
                  <input
                    type="date"
                    name="birthDate"
                    defaultValue={
                      tokenState.employee.birthDate
                        ? tokenState.employee.birthDate.toISOString().slice(0, 10)
                        : ''
                    }
                    required
                  />
                </label>

                <label>
                  Celular
                  <input
                    type="tel"
                    name="phone"
                    defaultValue={tokenState.employee.phone ?? ''}
                    placeholder="(00) 00000-0000"
                    required
                  />
                </label>
              </div>

              <label>
                E-mail
                <input
                  type="email"
                  name="email"
                  defaultValue={tokenState.employee.email ?? ''}
                  required
                />
              </label>

              <label>
                Instagram
                <input
                  type="text"
                  name="instagram"
                  defaultValue={tokenState.employee.instagram ?? ''}
                  placeholder="@seuusuario"
                />
              </label>

              <label>
                Endereco residencial
                <textarea
                  name="residentialAddress"
                  defaultValue={tokenState.employee.residentialAddress ?? ''}
                  rows={3}
                  required
                />
              </label>
            </div>

            <ChildrenFields
              initialHasChildren={tokenState.employee.children.length > 0}
              initialChildren={tokenState.employee.children.map((child) => ({
                name: child.name,
                gender: child.gender ?? '',
                birthDate: child.birthDate.toISOString().slice(0, 10),
              }))}
            />

            <div className="form-group">
              <div className="section-header compact-header">
                <div>
                  <p className="eyebrow">Uniforme</p>
                  <h3>Tamanhos para separacao</h3>
                </div>
              </div>

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
            </div>

            <button type="submit">Salvar primeira etapa</button>
          </form>
        </article>

        <aside className="admin-section onboarding-section">
          <header className="section-header">
            <div>
              <p className="eyebrow">Apoio ao preenchimento</p>
              <h2>Tabela de medidas e orientacoes</h2>
            </div>
            <p className="section-copy">
              Revise os tamanhos de uniforme e confirme se seus dados pessoais
              ja estao atualizados antes de seguir para as proximas etapas.
            </p>
          </header>

          <div className="info-card">
            <strong>O que esta sendo coletado agora</strong>
            <p>
              Nome, nascimento, celular, e-mail, Instagram, endereco e dados
              iniciais de uniforme, alem dos blocos dinamicos de filhos.
            </p>
          </div>

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
