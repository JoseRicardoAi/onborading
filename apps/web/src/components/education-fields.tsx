'use client';

import { useState } from 'react';

type EducationFieldsProps = {
  initialHasEducation: boolean;
  initialInstitution: string;
  initialCourseName: string;
  initialCourseSchedule: string;
  initialExpectedEndDate: string;
  disabled?: boolean;
};

export function EducationFields({
  initialHasEducation,
  initialInstitution,
  initialCourseName,
  initialCourseSchedule,
  initialExpectedEndDate,
  disabled = false,
}: EducationFieldsProps) {
  const [hasEducation, setHasEducation] = useState(initialHasEducation);

  return (
    <div className="form-group dynamic-section">
      <div className="section-header compact-header">
        <div>
          <p className="eyebrow">Vida academica</p>
          <h3>Curso, horario e previsao</h3>
        </div>
        <p className="section-copy">
          Use este bloco quando houver curso tecnico, faculdade ou rotina academica ativa.
        </p>
      </div>

      <fieldset className="choice-group">
        <legend>Voce cursa tecnico ou faculdade?</legend>
        <div className="choice-options">
          <label className="choice-option">
            <input
              type="radio"
              name="hasEducation"
              value="no"
              checked={!hasEducation}
              onChange={() => setHasEducation(false)}
              disabled={disabled}
            />
            Nao
          </label>
          <label className="choice-option">
            <input
              type="radio"
              name="hasEducation"
              value="yes"
              checked={hasEducation}
              onChange={() => setHasEducation(true)}
              disabled={disabled}
            />
            Sim
          </label>
        </div>
      </fieldset>

      {hasEducation ? (
        <div className="dynamic-card">
          <label>
            Instituicao
            <input
              type="text"
              name="institution"
              defaultValue={initialInstitution}
              required={hasEducation}
              disabled={disabled}
            />
          </label>

          <label>
            Curso
            <input
              type="text"
              name="courseName"
              defaultValue={initialCourseName}
              required={hasEducation}
              disabled={disabled}
            />
          </label>

          <div className="form-columns">
            <label>
              Horario do curso
              <input
                type="text"
                name="courseSchedule"
                defaultValue={initialCourseSchedule}
                placeholder="Noite, sabados, EAD..."
                required={hasEducation}
                disabled={disabled}
              />
            </label>

            <label>
              Previsao de termino
              <input
                type="date"
                name="expectedEndDate"
                defaultValue={initialExpectedEndDate}
                required={hasEducation}
                disabled={disabled}
              />
            </label>
          </div>
        </div>
      ) : null}
    </div>
  );
}
