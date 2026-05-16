function normalizeBaseUrl(value: string) {
  return value.trim().replace(/\/+$/, '');
}

export function getRequestBaseUrl(request: Request) {
  const configuredAppUrl = process.env.APP_URL?.trim();

  if (configuredAppUrl) {
    return normalizeBaseUrl(configuredAppUrl);
  }

  const forwardedHost = request.headers.get('x-forwarded-host');
  const forwardedProto = request.headers.get('x-forwarded-proto');

  if (forwardedHost && forwardedProto) {
    const host = forwardedHost.split(',')[0]?.trim();
    const protocol = forwardedProto.split(',')[0]?.trim();

    if (host && protocol) {
      return `${protocol}://${host}`;
    }
  }

  const origin = request.headers.get('origin');

  if (origin) {
    return normalizeBaseUrl(origin);
  }

  return new URL(request.url).origin;
}

export function buildRequestUrl(request: Request, pathname: string) {
  return new URL(pathname, getRequestBaseUrl(request));
}
