const { spawn } = require('node:child_process');

function runNodeScript(args) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, args, {
      stdio: 'inherit',
      cwd: process.cwd(),
      env: process.env,
    });

    child.on('exit', (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`Command failed with exit code ${code}: node ${args.join(' ')}`));
    });

    child.on('error', reject);
  });
}

async function main() {
  const shouldSkipDbPush = process.env.SKIP_DB_PUSH_ON_START?.trim().toLowerCase() === 'true';
  const hasDatabaseUrl = Boolean(process.env.DATABASE_URL?.trim());

  if (!shouldSkipDbPush && hasDatabaseUrl) {
    console.log('Applying Prisma schema with db push before starting the web server...');
    await runNodeScript([
      'node_modules/prisma/build/index.js',
      'db',
      'push',
      '--schema',
      'apps/web/prisma/schema.prisma',
    ]);
  } else if (!hasDatabaseUrl) {
    console.log('DATABASE_URL is not configured. Skipping Prisma db push on startup.');
  }

  await runNodeScript(['apps/web/server.js']);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
