'use client';

import { useState } from 'react';

type SpouseFieldsProps = {
  initialHasSpouse: boolean;
  initialSpouseName: string;
  initialSpousePhone: string;
  initialWeddingAnniversary: string;
  disabled?: boolean;
};

export function SpouseFields({
  initialHasSpouse,
  initialSpouseName,
  initialSpousePhone,
  initialWeddingAnniversary,
  disabled = false,
}: SpouseFieldsProps) {
  const [hasSpouse, setHasSpouse] = useState(initialHasSpouse);

  return (
    <div className="form-group dynamic-section">
      <div className="section-header compact-header">
        <div>
          <p className="eyebrow">Conjuge</p>
          <h3>Contato familiar opcional</h3>
        </div>
        <p className="section-copy">
          Preencha este bloco apenas quando houver conjuge ou uniao estavel.
        </p>
      </div>

      <fieldset className="choice-group">
        <legend>Voce e casado ou amasiado?</legend>
        <div className="choice-options">
          <label className="choice-option">
            <input
              type="radio"
              name="hasSpouse"
              value="no"
              checked={!hasSpouse}
              onChange={() => setHasSpouse(false)}
              disabled={disabled}
            />
            Nao
          </label>
          <label className="choice-option">
            <input
              type="radio"
              name="hasSpouse"
              value="yes"
              checked={hasSpouse}
              onChange={() => setHasSpouse(true)}
              disabled={disabled}
            />
            Sim
          </label>
        </div>
      </fieldset>

      {hasSpouse ? (
        <div className="dynamic-card">
          <label>
            Nome do conjuge
            <input
              type="text"
              name="spouseName"
              defaultValue={initialSpouseName}
              required={hasSpouse}
              disabled={disabled}
            />
          </label>

          <div className="form-columns">
            <label>
              Telefone do conjuge
              <input
                type="tel"
                name="spousePhone"
                defaultValue={initialSpousePhone}
                required={hasSpouse}
                disabled={disabled}
              />
            </label>

            <label>
              Aniversario de casamento
              <input
                type="date"
                name="weddingAnniversary"
                defaultValue={initialWeddingAnniversary}
                required={hasSpouse}
                disabled={disabled}
              />
            </label>
          </div>
        </div>
      ) : null}
    </div>
  );
}
