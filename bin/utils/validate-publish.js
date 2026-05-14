#!/usr/bin/env node
'use strict';

/**
 * Publish Safety Gate — File Count + Dependency Validation
 *
 * Validates the package before publishing:
 * 1. Package file count meets minimum threshold (>= 50)
 * 2. .aiox-core/package.json dependency completeness
 *
 * NOTE: The pro/ submodule checks (INS-4.10) have been removed.
 * This project has been migrated to Antigravity-native architecture.
 * The pro/ submodule is no longer part of the distribution.
 *
 * Exit codes: 0 = PASS, 1 = FAIL
 * Usage: node bin/utils/validate-publish.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PROJECT_ROOT = path.join(__dirname, '..', '..');
const MIN_FILE_COUNT = 50;

let passed = true;
let fileCount = 0;

console.log('--- Publish Safety Gate ---\n');

// Check 1: File count threshold via npm pack --dry-run
try {
  const packOutput = execSync('npm pack --dry-run 2>&1', {
    encoding: 'utf8',
    cwd: PROJECT_ROOT,
    timeout: 120000,
  });
  // npm pack --dry-run outputs lines starting with "npm notice" for each file
  const fileLines = packOutput.split('\n').filter(line =>
    line.includes('npm notice') && !line.includes('Tarball') && !line.includes('name:') &&
    !line.includes('version:') && !line.includes('filename:') && !line.includes('package size:') &&
    !line.includes('unpacked size:') && !line.includes('shasum:') && !line.includes('integrity:') &&
    !line.includes('total files:'),
  );
  fileCount = fileLines.length;

  if (fileCount < MIN_FILE_COUNT) {
    console.error(`FAIL: Package has only ${fileCount} files, expected >= ${MIN_FILE_COUNT}.`);
    console.error('  Check that all directories in "files" array are populated.');
    passed = false;
  } else {
    console.log(`PASS: Package contains ${fileCount} files (minimum: ${MIN_FILE_COUNT})`);
  }
} catch (err) {
  console.error(`FAIL: npm pack --dry-run failed: ${err.message}`);
  passed = false;
}

// Check 2: .aiox-core dependency completeness
console.log('');
console.log('--- Dependency Completeness ---\n');
try {
  const depValidatorPath = path.join(PROJECT_ROOT, 'scripts', 'validate-aiox-core-deps.js');
  if (fs.existsSync(depValidatorPath)) {
    execSync(`node "${depValidatorPath}"`, {
      encoding: 'utf8',
      cwd: PROJECT_ROOT,
      timeout: 30000,
      stdio: 'inherit',
    });
    console.log('PASS: .aiox-core dependency completeness validated');
  } else {
    console.log('SKIP: scripts/validate-aiox-core-deps.js not found');
  }
} catch (_depErr) {
  console.error('FAIL: .aiox-core dependency completeness check failed');
  console.error('  Fix: Run "node scripts/validate-aiox-core-deps.js" to see details');
  passed = false;
}

// Summary
console.log('');
if (passed) {
  console.log(`PUBLISH SAFETY GATE: PASS (${fileCount} files in package)`);
  process.exit(0);
} else {
  console.error('PUBLISH SAFETY GATE: FAIL — publish blocked. Fix issues above before retrying.');
  process.exit(1);
}
