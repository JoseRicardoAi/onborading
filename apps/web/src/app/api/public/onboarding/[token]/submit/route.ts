import { NextResponse } from 'next/server';
import {
  replaceEmployeeChildren,
  saveEmployeeOnboardingProfile,
} from '@/lib/employees';
import {
  onboardingChildrenSchema,
  onboardingProfileSchema,
} from '@/lib/onboarding-form';
import { validateAccessToken } from '@/lib/tokens';

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
    return NextResponse.redirect(new URL(`/onboarding/${token}`, request.url), {
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

  const redirectUrl = new URL(`/onboarding/${token}`, request.url);

  if (!parsed.success || !parsedChildren.success) {
    redirectUrl.searchParams.set('error', 'profile');
    return NextResponse.redirect(redirectUrl, { status: 303 });
  }

  await saveEmployeeOnboardingProfile(tokenState.employee.id, parsed.data);
  await replaceEmployeeChildren(tokenState.employee.id, parsedChildren.data.children);

  redirectUrl.searchParams.set('submitted', '1');
  redirectUrl.searchParams.set('fullName', parsed.data.fullName);
  redirectUrl.searchParams.set('shirtSize', parsed.data.shirtSize);
  redirectUrl.searchParams.set('pantsSize', parsed.data.pantsSize);
  redirectUrl.searchParams.set('shoeSize', parsed.data.shoeSize);

  return NextResponse.redirect(redirectUrl, { status: 303 });
}
