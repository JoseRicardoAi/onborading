import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { ChildrenFields } from '@/components/children-fields';
import { CopyLinkField } from '@/components/copy-link-field';
import { EducationFields } from '@/components/education-fields';
import { EmergencyContactFields } from '@/components/emergency-contact-fields';
import { HealthFields } from '@/components/health-fields';
import { SpouseFields } from '@/components/spouse-fields';
import { getAdminSession } from '@/lib/auth';
import {
  measurementGuide,
  pantsSizes,
  shirtSizes,
  shoeSizes,
} from '@/lib/onboarding-form';
import { getEmployeeDetail } from '@/lib/employees';

type EmployeeDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams?: Promise<{
    updated?: string;
    error?: string;
    reopened?: string;
    reviewed?: string;
    link?: string;
    expiresAt?: string;
  }>;
};

const statusLabels: Record<string, string> = {
  cadastro_iniciado: 'Cadastro iniciado',
  pendente_informacoes: 'Pendente de informacoes',
  cadastro_completo: 'Cadastro completo',
  revisado: 'Revisado',
};

const errorMessages: Record<string, string> = {
  validation: 'Revise os dados obrigatorios antes de salvar as alteracoes.',
  locked: 'Este cadastro esta revisado e bloqueado para edicao interna.',
  database: 'O banco ainda nao esta configurado para esta acao.',
  reopen: 'Nao foi possivel reabrir o cadastro agora. Tente novamente.',
  'reopen-status':
    'A reabertura so esta disponivel para cadastros completos ou revisados.',
  review: 'Nao foi possivel marcar este cadastro como revisado agora.',
  'review-status':
    'A revisao formal so esta disponivel para cadastros completos.',
};

export default async function EmployeeDetailPage({
  params,
  searchParams,
}: EmployeeDetailPageProps) {
  const session = await getAdminSession();

  if (!session) {
    redirect('/login');
  }

  const { id } = await params;
  const resolvedSearchParams = await searchParams;
  const employee = await getEmployeeDetail(id);

  if (!employee) {
    notFound();
  }

  const isLocked = employee.status === 'revisado';
  const successMessage = resolvedSearchParams?.updated === '1';
  const reopenedMessage = resolvedSearchParams?.reopened === '1';
  const reviewedMessage = resolvedSearchParams?.reviewed === '1';
  const errorMessage = resolvedSearchParams?.error
    ? errorMessages[resolvedSearchParams.error]
    : null;
  const reopenedLink = reopenedMessage ? resolvedSearchParams?.link : null;
  const reopenedExpiresAt =
    reopenedMessage && resolvedSearchParams?.expiresAt
      ? new Date(resolvedSearchParams.expiresAt)
      : null;
  const canReopen =
    employee.status === 'cadastro_completo' || employee.status === 'revisado';
  const canReview = employee.status === 'cadastro_completo';

  return (
    <main className="page-shell admin-shell">
      <header className="admin-header">
        <div>
          <p className="eyebrow">Cadastro do colaborador</p>
          <h1>{employee.fullName}</h1>
          <p className="lead">
            Consulte e ajuste os dados do onboarding em um unico lugar. Quando o
            cadastro estiver com status revisado, a tela permanece apenas para consulta.
          </p>
        </div>

        <div className="header-actions">
          <Link className="button button-secondary" href="/funcionarios">
            Voltar para lista
          </Link>
        </div>
      </header>

      <section className="onboarding-grid">
        <article className="admin-section onboarding-section">
          <header className="section-header">
            <div>
              <p className="eyebrow">Edicao interna</p>
              <h2>Dados de onboarding</h2>
            </div>
            <p className="section-copy">
              O RH pode complementar ou corrigir o cadastro enquanto ele nao estiver
              bloqueado por revisao administrativa.
            </p>
          </header>

          {errorMessage ? (
            <p className="form-message form-message-error" role="alert">
              {errorMessage}
            </p>
          ) : null}

          {successMessage ? (
            <p className="form-message form-message-success">
              Cadastro atualizado com sucesso.
            </p>
          ) : null}

          {reopenedMessage && reopenedLink ? (
            <div className="generated-link-panel">
              <p className="form-message form-message-success">
                Cadastro reaberto com sucesso. O colaborador pode voltar a editar
                pelo novo link ate {reopenedExpiresAt?.toLocaleString('pt-BR')}.
              </p>
              <CopyLinkField label="Novo link do formulario" value={reopenedLink} />
            </div>
          ) : null}

          {reviewedMessage ? (
            <p className="form-message form-message-success">
              Cadastro marcado como revisado com sucesso.
            </p>
          ) : null}

          {isLocked ? (
            <p className="form-message form-message-error">
              Este cadastro esta revisado e foi travado para evitar alteracoes acidentais.
            </p>
          ) : null}

          <form
            className="uniform-form"
            action={`/api/admin/employees/${employee.id}`}
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
                  defaultValue={employee.fullName}
                  minLength={3}
                  required
                  disabled={isLocked}
                />
              </label>

              <div className="form-columns">
                <label>
                  Data de nascimento
                  <input
                    type="date"
                    name="birthDate"
                    defaultValue={
                      employee.birthDate
                        ? employee.birthDate.toISOString().slice(0, 10)
                        : ''
                    }
                    required
                    disabled={isLocked}
                  />
                </label>

                <label>
                  Celular
                  <input
                    type="tel"
                    name="phone"
                    defaultValue={employee.phone ?? ''}
                    required
                    disabled={isLocked}
                  />
                </label>
              </div>

              <label>
                E-mail
                <input
                  type="email"
                  name="email"
                  defaultValue={employee.email ?? ''}
                  required
                  disabled={isLocked}
                />
              </label>

              <label>
                Instagram
                <input
                  type="text"
                  name="instagram"
                  defaultValue={employee.instagram ?? ''}
                  disabled={isLocked}
                />
              </label>

              <label>
                Endereco residencial
                <textarea
                  name="residentialAddress"
                  defaultValue={employee.residentialAddress ?? ''}
                  rows={3}
                  required
                  disabled={isLocked}
                />
              </label>
            </div>

            <ChildrenFields
              initialHasChildren={employee.children.length > 0}
              initialChildren={employee.children.map((child) => ({
                name: child.name,
                gender: child.gender ?? '',
                birthDate: child.birthDate.toISOString().slice(0, 10),
              }))}
              disabled={isLocked}
            />

            <SpouseFields
              initialHasSpouse={Boolean(employee.spouse)}
              initialSpouseName={employee.spouse?.name ?? ''}
              initialSpousePhone={employee.spouse?.phone ?? ''}
              initialWeddingAnniversary={
                employee.spouse?.weddingAnniversary
                  ? employee.spouse.weddingAnniversary.toISOString().slice(0, 10)
                  : ''
              }
              disabled={isLocked}
            />

            <HealthFields
              initialContinuousMedication={
                employee.healthProfile?.continuousMedication ?? ''
              }
              initialAllergies={employee.healthProfile?.allergies ?? ''}
              initialRelevantCondition={
                employee.healthProfile?.relevantCondition ?? ''
              }
              initialWorkRestriction={
                employee.healthProfile?.workRestriction ?? ''
              }
              initialAdditionalNotes={
                employee.healthProfile?.additionalNotes ?? ''
              }
              hasStoredConsent={Boolean(employee.healthProfile?.consentAcceptedAt)}
              disabled={isLocked}
            />

            <EmergencyContactFields
              initialName={employee.emergencyContact?.name ?? ''}
              initialPhone={employee.emergencyContact?.phone ?? ''}
              initialAddress={employee.emergencyContact?.address ?? ''}
              disabled={isLocked}
            />

            <EducationFields
              initialHasEducation={Boolean(employee.educationProfile)}
              initialInstitution={employee.educationProfile?.institution ?? ''}
              initialCourseName={employee.educationProfile?.courseName ?? ''}
              initialCourseSchedule={employee.educationProfile?.courseSchedule ?? ''}
              initialExpectedEndDate={
                employee.educationProfile?.expectedEndDate
                  ? employee.educationProfile.expectedEndDate.toISOString().slice(0, 10)
                  : ''
              }
              disabled={isLocked}
            />

            <div className="form-group">
              <div className="section-header compact-header">
                <div>
                  <p className="eyebrow">Uniforme</p>
                  <h3>Tamanhos cadastrados</h3>
                </div>
              </div>

              <label>
                Tamanho da camiseta
                <select
                  name="shirtSize"
                  defaultValue={employee.uniformShirtSize ?? ''}
                  required
                  disabled={isLocked}
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
              </label>

              <label>
                Numeracao da calca
                <select
                  name="pantsSize"
                  defaultValue={employee.uniformPantsSize ?? ''}
                  required
                  disabled={isLocked}
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
              </label>

              <label>
                Tamanho do calcado
                <select
                  name="shoeSize"
                  defaultValue={employee.uniformShoeSize ?? ''}
                  required
                  disabled={isLocked}
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
              </label>
            </div>

            {!isLocked ? <button type="submit">Salvar alteracoes internas</button> : null}
          </form>
        </article>

        <aside className="admin-section onboarding-section">
          <header className="section-header">
            <div>
              <p className="eyebrow">Resumo operacional</p>
              <h2>Status e historico</h2>
            </div>
            <p className="section-copy">
              Use este painel lateral para entender rapidamente o estado atual do cadastro.
            </p>
          </header>

          <dl className="token-card">
            <div>
              <dt>Status</dt>
              <dd>{statusLabels[employee.status]}</dd>
            </div>
            <div>
              <dt>Completude</dt>
              <dd>{employee.completionPercent}%</dd>
            </div>
            <div>
              <dt>Criado em</dt>
              <dd>{employee.createdAt.toLocaleString('pt-BR')}</dd>
            </div>
            <div>
              <dt>Ultima atualizacao</dt>
              <dd>{employee.updatedAt.toLocaleString('pt-BR')}</dd>
            </div>
            <div>
              <dt>Enviado pelo colaborador</dt>
              <dd>
                {employee.submittedAt
                  ? employee.submittedAt.toLocaleString('pt-BR')
                  : 'Ainda nao enviado'}
              </dd>
            </div>
            <div>
              <dt>Revisado em</dt>
              <dd>
                {employee.reviewedAt
                  ? employee.reviewedAt.toLocaleString('pt-BR')
                  : 'Ainda nao revisado'}
              </dd>
            </div>
            <div>
              <dt>Ultimo link</dt>
              <dd>
                {employee.latestAccessToken
                  ? employee.latestAccessToken.expiresAt.toLocaleString('pt-BR')
                  : 'Nenhum link gerado'}
              </dd>
            </div>
          </dl>

          <div className="info-card">
            <strong>Regra administrativa atual</strong>
            <p>
              Cadastros com status revisado ficam apenas para consulta. Os demais
              continuam editaveis para correcoes e complementos internos.
            </p>
          </div>

          {canReview ? (
            <div className="info-card">
              <strong>Revisao formal do cadastro</strong>
              <p>
                Quando o colaborador ja concluiu o onboarding e o RH conferiu as
                informacoes, marque este cadastro como revisado para travar a edicao.
              </p>
              <form action={`/api/admin/employees/${employee.id}/review`} method="post">
                <button className="button button-primary button-small" type="submit">
                  Marcar como revisado
                </button>
              </form>
            </div>
          ) : null}

          {canReopen ? (
            <div className="info-card">
              <strong>Reabrir cadastro</strong>
              <p>
                Gere um novo link para o colaborador corrigir dados. O status volta
                para pendencia e qualquer link ativo anterior e invalidado.
              </p>
              <form action={`/api/admin/employees/${employee.id}/reopen`} method="post">
                <button className="button button-primary button-small" type="submit">
                  Reabrir e gerar novo link
                </button>
              </form>
            </div>
          ) : null}

          <div className="measurements-table-wrapper">
            <table className="measurements-table">
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
        </aside>
      </section>
    </main>
  );
}
