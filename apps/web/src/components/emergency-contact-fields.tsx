type EmergencyContactFieldsProps = {
  initialName: string;
  initialPhone: string;
  initialAddress: string;
  disabled?: boolean;
};

export function EmergencyContactFields({
  initialName,
  initialPhone,
  initialAddress,
  disabled = false,
}: EmergencyContactFieldsProps) {
  return (
    <div className="form-group">
      <div className="section-header compact-header">
        <div>
          <p className="eyebrow">Emergencia</p>
          <h3>Contato responsavel</h3>
        </div>
      </div>

      <label>
        Nome do familiar ou responsavel
        <input
          type="text"
          name="emergencyContactName"
          defaultValue={initialName}
          required
          disabled={disabled}
        />
      </label>

      <label>
        Celular do contato
        <input
          type="tel"
          name="emergencyContactPhone"
          defaultValue={initialPhone}
          required
          disabled={disabled}
        />
      </label>

      <label>
        Endereco do contato
        <textarea
          name="emergencyContactAddress"
          defaultValue={initialAddress}
          rows={3}
          required
          disabled={disabled}
        />
      </label>
    </div>
  );
}
