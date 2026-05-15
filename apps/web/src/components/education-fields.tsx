'use client';

import { useState } from 'react';

type EducationFieldsProps = {
  initialHasEducation: boolean;
  initialInstitution: string;
  initialCourseName: string;
  initialCourseSchedule: string;
  initialExpectedEndDate: string;
};

export function EducationFields({
  initialHasEducation,
  initialInstitution,
  initialCourseName,
  initialCourseSchedule,
  initialExpectedEndDate,
}: EducationFieldsProps) {
  const [hasEducation, setHasEducation] = useState(initialHasEducation);

  return (
    <div className="form-group">
      <div className="section-header compact-header">
        <div>
          <p className="eyebrow">Vida academica</p>
          <h3>Estudos e horarios</h3>
        </div>
      </div>

      <fieldset className="choice-group">
        <legend>Voce cursa tecnico ou faculdade?</legend>
        <label className="choice-option">
          <input
            type="radio"
            name="hasEducation"
            value="no"
            checked={!hasEducation}
            onChange={() => setHasEducation(false)}
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
          />
          Sim
        </label>
      </fieldset>

      {hasEducation ? (
        <div className="child-card">
          <label>
            Instituicao
            <input
              type="text"
              name="institution"
              defaultValue={initialInstitution}
              required={hasEducation}
            />
          </label>

          <label>
            Curso
            <input
              type="text"
              name="courseName"
              defaultValue={initialCourseName}
              required={hasEducation}
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
              />
            </label>

            <label>
              Previsao de termino
              <input
                type="date"
                name="expectedEndDate"
                defaultValue={initialExpectedEndDate}
                required={hasEducation}
              />
            </label>
          </div>
        </div>
      ) : null}
    </div>
  );
}
