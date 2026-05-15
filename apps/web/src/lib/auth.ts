import { createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';

export const adminSessionCookieName = 'duramo_admin_session';

const sessionDurationMs = 1000 * 60 * 60 * 8;

type AdminSessionPayload = {
  email: string;
  expiresAt: number;
};

export type AdminSession = AdminSessionPayload;

function base64UrlEncode(value: string) {
  return Buffer.from(value, 'utf8').toString('base64url');
}

function base64UrlDecode(value: string) {
  return Buffer.from(value, 'base64url').toString('utf8');
}

function getAuthSecret() {
  const secret = process.env.AUTH_SECRET || process.env.SESSION_SECRET;

  if (secret) {
    return secret;
  }

  if (process.env.NODE_ENV !== 'production') {
    return 'local-development-auth-secret';
  }

  return null;
}

function signValue(value: string) {
  const secret = getAuthSecret();

  if (!secret) {
    return null;
  }

  return createHmac('sha256', secret).update(value).digest('base64url');
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

export function verifyAdminCredentials(email: string, password: string) {
  const expectedEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const expectedPassword = process.env.ADMIN_PASSWORD;

  if (!expectedEmail || !expectedPassword) {
    return false;
  }

  return email.trim().toLowerCase() === expectedEmail && password === expectedPassword;
}

export function shouldUseSecureAuthCookie() {
  const configuredValue = process.env.AUTH_COOKIE_SECURE?.trim().toLowerCase();

  if (configuredValue === 'true') {
    return true;
  }

  if (configuredValue === 'false') {
    return false;
  }

  return process.env.NODE_ENV === 'production';
}

export function createAdminSessionCookie(email: string) {
  const payload: AdminSessionPayload = {
    email: email.trim().toLowerCase(),
    expiresAt: Date.now() + sessionDurationMs,
  };
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signature = signValue(encodedPayload);

  if (!signature) {
    return null;
  }

  return `${encodedPayload}.${signature}`;
}

export function readAdminSessionCookie(value?: string): AdminSession | null {
  if (!value) {
    return null;
  }

  const [encodedPayload, signature] = value.split('.');

  if (!encodedPayload || !signature) {
    return null;
  }

  const expectedSignature = signValue(encodedPayload);

  if (!expectedSignature || !safeEqual(signature, expectedSignature)) {
    return null;
  }

  try {
    const payload = JSON.parse(base64UrlDecode(encodedPayload)) as AdminSessionPayload;

    if (!payload.email || !payload.expiresAt || payload.expiresAt < Date.now()) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(adminSessionCookieName);

  return readAdminSessionCookie(sessionCookie?.value);
}

export function getAdminSessionFromRequest(request: Request) {
  const cookieHeader = request.headers.get('cookie');

  if (!cookieHeader) {
    return null;
  }

  const sessionPair = cookieHeader
    .split(';')
    .map((chunk) => chunk.trim())
    .find((chunk) => chunk.startsWith(`${adminSessionCookieName}=`));

  if (!sessionPair) {
    return null;
  }

  const value = decodeURIComponent(sessionPair.split('=').slice(1).join('='));
  return readAdminSessionCookie(value);
}
