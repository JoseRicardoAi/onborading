/**
 * Doctor Check: Workflows Count
 *
 * Counts .md files in .antigravity/workflows/ recursively.
 * PASS: >=4, WARN: 1-3, FAIL: 0.
 *
 * @module aiox-core/doctor/checks/commands-count
 * @story INS-4.8
 */

const path = require('path');
const fs = require('fs');

const name = 'workflows-count';

/**
 * Recursively count .md files in a directory.
 */
function countMdFiles(dir) {
  let count = 0;
  let entries;

  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return 0;
  }

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      count += countMdFiles(fullPath);
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      count++;
    }
  }

  return count;
}

async function run(context) {
  const commandsDir = path.join(context.projectRoot, '.antigravity', 'workflows');

  if (!fs.existsSync(commandsDir)) {
    return {
      check: name,
      status: 'FAIL',
      message: 'Workflows directory not found (.antigravity/workflows/)',
      fixCommand: 'npx aiox-core install --force',
    };
  }

  const count = countMdFiles(commandsDir);

  if (count >= 4) {
    return {
      check: name,
      status: 'PASS',
      message: `${count} workflow files found`,
      fixCommand: null,
    };
  }

  if (count > 0) {
    return {
      check: name,
      status: 'WARN',
      message: `${count}/4 workflow files found`,
      fixCommand: 'npx aiox-core install --force',
    };
  }

  return {
    check: name,
    status: 'FAIL',
    message: `No workflow files found (expected >=4)`,
    fixCommand: 'npx aiox-core install --force',
  };
}

module.exports = { name, run };
