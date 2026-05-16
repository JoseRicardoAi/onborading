import { NextResponse } from 'next/server';
import {
  getOnboardingCompletionIssues,
  onboardingFinalizeSchema,
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

  const parsedConfirmation = onboardingFinalizeSchema.safeParse({
    finalConfirmation: formData.get('finalConfirmation'),
  });

  const redirectUrl = buildRequestUrl(request, `/onboarding/${token}`);

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

  const successUrl = buildRequestUrl(request, `/onboarding/${token}/concluido`);
  successUrl.searchParams.set('fullName', tokenState.employee.fullName);

  return NextResponse.redirect(successUrl, { status: 303 });
}
