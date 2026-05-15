import { ChildrenFields } from '@/components/children-fields';
import { EducationFields } from '@/components/education-fields';
import { EmergencyContactFields } from '@/components/emergency-contact-fields';
import { HealthFields } from '@/components/health-fields';
import { SpouseFields } from '@/components/spouse-fields';
import {
  getOnboardingCompletionIssues,
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
  profile:
    'Revise os dados do formulario antes de continuar. Existem campos obrigatorios invalidos ou incompletos.',
  finalize: 'Confirme a revisao final dos dados antes de concluir o onboarding.',
  incomplete:
    'Salve os dados obrigatorios e o contato de emergencia antes de finalizar.',
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

  const completionIssues = getOnboardingCompletionIssues(tokenState.employee);
  const reviewItems = [
    {
      label: 'Dados pessoais',
      complete: Boolean(
        tokenState.employee.birthDate &&
          tokenState.employee.phone &&
          tokenState.employee.email &&
          tokenState.employee.residentialAddress,
      ),
      description: 'Nome, nascimento, celular, e-mail e endereco residencial.',
    },
    {
      label: 'Uniforme',
      complete: Boolean(
        tokenState.employee.uniformShirtSize &&
          tokenState.employee.uniformPantsSize &&
          tokenState.employee.uniformShoeSize,
      ),
      description: 'Camiseta, calca e calcado em tabela brasileira.',
    },
    {
      label: 'Contato de emergencia',
      complete: Boolean(tokenState.employee.emergencyContact),
      description: 'Nome, celular e endereco do contato responsavel.',
    },
    {
      label: 'Blocos complementares',
      complete: true,
      description: 'Filhos, conjuge, saude e vida academica sao condicionais ou opcionais.',
    },
  ];

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

            <SpouseFields
              initialHasSpouse={Boolean(tokenState.employee.spouse)}
              initialSpouseName={tokenState.employee.spouse?.name ?? ''}
              initialSpousePhone={tokenState.employee.spouse?.phone ?? ''}
              initialWeddingAnniversary={
                tokenState.employee.spouse?.weddingAnniversary
                  ? tokenState.employee.spouse.weddingAnniversary
                      .toISOString()
                      .slice(0, 10)
                  : ''
              }
            />

            <HealthFields
              initialContinuousMedication={
                tokenState.employee.healthProfile?.continuousMedication ?? ''
              }
              initialAllergies={tokenState.employee.healthProfile?.allergies ?? ''}
              initialRelevantCondition={
                tokenState.employee.healthProfile?.relevantCondition ?? ''
              }
              initialWorkRestriction={
                tokenState.employee.healthProfile?.workRestriction ?? ''
              }
              initialAdditionalNotes={
                tokenState.employee.healthProfile?.additionalNotes ?? ''
              }
              hasStoredConsent={Boolean(
                tokenState.employee.healthProfile?.consentAcceptedAt,
              )}
            />

            <EmergencyContactFields
              initialName={tokenState.employee.emergencyContact?.name ?? ''}
              initialPhone={tokenState.employee.emergencyContact?.phone ?? ''}
              initialAddress={tokenState.employee.emergencyContact?.address ?? ''}
            />

            <EducationFields
              initialHasEducation={Boolean(tokenState.employee.educationProfile)}
              initialInstitution={
                tokenState.employee.educationProfile?.institution ?? ''
              }
              initialCourseName={
                tokenState.employee.educationProfile?.courseName ?? ''
              }
              initialCourseSchedule={
                tokenState.employee.educationProfile?.courseSchedule ?? ''
              }
              initialExpectedEndDate={
                tokenState.employee.educationProfile?.expectedEndDate
                  ? tokenState.employee.educationProfile.expectedEndDate
                      .toISOString()
                      .slice(0, 10)
                  : ''
              }
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

            <button type="submit">Salvar dados e continuar depois</button>
          </form>

          <div className="form-group finalize-group">
            <div className="section-header compact-header">
              <div>
                <p className="eyebrow">Etapa final</p>
                <h3>Revisar e enviar onboarding</h3>
              </div>
              <p className="section-copy">
                Quando todos os dados obrigatorios estiverem preenchidos, finalize
                o formulario para encerrar este link.
              </p>
            </div>

            <ul className="review-list" aria-label="Checklist de revisao">
              {reviewItems.map((item) => (
                <li key={item.label} className="review-item">
                  <strong>{item.complete ? 'Completo' : 'Pendente'}</strong>
                  <span>{item.label}</span>
                  <p>{item.description}</p>
                </li>
              ))}
            </ul>

            {completionIssues.length > 0 ? (
              <p className="form-message form-message-error" role="alert">
                Pendencias para concluir: {completionIssues.join(', ')}.
              </p>
            ) : (
              <p className="form-message form-message-success">
                Tudo certo: voce ja pode enviar o onboarding para o RH.
              </p>
            )}

            <form
              className="finalize-form"
              action={`/api/public/onboarding/${token}/finalize`}
              method="post"
            >
              <label className="consent-option">
                <input type="checkbox" name="finalConfirmation" value="accepted" />
                Revisei meus dados e autorizo o envio final deste onboarding.
              </label>

              <button type="submit" disabled={completionIssues.length > 0}>
                Enviar onboarding
              </button>
            </form>
          </div>
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
              iniciais de uniforme, alem dos blocos dinamicos de filhos e do
              bloco condicional de conjuge e das informacoes de saude com
              consentimento, junto do contato de emergencia e da vida academica.
            </p>
          </div>

          <div className="info-card">
            <strong>Como funciona o envio final</strong>
            <p>
              Primeiro salve seus dados. Depois revise o checklist ao lado e use
              o botao de envio final para concluir o formulario e bloquear este link.
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
