import { NextResponse } from 'next/server';
import {
  getOnboardingCompletionIssues,
  onboardingFinalizeSchema,
} from '@/lib/onboarding-form';
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
    return NextResponse.redirect(new URL(`/onboarding/${token}`, request.url), {
      status: 303,
    });
  }

  const parsedConfirmation = onboardingFinalizeSchema.safeParse({
    finalConfirmation: formData.get('finalConfirmation'),
  });

  const redirectUrl = new URL(`/onboarding/${token}`, request.url);

  if (!parsedConfirmation.success) {
    redirectUrl.searchParams.set('error', 'finalize');
    return NextResponse.redirect(redirectUrl, { status: 303 });
  }

  const completionIssues = getOnboardingCompletionIssues(tokenState.employee);

  if (completionIssues.length > 0) {
    redirectUrl.searchParams.set('error', 'incomplete');
    return NextResponse.redirect(redirectUrl, { status: 303 });
  }

  await finalizeOnboardingToken(tokenState.tokenRecordId, tokenState.employee.id);

  const successUrl = new URL(`/onboarding/${token}/concluido`, request.url);
  successUrl.searchParams.set('fullName', tokenState.employee.fullName);

  return NextResponse.redirect(successUrl, { status: 303 });
}
