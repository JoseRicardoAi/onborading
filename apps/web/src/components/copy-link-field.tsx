'use client';

import { useState } from 'react';

type CopyLinkFieldProps = {
  label: string;
  value: string;
};

export function CopyLinkField({ label, value }: CopyLinkFieldProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await globalThis.navigator.clipboard.writeText(value);
    setCopied(true);
    globalThis.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="copy-field">
      <label className="copy-field-label">
        {label}
        <input readOnly value={value} onFocus={(event) => event.currentTarget.select()} />
      </label>
      <button className="button button-secondary" type="button" onClick={handleCopy}>
        {copied ? 'Link copiado' : 'Copiar link'}
      </button>
    </div>
  );
}
