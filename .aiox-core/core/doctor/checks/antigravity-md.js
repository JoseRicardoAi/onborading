/**
 * Doctor Check: ANTIGRAVITY.md
 *
 * Validates .antigravity/ANTIGRAVITY.md exists and has required section headings.
 *
 * @module aiox-core/doctor/checks/antigravity-md
 * @story INS-4.1
 */

const path = require('path');
const fs = require('fs');

const name = 'antigravity-md';

const REQUIRED_SECTIONS = [
  'Constitution',
  'Sistema de Agentes',
  'Story-Driven Development',
];

async function run(context) {
  const antigravityMdPath = path.join(context.projectRoot, '.antigravity', 'ANTIGRAVITY.md');

  if (!fs.existsSync(antigravityMdPath)) {
    return {
      check: name,
      status: 'FAIL',
      message: 'ANTIGRAVITY.md not found in .antigravity/',
      fixCommand: 'aiox doctor --fix',
    };
  }

  const content = fs.readFileSync(antigravityMdPath, 'utf8');

  const missingSections = REQUIRED_SECTIONS.filter(
    (section) => !content.includes(section),
  );

  if (missingSections.length === 0) {
    return {
      check: name,
      status: 'PASS',
      message: 'All required sections present',
      fixCommand: null,
    };
  }

  return {
    check: name,
    status: 'WARN',
    message: `Missing sections: ${missingSections.join(', ')}`,
    fixCommand: 'aiox doctor --fix',
  };
}

module.exports = { name, run };
