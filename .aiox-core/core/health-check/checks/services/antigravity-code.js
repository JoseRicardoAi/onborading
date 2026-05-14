/**
 * Antigravity Code Check
 *
 * Verifies Antigravity Code CLI installation and configuration.
 *
 * @module aiox-core/health-check/checks/services/antigravity-code
 * @version 1.0.0
 * @story HCS-2 - Health Check System Implementation
 */

const fs = require('fs').promises;
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');
const { BaseCheck, CheckSeverity, CheckDomain } = require('../../base-check');

/**
 * Antigravity Code check
 *
 * @class AntigravityCodeCheck
 * @extends BaseCheck
 */
class AntigravityCodeCheck extends BaseCheck {
  constructor() {
    super({
      id: 'services.antigravity-code',
      name: 'Antigravity Code',
      description: 'Verifies Antigravity Code CLI configuration',
      domain: CheckDomain.SERVICES,
      severity: CheckSeverity.LOW,
      timeout: 3000,
      cacheable: true,
      healingTier: 0,
      tags: ['antigravity', 'ai', 'cli'],
    });
  }

  /**
   * Execute the check
   * @param {Object} context - Execution context
   * @returns {Promise<Object>} Check result
   */
  async execute(context) {
    const projectRoot = context.projectRoot || process.cwd();
    const homeDir = os.homedir();

    const details = {
      installed: false,
      version: null,
      projectConfig: false,
      globalConfig: false,
    };

    // Check if antigravity is installed
    try {
      const version = execSync('antigravity --version', {
        encoding: 'utf8',
        timeout: 5000,
        windowsHide: true,
      }).trim();

      details.installed = true;
      details.version = version;
    } catch {
      // Not installed - check config anyway
    }

    // Check project .antigravity directory
    try {
      const antigravityDir = path.join(projectRoot, '.antigravity');
      await fs.access(antigravityDir);
      details.projectConfig = true;

      // Check for ANTIGRAVITY.md
      try {
        await fs.access(path.join(antigravityDir, 'ANTIGRAVITY.md'));
        details.hasProjectInstructions = true;
      } catch {
        details.hasProjectInstructions = false;
      }
    } catch {
      // No project config
    }

    // Check global config
    try {
      const globalConfig = path.join(homeDir, '.antigravity.json');
      await fs.access(globalConfig);
      details.globalConfig = true;
    } catch {
      // No global config
    }

    // Check for global ANTIGRAVITY.md
    try {
      const globalAntigravityMd = path.join(homeDir, '.antigravity', 'ANTIGRAVITY.md');
      await fs.access(globalAntigravityMd);
      details.hasGlobalInstructions = true;
    } catch {
      details.hasGlobalInstructions = false;
    }

    if (!details.installed && !details.projectConfig && !details.globalConfig) {
      return this.pass('Antigravity Code not detected (not using Antigravity Code)', {
        details,
      });
    }

    const issues = [];

    if (!details.projectConfig) {
      issues.push('No project-level .antigravity directory');
    }

    if (details.projectConfig && !details.hasProjectInstructions) {
      issues.push('Project .antigravity/ANTIGRAVITY.md not found');
    }

    if (issues.length > 0) {
      return this.warning(`Antigravity Code configuration incomplete: ${issues.join(', ')}`, {
        recommendation: 'Add .antigravity/ANTIGRAVITY.md for project-specific instructions',
        details: { ...details, issues },
      });
    }

    const parts = [];
    if (details.installed) parts.push(`CLI v${details.version}`);
    if (details.projectConfig) parts.push('project config');
    if (details.globalConfig) parts.push('global config');

    return this.pass(`Antigravity Code configured (${parts.join(', ')})`, {
      details,
    });
  }
}

module.exports = AntigravityCodeCheck;
