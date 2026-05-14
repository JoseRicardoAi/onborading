#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const KNOWN_IDES = [
  'codex',
  'gemini',
  'cursor',
  'github-copilot',
  'antigravity',
  'antigravity-code',
  'vscode',
  'zed',
  'antigravity-desktop',
];

function loadCoreConfig(projectRoot) {
  const configPath = path.join(projectRoot, '.aiox-core', 'core-config.yaml');
  if (!fs.existsSync(configPath)) {
    return { configPath, config: null };
  }
  return {
    configPath,
    config: yaml.load(fs.readFileSync(configPath, 'utf8')) || {},
  };
}

function getEnabledConfigFlags(config) {
  return Object.entries((config.ide && config.ide.configs) || {})
    .filter(([, enabled]) => enabled === true)
    .map(([ide]) => ide)
    .sort();
}

function getEnabledSyncTargets(config) {
  return Object.entries((config.ideSync && config.ideSync.targets) || {})
    .filter(([, target]) => target && target.enabled === true)
    .map(([ide]) => ide)
    .sort();
}

function validateSingleRuntime(options = {}) {
  const projectRoot = options.projectRoot || process.cwd();
  const { configPath, config } = loadCoreConfig(projectRoot);
  const errors = [];
  const warnings = [];

  if (!config) {
    return {
      ok: false,
      errors: [`Core config not found: ${path.relative(projectRoot, configPath)}`],
      warnings,
      metrics: {},
    };
  }

  const selected = Array.isArray(config.ide && config.ide.selected)
    ? config.ide.selected
    : [];
  const enabledConfigs = getEnabledConfigFlags(config);
  const enabledTargets = getEnabledSyncTargets(config);

  if (selected.length !== 1) {
    errors.push(`ide.selected must contain exactly one runtime; found ${selected.length}`);
  }

  const activeRuntime = selected[0] || null;
  if (activeRuntime && !KNOWN_IDES.includes(activeRuntime)) {
    errors.push(`ide.selected contains unsupported runtime: ${activeRuntime}`);
  }

  if (enabledConfigs.length !== 1) {
    errors.push(`ide.configs must enable exactly one runtime; found ${enabledConfigs.join(', ') || '(none)'}`);
  }

  if (activeRuntime && enabledConfigs.length === 1 && enabledConfigs[0] !== activeRuntime) {
    errors.push(`ide.configs enables ${enabledConfigs[0]}, but ide.selected is ${activeRuntime}`);
  }

  const codexEnabled = enabledConfigs.includes('codex') || enabledTargets.includes('codex');
  const antigravityEnabled =
    enabledConfigs.includes('antigravity')
    || enabledConfigs.includes('antigravity-code')
    || enabledTargets.includes('antigravity')
    || enabledTargets.includes('antigravity-code');

  if (codexEnabled && antigravityEnabled) {
    errors.push('Codex and Antigravity cannot be enabled at the same time');
  }

  if (enabledTargets.length > 1) {
    errors.push(`ideSync.targets must enable at most one runtime target; found ${enabledTargets.join(', ')}`);
  }

  if (
    activeRuntime
    && Object.prototype.hasOwnProperty.call((config.ideSync && config.ideSync.targets) || {}, activeRuntime)
    && enabledTargets.length === 1
    && enabledTargets[0] !== activeRuntime
  ) {
    errors.push(`ideSync target ${enabledTargets[0]} is enabled, but ide.selected is ${activeRuntime}`);
  }

  if (
    activeRuntime
    && Object.prototype.hasOwnProperty.call((config.ideSync && config.ideSync.targets) || {}, activeRuntime)
    && enabledTargets.length === 0
  ) {
    errors.push(`ideSync target for active runtime ${activeRuntime} is disabled`);
  }

  return {
    ok: errors.length === 0,
    errors,
    warnings,
    metrics: {
      activeRuntime,
      enabledConfigs,
      enabledTargets,
    },
  };
}

function parseArgs(argv = process.argv.slice(2)) {
  const args = new Set(argv);
  return {
    json: args.has('--json'),
    quiet: args.has('--quiet') || args.has('-q'),
  };
}

function formatReport(result) {
  const lines = [];
  lines.push(result.ok
    ? `Single runtime validation passed: ${result.metrics.activeRuntime}`
    : `Single runtime validation failed (${result.errors.length} issue(s))`);
  if (result.errors.length > 0) {
    lines.push(...result.errors.map((error) => `- ${error}`));
  }
  if (result.warnings.length > 0) {
    lines.push(...result.warnings.map((warning) => `Warning: ${warning}`));
  }
  return lines.join('\n');
}

function main() {
  const args = parseArgs();
  const result = validateSingleRuntime();
  if (!args.quiet) {
    console.log(args.json ? JSON.stringify(result, null, 2) : formatReport(result));
  }
  if (!result.ok) {
    process.exitCode = 1;
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  validateSingleRuntime,
  parseArgs,
  formatReport,
};
