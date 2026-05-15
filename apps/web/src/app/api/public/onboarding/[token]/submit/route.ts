import { NextResponse } from 'next/server';
import { saveEmployeeUniformData } from '@/lib/employees';
import { uniformFormSchema } from '@/lib/onboarding-uniform';
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

  const parsed = uniformFormSchema.safeParse({
    shirtSize: formData.get('shirtSize'),
    pantsSize: formData.get('pantsSize'),
    shoeSize: formData.get('shoeSize'),
  });

  const redirectUrl = new URL(`/onboarding/${token}`, request.url);

  if (!parsed.success) {
    redirectUrl.searchParams.set('error', 'uniform');
    return NextResponse.redirect(redirectUrl, { status: 303 });
  }

  await saveEmployeeUniformData(tokenState.employee.id, parsed.data);

  redirectUrl.searchParams.set('submitted', '1');
  redirectUrl.searchParams.set('shirtSize', parsed.data.shirtSize);
  redirectUrl.searchParams.set('pantsSize', parsed.data.pantsSize);
  redirectUrl.searchParams.set('shoeSize', parsed.data.shoeSize);

  return NextResponse.redirect(redirectUrl, { status: 303 });
}
