import { NextResponse } from 'next/server';
import {
  replaceEmployeeChildren,
  saveEmployeeOnboardingProfile,
  upsertEmployeeEducationProfile,
  upsertEmployeeEmergencyContact,
  upsertEmployeeHealthProfile,
  upsertEmployeeSpouse,
} from '@/lib/employees';
import {
  getOnboardingCompletionIssues,
  onboardingChildrenSchema,
  onboardingEducationSchema,
  onboardingEmergencyContactSchema,
  onboardingFinalizeSchema,
  onboardingHealthSchema,
  onboardingProfileSchema,
  onboardingSpouseSchema,
} from '@/lib/onboarding-form';
import { buildRequestUrl } from '@/lib/request-url';
import { finalizeOnboardingToken, validateAccessToken } from '@/lib/tokens';

type RouteContext = {
  params: Promise<{
    token: string;
  }>;
};

export async function POST(request: Request, context: RouteContext) {
  const { token } = await context.params;
  const formData = await request.formData();
  const tokenState = await validateAccessToken(token);

  if (tokenState.kind !== 'valid') {
    return NextResponse.redirect(buildRequestUrl(request, `/onboarding/${token}`), {
      status: 303,
    });
  }

  const parsed = onboardingProfileSchema.safeParse({
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
  const shouldFinalize = formData.get('intent') === 'finalize';
  const parsedConfirmation = onboardingFinalizeSchema.safeParse({
    finalConfirmation: formData.get('finalConfirmation'),
  });

  const redirectUrl = buildRequestUrl(request, `/onboarding/${token}`);

  if (
    !parsed.success ||
    !parsedChildren.success ||
    !parsedSpouse.success ||
    !parsedHealth.success ||
    !parsedEmergencyContact.success ||
    !parsedEducation.success
  ) {
    redirectUrl.searchParams.set('error', 'profile');
    return NextResponse.redirect(redirectUrl, { status: 303 });
  }

  if (shouldFinalize && !parsedConfirmation.success) {
    redirectUrl.searchParams.set('error', 'finalize');
    return NextResponse.redirect(redirectUrl, { status: 303 });
  }

  try {
    await saveEmployeeOnboardingProfile(tokenState.employee.id, parsed.data);
    await replaceEmployeeChildren(tokenState.employee.id, parsedChildren.data.children);
    await upsertEmployeeSpouse(tokenState.employee.id, parsedSpouse.data);
    await upsertEmployeeHealthProfile(tokenState.employee.id, parsedHealth.data);
    await upsertEmployeeEmergencyContact(
      tokenState.employee.id,
      parsedEmergencyContact.data,
    );
    await upsertEmployeeEducationProfile(tokenState.employee.id, parsedEducation.data);
  } catch {
    redirectUrl.searchParams.set('error', 'save');
    return NextResponse.redirect(redirectUrl, { status: 303 });
  }

  if (shouldFinalize) {
    const completionIssues = getOnboardingCompletionIssues({
      fullName: parsed.data.fullName,
      birthDate: new Date(parsed.data.birthDate),
      phone: parsed.data.phone,
      email: parsed.data.email,
      residentialAddress: parsed.data.residentialAddress,
      uniformShirtSize: parsed.data.shirtSize,
      uniformPantsSize: parsed.data.pantsSize,
      uniformShoeSize: parsed.data.shoeSize,
      emergencyContact: {
        name: parsedEmergencyContact.data.emergencyContactName,
        phone: parsedEmergencyContact.data.emergencyContactPhone,
        address: parsedEmergencyContact.data.emergencyContactAddress,
      },
    });

    if (completionIssues.length > 0) {
      redirectUrl.searchParams.set('error', 'incomplete');
      return NextResponse.redirect(redirectUrl, { status: 303 });
    }

    try {
      await finalizeOnboardingToken(tokenState.tokenRecordId, tokenState.employee.id);
    } catch {
      redirectUrl.searchParams.set('error', 'finalize-save');
      return NextResponse.redirect(redirectUrl, { status: 303 });
    }

    const successUrl = buildRequestUrl(request, `/onboarding/${token}/concluido`);
    successUrl.searchParams.set('fullName', parsed.data.fullName);

    return NextResponse.redirect(successUrl, { status: 303 });
  }

  redirectUrl.searchParams.set('submitted', '1');
  redirectUrl.searchParams.set('fullName', parsed.data.fullName);
  redirectUrl.searchParams.set('shirtSize', parsed.data.shirtSize);
  redirectUrl.searchParams.set('pantsSize', parsed.data.pantsSize);
  redirectUrl.searchParams.set('shoeSize', parsed.data.shoeSize);

  return NextResponse.redirect(redirectUrl, { status: 303 });
}
