function escapeCsvCell(value: string) {
  if (/[",\r\n;]/.test(value)) {
    return `"${value.replaceAll('"', '""')}"`;
  }

  return value;
}

export function buildCsv(
  headers: string[],
  rows: Array<Record<string, string>>,
) {
  const serializedRows = rows.map((row) =>
    headers.map((header) => escapeCsvCell(row[header] ?? '')).join(','),
  );

  return `\uFEFF${headers.join(',')}\n${serializedRows.join('\n')}`;
}
