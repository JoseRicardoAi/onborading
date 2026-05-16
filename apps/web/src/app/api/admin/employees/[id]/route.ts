import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { getAdminSessionFromRequest } from '@/lib/auth';
import {
  getEmployeeDetail,
  replaceEmployeeChildren,
  saveEmployeeOnboardingProfile,
  upsertEmployeeEducationProfile,
  upsertEmployeeEmergencyContact,
  upsertEmployeeHealthProfile,
  upsertEmployeeSpouse,
} from '@/lib/employees';
import {
  onboardingChildrenSchema,
  onboardingEducationSchema,
  onboardingEmergencyContactSchema,
  onboardingHealthSchema,
  onboardingProfileSchema,
  onboardingSpouseSchema,
} from '@/lib/onboarding-form';
import { prisma } from '@/lib/prisma';
import { buildRequestUrl } from '@/lib/request-url';

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(request: Request, context: RouteContext) {
  if (!getAdminSessionFromRequest(request)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const { id } = await context.params;
  const employee = await getEmployeeDetail(id);

  if (!employee) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 });
  }

  if (employee.status === 'revisado') {
    const redirectUrl = buildRequestUrl(request, `/funcionarios/${id}`);
    redirectUrl.searchParams.set('error', 'locked');
    return NextResponse.redirect(redirectUrl, { status: 303 });
  }

  const formData = await request.formData();
  const parsedProfile = onboardingProfileSchema.safeParse({
    fullName: formData.get('fullName'),
    birthDate: formData.get('birthDate'),
    phone: formData.get('phone'),
    email: formData.get('email'),
    instagram: formData.get('instagram'),
    residentialAddress: formData.get('residentialAddress'),
    shirtSize: formData.get('shirtSize'),
    pantsSize: formData.get('pantsSize'),
    shoeSize: formData.get('shoeSize'),
  });
  const parsedChildren = onboardingChildrenSchema.safeParse({
    hasChildren: formData.get('hasChildren'),
    children: formData
      .getAll('childName[]')
      .map((name, index) => ({
        name,
        gender: formData.getAll('childGender[]')[index],
        birthDate: formData.getAll('childBirthDate[]')[index],
      }))
      .filter((child) =>
        [child.name, child.gender, child.birthDate].some((value) =>
          String(value ?? '').trim().length > 0,
        ),
      ),
  });
  const parsedSpouse = onboardingSpouseSchema.safeParse({
    hasSpouse: formData.get('hasSpouse'),
    spouseName: formData.get('spouseName'),
    spousePhone: formData.get('spousePhone'),
    weddingAnniversary: formData.get('weddingAnniversary'),
  });
  const parsedHealth = onboardingHealthSchema.safeParse({
    continuousMedication: formData.get('continuousMedication'),
    allergies: formData.get('allergies'),
    relevantCondition: formData.get('relevantCondition'),
    workRestriction: formData.get('workRestriction'),
    additionalNotes: formData.get('additionalNotes'),
    healthConsent: formData.get('healthConsent'),
  });
  const parsedEmergencyContact = onboardingEmergencyContactSchema.safeParse({
    emergencyContactName: formData.get('emergencyContactName'),
    emergencyContactPhone: formData.get('emergencyContactPhone'),
    emergencyContactAddress: formData.get('emergencyContactAddress'),
  });
  const parsedEducation = onboardingEducationSchema.safeParse({
    hasEducation: formData.get('hasEducation'),
    institution: formData.get('institution'),
    courseName: formData.get('courseName'),
    courseSchedule: formData.get('courseSchedule'),
    expectedEndDate: formData.get('expectedEndDate'),
  });

  const redirectUrl = buildRequestUrl(request, `/funcionarios/${id}`);

  if (
    !parsedProfile.success ||
    !parsedChildren.success ||
    !parsedSpouse.success ||
    !parsedHealth.success ||
    !parsedEmergencyContact.success ||
    !parsedEducation.success
  ) {
    redirectUrl.searchParams.set('error', 'validation');
    return NextResponse.redirect(redirectUrl, { status: 303 });
  }

  await saveEmployeeOnboardingProfile(id, parsedProfile.data);
  await replaceEmployeeChildren(id, parsedChildren.data.children);
  await upsertEmployeeSpouse(id, parsedSpouse.data);
  await upsertEmployeeHealthProfile(id, parsedHealth.data);
  await upsertEmployeeEmergencyContact(id, parsedEmergencyContact.data);
  await upsertEmployeeEducationProfile(id, parsedEducation.data);

  if (employee.status === 'cadastro_completo') {
    try {
      await prisma.employee.update({
        where: {
          id,
        },
        data: {
          status: 'cadastro_completo',
          completionPercent: 100,
        },
      });
    } catch (error) {
      if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
        throw error;
      }
    }
  }

  redirectUrl.searchParams.set('updated', '1');
  return NextResponse.redirect(redirectUrl, { status: 303 });
}
