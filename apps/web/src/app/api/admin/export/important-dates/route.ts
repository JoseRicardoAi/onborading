import { NextResponse } from 'next/server';
import { getAdminSessionFromRequest } from '@/lib/auth';
import { buildCsv } from '@/lib/csv';
import { listImportantDateExportRows } from '@/lib/employees';

const importantDateExportHeaders = [
  'referenceMonth',
  'eventType',
  'eventLabel',
  'employeeName',
  'eventDay',
  'originalDate',
] as const;

export async function GET(request: Request) {
  if (!getAdminSessionFromRequest(request)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const url = new URL(request.url);
  const requestedMonth = Number(url.searchParams.get('month'));
  const now = new Date();
  const month =
    Number.isInteger(requestedMonth) && requestedMonth >= 1 && requestedMonth <= 12
      ? requestedMonth
      : now.getMonth() + 1;

  const rows = await listImportantDateExportRows(
    new Date(now.getFullYear(), month - 1, 1),
  );
  const csv = buildCsv([...importantDateExportHeaders], rows);
  const paddedMonth = String(month).padStart(2, '0');

  return new NextResponse(csv, {
    status: 200,
    headers: {
      'content-type': 'text/csv; charset=utf-8',
      'content-disposition': `attachment; filename="datas-importantes-${now.getFullYear()}-${paddedMonth}.csv"`,
      'cache-control': 'no-store',
    },
  });
}
