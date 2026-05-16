import { NextResponse } from 'next/server';
import { getAdminSessionFromRequest } from '@/lib/auth';
import { buildCsv } from '@/lib/csv';
import { isDatabaseConfigured } from '@/lib/prisma';
import { listEmployeeExportRows } from '@/lib/employees';

const employeeExportHeaders = [
  'fullName',
  'email',
  'phone',
  'status',
  'birthDate',
  'instagram',
  'residentialAddress',
  'uniformShirtSize',
  'uniformPantsSize',
  'uniformShoeSize',
  'spouseName',
  'spousePhone',
  'weddingAnniversary',
  'childrenSummary',
  'emergencyContactName',
  'emergencyContactPhone',
  'emergencyContactAddress',
  'educationInstitution',
  'educationCourseName',
  'educationCourseSchedule',
  'educationExpectedEndDate',
  'createdAt',
  'updatedAt',
  'submittedAt',
  'reviewedAt',
] as const;

export async function GET(request: Request) {
  if (!getAdminSessionFromRequest(request)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: 'database_not_configured' }, { status: 400 });
  }

  const rows = await listEmployeeExportRows();
  const csv = buildCsv([...employeeExportHeaders], rows);
  const today = new Date().toISOString().slice(0, 10);

  return new NextResponse(csv, {
    status: 200,
    headers: {
      'content-type': 'text/csv; charset=utf-8',
      'content-disposition': `attachment; filename="funcionarios-${today}.csv"`,
      'cache-control': 'no-store',
    },
  });
}
