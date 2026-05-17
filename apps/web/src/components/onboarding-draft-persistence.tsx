'use client';

/* global document, window, HTMLFormElement, HTMLInputElement, HTMLSelectElement, HTMLTextAreaElement */

import { useEffect } from 'react';

type OnboardingDraftPersistenceProps = {
  draftKey: string;
};

const FIELD_SELECTOR = 'input[name], select[name], textarea[name]';

function getFieldKey(field: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement) {
  const fields = Array.from(
    field.form?.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
      FIELD_SELECTOR,
    ) ?? [],
  ).filter((item) => item.name === field.name);
  const index = fields.indexOf(field);

  return `${field.name}:${index}`;
}

export function OnboardingDraftPersistence({
  draftKey,
}: OnboardingDraftPersistenceProps) {
  useEffect(() => {
    const form = document.querySelector<HTMLFormElement>(
      `form[data-draft-key="${draftKey}"]`,
    );

    if (!form) {
      return;
    }

    const storageKey = `onboarding-draft:${draftKey}`;
    const fields = Array.from(
      form.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
        FIELD_SELECTOR,
      ),
    );
    const storedValues = JSON.parse(
      window.localStorage.getItem(storageKey) || '{}',
    ) as Record<string, string | boolean>;

    for (const field of fields) {
      const value = storedValues[getFieldKey(field)];

      if (typeof value === 'undefined') {
        continue;
      }

      if (
        field instanceof HTMLInputElement &&
        (field.type === 'checkbox' || field.type === 'radio')
      ) {
        field.checked = value === true;
        continue;
      }

      if (typeof value === 'string') {
        field.value = value;
      }
    }

    const saveDraft = () => {
      const draft = fields.reduce<Record<string, string | boolean>>((acc, field) => {
        if (
          field instanceof HTMLInputElement &&
          (field.type === 'checkbox' || field.type === 'radio')
        ) {
          acc[getFieldKey(field)] = field.checked;
          return acc;
        }

        acc[getFieldKey(field)] = field.value;
        return acc;
      }, {});

      window.localStorage.setItem(storageKey, JSON.stringify(draft));
    };

    form.addEventListener('input', saveDraft);
    form.addEventListener('change', saveDraft);

    return () => {
      form.removeEventListener('input', saveDraft);
      form.removeEventListener('change', saveDraft);
    };
  }, [draftKey]);

  return null;
}
