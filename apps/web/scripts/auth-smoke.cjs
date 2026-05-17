const { spawn } = require('node:child_process');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');

const port = Number(process.env.AUTH_SMOKE_PORT || '3301');
const baseUrl = `http://127.0.0.1:${port}`;
const adminEmail = process.env.AUTH_SMOKE_ADMIN_EMAIL || 'rh@duramo.com.br';
const adminPassword =
  process.env.AUTH_SMOKE_ADMIN_PASSWORD || 'local-auth-smoke-password';

async function requestStatus(url) {
  return new Promise((resolve, reject) => {
    const request = http.request(url, { method: 'GET' }, (response) => {
      response.resume();
      response.on('end', () => resolve(response.statusCode || 0));
    });

    request.on('error', reject);
    request.end();
  });
}

async function waitForServer(url, stdoutRef, stderrRef, attempts = 60) {
  for (let index = 0; index < attempts; index += 1) {
    try {
      const statusCode = await requestStatus(url);

      if (statusCode >= 200 && statusCode < 500) {
        return;
      }
    } catch {
      // Ignore transient boot errors while the standalone server starts.
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  throw new Error(
    `Timed out waiting for the web server to start.\nSTDOUT:\n${stdoutRef()}\nSTDERR:\n${stderrRef()}`,
  );
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function main() {
  const standaloneDir = path.resolve(
    __dirname,
    '..',
    '.next',
    'standalone',
    'apps',
    'web',
  );
  const serverPath = path.join(standaloneDir, 'server.js');

  if (!fs.existsSync(serverPath)) {
    throw new Error(
      'Standalone build not found. Run `npm run build:web` before the auth smoke test.',
    );
  }

  const server = spawn(process.execPath, [serverPath], {
    cwd: standaloneDir,
    env: {
      ...process.env,
      PORT: String(port),
      HOSTNAME: '127.0.0.1',
      APP_URL: baseUrl,
      AUTH_COOKIE_SECURE: 'false',
      ADMIN_EMAIL: adminEmail,
      ADMIN_PASSWORD: adminPassword,
      AUTH_SECRET: process.env.AUTH_SECRET || 'local-auth-smoke-secret',
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  let stdout = '';
  let stderr = '';

  server.stdout.on('data', (chunk) => {
    stdout += chunk.toString();
  });

  server.stderr.on('data', (chunk) => {
    stderr += chunk.toString();
  });

  try {
    await waitForServer(
      `${baseUrl}/api/health`,
      () => stdout,
      () => stderr,
    );

    const unauthenticated = await fetch(`${baseUrl}/admin`, {
      redirect: 'manual',
    });
    assert(
      unauthenticated.status === 307,
      `Expected unauthenticated /admin to redirect with 307, received ${unauthenticated.status}.`,
    );
    assert(
      unauthenticated.headers.get('location') === '/login',
      `Expected unauthenticated /admin to redirect to /login, received ${unauthenticated.headers.get('location')}.`,
    );

    const loginResponse = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      body: new URLSearchParams({
        email: adminEmail,
        password: adminPassword,
      }),
      redirect: 'manual',
    });
    assert(
      loginResponse.status === 200,
      `Expected successful login to return 200, received ${loginResponse.status}.`,
    );

    const sessionCookie = loginResponse.headers.get('set-cookie');
    assert(sessionCookie, 'Expected login response to include a session cookie.');

    const authenticated = await fetch(`${baseUrl}/admin`, {
      headers: {
        cookie: sessionCookie.split(';')[0],
      },
      redirect: 'manual',
    });
    assert(
      authenticated.status === 200,
      `Expected authenticated /admin to return 200, received ${authenticated.status}.`,
    );
    const adminHtml = await authenticated.text();
    assert(
      adminHtml.includes('Onboarding Du Ramo'),
      'Expected authenticated /admin response to render the administrative dashboard.',
    );

    const logoutResponse = await fetch(`${baseUrl}/api/auth/logout`, {
      method: 'POST',
      headers: {
        cookie: sessionCookie.split(';')[0],
      },
      redirect: 'manual',
    });
    assert(
      logoutResponse.status === 303,
      `Expected logout to return 303, received ${logoutResponse.status}.`,
    );
    assert(
      logoutResponse.headers.get('location') === `${baseUrl}/login?loggedOut=1`,
      `Expected logout redirect to target the login screen, received ${logoutResponse.headers.get('location')}.`,
    );

    console.log('Auth smoke test passed.');
  } finally {
    server.kill('SIGTERM');
  }

  await new Promise((resolve) => {
    server.once('exit', () => resolve());
    setTimeout(resolve, 3000);
  });

  if (server.exitCode && server.exitCode !== 0) {
    throw new Error(
      `Standalone server exited unexpectedly.\nSTDOUT:\n${stdout}\nSTDERR:\n${stderr}`,
    );
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
