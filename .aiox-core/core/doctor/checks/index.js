/**
 * Doctor Check Registry
 *
 * Exports all 15 check modules in execution order.
 *
 * @module aiox-core/doctor/checks
 * @story INS-4.1, INS-4.8
 */

const settingsJson = require('./settings-json');
const rulesFiles = require('./rules-files');
const agentMemory = require('./agent-memory');
const entityRegistry = require('./entity-registry');
const gitHooks = require('./git-hooks');
const coreConfig = require('./core-config');
const antigravityMd = require('./antigravity-md');
const ideSync = require('./ide-sync');
const graphDashboard = require('./graph-dashboard');
const codeIntel = require('./code-intel');
const nodeVersion = require('./node-version');
const npmPackages = require('./npm-packages');
const skillsCount = require('./skills-count');
const workflowsCount = require('./workflows-count');
const governanceAgp = require('./governance-agp');

function loadChecks() {
  return [
    settingsJson,
    rulesFiles,
    agentMemory,
    entityRegistry,
    gitHooks,
    coreConfig,
    antigravityMd,
    ideSync,
    graphDashboard,
    codeIntel,
    nodeVersion,
    npmPackages,
    skillsCount,
    workflowsCount,
    governanceAgp,
  ];
}

module.exports = { loadChecks };
