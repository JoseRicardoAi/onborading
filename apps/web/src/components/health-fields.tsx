type HealthFieldsProps = {
  initialContinuousMedication: string;
  initialAllergies: string;
  initialRelevantCondition: string;
  initialWorkRestriction: string;
  initialAdditionalNotes: string;
  hasStoredConsent: boolean;
};

export function HealthFields({
  initialContinuousMedication,
  initialAllergies,
  initialRelevantCondition,
  initialWorkRestriction,
  initialAdditionalNotes,
  hasStoredConsent,
}: HealthFieldsProps) {
  return (
    <div className="form-group">
      <div className="section-header compact-header">
        <div>
          <p className="eyebrow">Saude</p>
          <h3>Dados sensiveis com consentimento</h3>
        </div>
      </div>

      <div className="health-notice">
        <strong>Atencao</strong>
        <p>
          Informe apenas dados relevantes para cuidado, emergencia e
          acolhimento no onboarding. Essas informacoes sao sensiveis.
        </p>
      </div>

      <label>
        Medicamento de uso continuo
        <textarea
          name="continuousMedication"
          defaultValue={initialContinuousMedication}
          rows={3}
        />
      </label>

      <label>
        Alergias
        <textarea name="allergies" defaultValue={initialAllergies} rows={3} />
      </label>

      <label>
        Condicao relevante para emergencia
        <textarea
          name="relevantCondition"
          defaultValue={initialRelevantCondition}
          rows={3}
        />
      </label>

      <label>
        Restricoes fisicas ou recomendacoes medicas
        <textarea
          name="workRestriction"
          defaultValue={initialWorkRestriction}
          rows={3}
        />
      </label>

      <label>
        Observacoes adicionais
        <textarea
          name="additionalNotes"
          defaultValue={initialAdditionalNotes}
          rows={3}
        />
      </label>

      <label className="consent-option">
        <input
          type="checkbox"
          name="healthConsent"
          value="accepted"
          defaultChecked={hasStoredConsent}
        />
        Autorizo o armazenamento e o uso dessas informacoes de saude para fins
        de onboarding, cuidado e emergencia.
      </label>
    </div>
  );
}
