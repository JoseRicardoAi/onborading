/**
 * Doctor Check: Governance AGP
 *
 * Checks if the AIOX Governance Pipeline (AGP) is properly configured
 * by verifying .antigravity/skills/governance/SKILL.md and governance-config.md.
 *
 * @module aiox-core/doctor/checks/hooks-antigravity-count
 * @story INS-4.8
 */

const path = require('path');
const fs = require('fs');

const name = 'governance-agp';

async function run(context) {
  const governanceSkillPath = path.join(context.projectRoot, '.antigravity', 'skills', 'governance', 'SKILL.md');
  const governanceConfigPath = path.join(context.projectRoot, '.antigravity', 'rules', 'governance-config.md');

  const hasSkill = fs.existsSync(governanceSkillPath);
  const hasConfig = fs.existsSync(governanceConfigPath);

  if (hasSkill && hasConfig) {
    return {
      check: name,
      status: 'PASS',
      message: 'AGP Governance pipeline is fully configured',
      fixCommand: null,
    };
  }

  if (!hasSkill && !hasConfig) {
    return {
      check: name,
      status: 'FAIL',
      message: 'AGP Governance pipeline not found (.antigravity/skills/governance/)',
      fixCommand: 'npx aiox-core install --force',
    };
  }

  return {
    check: name,
    status: 'WARN',
    message: 'AGP Governance is partially configured (missing SKILL.md or governance-config.md)',
    fixCommand: 'npx aiox-core install --force',
  };
}

module.exports = { name, run };
