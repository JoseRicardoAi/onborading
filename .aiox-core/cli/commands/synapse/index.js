/**
 * SYNAPSE CLI command.
 *
 * Provides explicit, hook-free access to the SYNAPSE context engine for
 * runtimes such as Codex where IDE hooks are not available.
 *
 * @module cli/commands/synapse
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { Command } = require('commander');

function getProjectRoot(options = {}) {
  return path.resolve(options.cwd || process.cwd());
}

function getSynapsePath(projectRoot) {
  return path.join(projectRoot, '.synapse');
}

function loadCoreModule(projectRoot, relativePath) {
  return require(path.join(projectRoot, '.aiox-core', 'core', 'synapse', relativePath));
}

function readJsonIfExists(filePath) {
  try {
    if (!fs.existsSync(filePath)) return null;
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (_error) {
    return null;
  }
}

function ensureSynapse(projectRoot) {
  const synapsePath = getSynapsePath(projectRoot);
  if (!fs.existsSync(synapsePath) || !fs.statSync(synapsePath).isDirectory()) {
    throw new Error(`.synapse directory not found at ${synapsePath}`);
  }
  return synapsePath;
}

function loadManifest(projectRoot) {
  const synapsePath = ensureSynapse(projectRoot);
  const { parseManifest } = loadCoreModule(projectRoot, 'domain/domain-loader.js');
  return {
    synapsePath,
    manifest: parseManifest(path.join(synapsePath, 'manifest')),
  };
}

function getActiveAgent(synapsePath) {
  return readJsonIfExists(path.join(synapsePath, 'sessions', '_active-agent.json'));
}

function getMetrics(synapsePath) {
  return {
    uap: readJsonIfExists(path.join(synapsePath, 'metrics', 'uap-metrics.json')),
    hook: readJsonIfExists(path.join(synapsePath, 'metrics', 'hook-metrics.json')),
  };
}

function countDomains(manifest) {
  const domains = Object.values(manifest.domains || {});
  return {
    total: domains.length,
    active: domains.filter(domain => domain.state === 'active').length,
    alwaysOn: domains.filter(domain => domain.alwaysOn).length,
    agent: domains.filter(domain => domain.agentTrigger).length,
    workflow: domains.filter(domain => domain.workflowTrigger).length,
  };
}

function formatDomainRows(manifest) {
  return Object.entries(manifest.domains || {})
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, domain]) => ({
      name,
      file: domain.file,
      state: domain.state || 'unknown',
      trigger: domain.agentTrigger
        ? `agent:${domain.agentTrigger}`
        : domain.workflowTrigger
          ? `workflow:${domain.workflowTrigger}`
          : domain.alwaysOn
            ? 'always-on'
            : '-',
    }));
}

function printJson(data) {
  console.log(JSON.stringify(data, null, 2));
}

function printStatus(projectRoot, options = {}) {
  const { synapsePath, manifest } = loadManifest(projectRoot);
  const activeAgent = getActiveAgent(synapsePath);
  const metrics = getMetrics(synapsePath);
  const domainCounts = countDomains(manifest);

  const data = {
    projectRoot,
    synapsePath,
    devmode: manifest.devmode === true,
    domains: domainCounts,
    activeAgent,
    metrics: {
      uap: metrics.uap
        ? {
          agentId: metrics.uap.agentId,
          quality: metrics.uap.quality,
          totalDuration: metrics.uap.totalDuration,
          timestamp: metrics.uap.timestamp,
        }
        : null,
      hook: metrics.hook
        ? {
          bracket: metrics.hook.bracket,
          layersLoaded: metrics.hook.layersLoaded,
          layersSkipped: metrics.hook.layersSkipped,
          totalRules: metrics.hook.totalRules,
          timestamp: metrics.hook.timestamp,
        }
        : null,
    },
    codexMode: {
      automaticHook: false,
      activation: 'explicit skill/CLI command',
      note: 'Antigravity/Claude hook diagnostics are legacy compatibility checks.',
    },
  };

  if (options.json) {
    printJson(data);
    return;
  }

  console.log('SYNAPSE Status');
  console.log(`Project: ${projectRoot}`);
  console.log(`Path: ${synapsePath}`);
  console.log(`Devmode: ${data.devmode ? 'on' : 'off'}`);
  console.log(`Domains: ${domainCounts.active}/${domainCounts.total} active (${domainCounts.agent} agent, ${domainCounts.workflow} workflow)`);
  if (activeAgent) {
    console.log(`Active agent: ${activeAgent.id || '(unknown)'} (${activeAgent.activation_quality || 'unknown'})`);
  } else {
    console.log('Active agent: none');
  }
  if (data.metrics.uap) {
    console.log(`UAP metrics: ${data.metrics.uap.quality || 'unknown'} at ${data.metrics.uap.timestamp || 'unknown time'}`);
  } else {
    console.log('UAP metrics: not available');
  }
  if (data.metrics.hook) {
    console.log(`Engine metrics: ${data.metrics.hook.bracket || 'unknown'}; ${data.metrics.hook.layersLoaded || 0} layers loaded`);
  } else {
    console.log('Engine metrics: not available yet');
  }
  console.log('Codex activation: explicit skill/CLI command; no automatic IDE hook assumed.');
}

function printDomains(projectRoot, options = {}) {
  const { manifest } = loadManifest(projectRoot);
  const rows = formatDomainRows(manifest);

  if (options.json) {
    printJson(rows);
    return;
  }

  console.log('SYNAPSE Domains');
  console.log('| Domain | State | Trigger | File |');
  console.log('| --- | --- | --- | --- |');
  for (const row of rows) {
    console.log(`| ${row.name} | ${row.state} | ${row.trigger} | ${row.file} |`);
  }
}

async function runEngine(projectRoot, prompt, options = {}) {
  if (options.legacy) {
    process.env.SYNAPSE_LEGACY_MODE = 'true';
  }

  const { synapsePath, manifest } = loadManifest(projectRoot);
  const { SynapseEngine } = loadCoreModule(projectRoot, 'engine.js');

  const activeAgent = options.agent
    ? { id: options.agent }
    : getActiveAgent(synapsePath);

  const session = {
    prompt_count: Number(options.promptCount || 0),
    active_agent: activeAgent && activeAgent.id ? { id: activeAgent.id } : undefined,
  };

  const engine = new SynapseEngine(synapsePath, { manifest });
  const result = await engine.process(prompt || '', session);

  if (options.json) {
    printJson({
      bracket: result.bracket,
      metrics: {
        total_ms: result.metrics.total_ms,
        layers_loaded: result.metrics.layers_loaded,
        layers_skipped: result.metrics.layers_skipped,
        layers_errored: result.metrics.layers_errored,
        total_rules: result.metrics.total_rules,
      },
      xml: result.xml,
    });
    return;
  }

  console.log(result.xml);
  console.log('');
  console.log(`SYNAPSE summary: bracket=${result.bracket}; layers_loaded=${result.metrics.layers_loaded}; total_rules=${result.metrics.total_rules}`);
}

function validateSkillRuntime(projectRoot, runtime) {
  const checks = [];
  const skillPath = path.join(projectRoot, runtime === 'codex' ? '.codex' : '.antigravity', 'skills', 'synapse', 'SKILL.md');

  checks.push({
    name: `${runtime} synapse skill`,
    status: fs.existsSync(skillPath) ? 'PASS' : 'FAIL',
    detail: fs.existsSync(skillPath) ? skillPath : `${skillPath} not found`,
  });

  if (runtime === 'antigravity') {
    checks.push({
      name: 'antigravity hook policy',
      status: 'PASS',
      detail: 'Antigravity runtime uses semi-automatic skill execution; Claude hooks are legacy and optional',
    });
  }

  if (runtime === 'codex') {
    checks.push({
      name: 'codex hook policy',
      status: 'PASS',
      detail: 'Codex uses explicit skill/CLI execution; Claude hooks are legacy and optional',
    });
  }

  return checks;
}

async function validateSynapse(projectRoot, options = {}) {
  const checks = [];
  const runtime = options.runtime || 'all';
  if (!['all', 'antigravity', 'codex'].includes(runtime)) {
    throw new Error('Invalid runtime. Use: all, antigravity, codex');
  }

  function addCheck(name, status, detail) {
    checks.push({ name, status, detail });
  }

  let synapsePath;
  let manifest;

  try {
    const loaded = loadManifest(projectRoot);
    synapsePath = loaded.synapsePath;
    manifest = loaded.manifest;
    addCheck('.synapse directory', 'PASS', synapsePath);
    addCheck('manifest parse', 'PASS', `${Object.keys(manifest.domains || {}).length} domain(s) registered`);
  } catch (error) {
    addCheck('.synapse directory', 'FAIL', error.message);
  }

  if (synapsePath && manifest) {
    const requiredFiles = [
      'manifest',
      'constitution',
      'global',
      'context',
      'commands',
    ];

    for (const fileName of requiredFiles) {
      const filePath = path.join(synapsePath, fileName);
      addCheck(
        fileName,
        fs.existsSync(filePath) ? 'PASS' : 'FAIL',
        fs.existsSync(filePath) ? filePath : `${filePath} not found`,
      );
    }

    const missingDomainFiles = formatDomainRows(manifest)
      .filter(row => !fs.existsSync(path.join(synapsePath, row.file)));

    addCheck(
      'domain files',
      missingDomainFiles.length === 0 ? 'PASS' : 'FAIL',
      missingDomainFiles.length === 0
        ? 'All registered domain files exist'
        : `Missing: ${missingDomainFiles.map(row => row.file).join(', ')}`,
    );

    try {
      const { SynapseEngine } = loadCoreModule(projectRoot, 'engine.js');
      const engine = new SynapseEngine(synapsePath, { manifest });
      const activeAgent = getActiveAgent(synapsePath);
      const session = {
        prompt_count: 0,
        active_agent: activeAgent && activeAgent.id ? { id: activeAgent.id } : { id: 'dev' },
      };
      const result = await engine.process('validate synapse', session);
      addCheck(
        'explicit engine run',
        result && result.metrics && result.metrics.layers_loaded > 0 ? 'PASS' : 'FAIL',
        result && result.metrics
          ? `bracket=${result.bracket}; layers_loaded=${result.metrics.layers_loaded}; total_rules=${result.metrics.total_rules}`
          : 'No engine result returned',
      );
    } catch (error) {
      addCheck('explicit engine run', 'FAIL', error.message);
    }
  }

  if (runtime === 'all' || runtime === 'antigravity') {
    checks.push(...validateSkillRuntime(projectRoot, 'antigravity'));
  }

  if (runtime === 'all' || runtime === 'codex') {
    checks.push(...validateSkillRuntime(projectRoot, 'codex'));
  }

  const failed = checks.filter(check => check.status === 'FAIL');
  const data = {
    status: failed.length === 0 ? 'PASS' : 'FAIL',
    projectRoot,
    checks,
  };

  if (options.json) {
    printJson(data);
  } else {
    console.log('SYNAPSE Runtime Validation');
    console.log(`Status: ${data.status}`);
    console.log(`Runtime: ${runtime}`);
    console.log('| Check | Status | Detail |');
    console.log('| --- | --- | --- |');
    for (const check of checks) {
      console.log(`| ${check.name} | ${check.status} | ${String(check.detail).replace(/\|/g, '\\|')} |`);
    }
  }

  if (failed.length > 0) {
    process.exitCode = 1;
  }
}

function runDiagnose(projectRoot, options = {}) {
  const diagnostics = loadCoreModule(projectRoot, 'diagnostics/synapse-diagnostics.js');

  if (options.json) {
    printJson(diagnostics.runDiagnosticsRaw(projectRoot));
    return;
  }

  console.log(diagnostics.runDiagnostics(projectRoot));
}

function createSynapseCommand() {
  const synapse = new Command('synapse')
    .description('Inspect and execute the SYNAPSE context engine without IDE hooks')
    .option('--cwd <path>', 'Project root', process.cwd());

  synapse
    .command('status')
    .description('Show SYNAPSE state for the current project')
    .option('--json', 'Output structured JSON')
    .action((options, command) => {
      const parent = command.parent.opts();
      printStatus(getProjectRoot(parent), options);
    });

  synapse
    .command('domains')
    .description('List registered SYNAPSE domains')
    .option('--json', 'Output structured JSON')
    .action((options, command) => {
      const parent = command.parent.opts();
      printDomains(getProjectRoot(parent), options);
    });

  synapse
    .command('validate')
    .description('Validate SYNAPSE for Antigravity skill mode and Codex explicit execution')
    .option('--runtime <runtime>', 'Runtime to validate: all, antigravity, codex', 'all')
    .option('--json', 'Output structured JSON')
    .action(async (options, command) => {
      const parent = command.parent.opts();
      await validateSynapse(getProjectRoot(parent), options);
    });

  synapse
    .command('diagnose')
    .alias('debug')
    .description('Run SYNAPSE diagnostics')
    .option('--json', 'Output raw diagnostic JSON')
    .action((options, command) => {
      const parent = command.parent.opts();
      runDiagnose(getProjectRoot(parent), options);
    });

  synapse
    .command('run [prompt]')
    .description('Run the SYNAPSE engine explicitly and print injected context')
    .option('--agent <id>', 'Active agent id for L2 agent rules')
    .option('--prompt-count <count>', 'Session prompt count', '0')
    .option('--legacy', 'Enable legacy L0-L7 mode for this process')
    .option('--json', 'Output structured JSON')
    .action(async (prompt, options, command) => {
      const parent = command.parent.opts();
      await runEngine(getProjectRoot(parent), prompt, options);
    });

  return synapse;
}

module.exports = {
  createSynapseCommand,
  printStatus,
  printDomains,
  runDiagnose,
  runEngine,
  validateSynapse,
};
