'use client';

import { useState } from 'react';

type ChildDraft = {
  id?: string;
  name: string;
  gender: string;
  birthDate: string;
};

type ChildrenFieldsProps = {
  initialHasChildren: boolean;
  initialChildren: ChildDraft[];
  disabled?: boolean;
};

function createEmptyChild(id = `new-${Date.now()}-${Math.random()}`): ChildDraft {
  return {
    id,
    name: '',
    gender: '',
    birthDate: '',
  };
}

function normalizeInitialChildren(children: ChildDraft[]) {
  return children.map((child, index) => ({
    ...child,
    id: child.id || `initial-${index}`,
  }));
}

export function ChildrenFields({
  initialHasChildren,
  initialChildren,
  disabled = false,
}: ChildrenFieldsProps) {
  const [hasChildren, setHasChildren] = useState(initialHasChildren);
  const [children, setChildren] = useState<ChildDraft[]>(
    initialChildren.length > 0
      ? normalizeInitialChildren(initialChildren)
      : [createEmptyChild('initial-empty')],
  );

  function updateChild(index: number, patch: Partial<ChildDraft>) {
    setChildren((current) =>
      current.map((child, currentIndex) =>
        currentIndex === index ? { ...child, ...patch } : child,
      ),
    );
  }

  function addChild() {
    setChildren((current) => [...current, createEmptyChild()]);
  }

  function removeChild(index: number) {
    setChildren((current) =>
      current.length === 1 ? [createEmptyChild()] : current.filter((_, i) => i !== index),
    );
  }

  return (
    <div className="form-group">
      <div className="section-header compact-header">
        <div>
          <p className="eyebrow">Filhos</p>
          <h3>Blocos dinamicos</h3>
        </div>
      </div>

      <fieldset className="choice-group">
        <legend>Voce tem filhos?</legend>
        <label className="choice-option">
          <input
            type="radio"
            name="hasChildren"
            value="no"
            checked={!hasChildren}
            onChange={() => setHasChildren(false)}
            disabled={disabled}
          />
          Nao
        </label>
        <label className="choice-option">
          <input
            type="radio"
            name="hasChildren"
            value="yes"
            checked={hasChildren}
            onChange={() => setHasChildren(true)}
            disabled={disabled}
          />
          Sim
        </label>
      </fieldset>

      {hasChildren ? (
        <div className="children-stack">
          {children.map((child, index) => (
            <div className="child-card" key={child.id}>
              <div className="child-card-header">
                <strong>Filho {index + 1}</strong>
                <button
                  className="button button-secondary button-small"
                  type="button"
                  onClick={() => removeChild(index)}
                  disabled={disabled}
                >
                  Remover
                </button>
              </div>

              <label>
                Nome
                <input
                  type="text"
                  name="childName[]"
                  value={child.name}
                  onChange={(event) => updateChild(index, { name: event.currentTarget.value })}
                  required={hasChildren}
                  disabled={disabled}
                />
              </label>

              <div className="form-columns">
                <label>
                  Genero
                  <select
                    name="childGender[]"
                    value={child.gender}
                    onChange={(event) =>
                      updateChild(index, { gender: event.currentTarget.value })
                    }
                    required={hasChildren}
                    disabled={disabled}
                  >
                    <option value="" disabled>
                      Selecione
                    </option>
                    <option value="masculino">Masculino</option>
                    <option value="feminino">Feminino</option>
                    <option value="outro">Outro</option>
                  </select>
                </label>

                <label>
                  Data de aniversario
                  <input
                    type="date"
                    name="childBirthDate[]"
                    value={child.birthDate}
                    onChange={(event) =>
                      updateChild(index, { birthDate: event.currentTarget.value })
                    }
                    required={hasChildren}
                    disabled={disabled}
                  />
                </label>
              </div>
            </div>
          ))}

          <button
            className="button button-secondary"
            type="button"
            onClick={addChild}
            disabled={disabled}
          >
            Adicionar filho
          </button>
        </div>
      ) : null}
    </div>
  );
}
