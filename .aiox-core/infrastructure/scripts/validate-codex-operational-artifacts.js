#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

function walkFiles(dirPath) {
  if (!fs.existsSync(dirPath)) return [];
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkFiles(fullPath));
    } else {
      files.push(fullPath);
    }
  }
  return files;
}

function readText(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function rel(projectRoot, filePath) {
  return path.relative(projectRoot, filePath).replace(/\\/g, '/');
}

function isRuntimeSwitchWorkflow(filePath) {
  return path.basename(filePath) === 'switch-ide-runtime.md';
}

function getSkillDirs(root) {
  const skillsDir = path.join(root, 'skills');
  if (!fs.existsSync(skillsDir)) return [];
  return fs.readdirSync(skillsDir, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name)
    .sort();
}

const CODEX_FAMILIES = [
  'agents',
  'commands',
  'rules',
  'skills',
  'squads',
  'templates',
  'workflows',
  'agent-memory',
];

function getFamilyFromPath(root, filePath) {
  const relative = path.relative(root, filePath).replace(/\\/g, '/');
  return relative.split('/')[0] || '(root)';
}

function groupCountsByFamily(root, files) {
  return files.reduce((acc, file) => {
    const family = getFamilyFromPath(root, file);
    acc[family] = (acc[family] || 0) + 1;
    return acc;
  }, {});
}

function countPatternHits(files, projectRoot, patterns) {
  const counts = {};
  const examples = [];

  for (const file of files) {
    const content = readText(file);
    const relative = rel(projectRoot, file);
    for (const rule of patterns) {
      if (rule.pattern.test(content)) {
        counts[rule.label] = (counts[rule.label] || 0) + 1;
        if (examples.length < 10) {
          examples.push(`${relative} contains ${rule.label}`);
        }
      }
    }
  }

  return { counts, examples };
}

function isRuntimeAwareSharedArtifact(content) {
  return /Runtime Tool Mapping|runtimeTargets:|^## Runtime$|runtime ativo/im.test(content)
    && /\bAntigravity\b/i.test(content)
    && /\bCodex\b/i.test(content);
}

function isRuntimeAwareWorkflow(content) {
  return /runtime-aware|runtime ativo|runtime active|runtimeTargets:/i.test(content)
    && /\bAntigravity\b/i.test(content)
    && /\bCodex\b/i.test(content);
}

function findSharedRuntimeBiasIssues(content, runtimeAware) {
  const issues = [];

  if (/\bAntigravit\b/i.test(content)) {
    issues.push('Antigravit wording in shared squad artifact');
  }

  const biasedAntigravityPatterns = [
    {
      pattern: /\bpront[oa]s?\s+para\s+(?:o\s+)?Antigravity\b/i,
      label: 'Antigravity-only readiness wording in shared squad artifact',
    },
    {
      pattern: /\b(?:ferramentas|tools|capacidades)?\s*core\s+Antigravity\b/i,
      label: 'core Antigravity capability wording in shared squad artifact',
    },
  ];

  if (!runtimeAware) {
    for (const rule of biasedAntigravityPatterns) {
      if (rule.pattern.test(content)) {
        issues.push(rule.label);
      }
    }
  }

  return issues;
}

function validateCodexOperationalArtifacts(options = {}) {
  const projectRoot = options.projectRoot || process.cwd();
  const antigravityRoot = path.join(projectRoot, '.antigravity');
  const codexRoot = path.join(projectRoot, '.codex');
  const errors = [];
  const warnings = [];

  for (const family of CODEX_FAMILIES) {
    const familyDir = path.join(codexRoot, family);
    if (!fs.existsSync(familyDir)) {
      errors.push(`Missing Codex artifact family: .codex/${family}`);
    }
  }

  const antigravitySkills = getSkillDirs(antigravityRoot);
  const codexSkills = new Set(getSkillDirs(codexRoot));

  for (const skill of antigravitySkills) {
    const skillPath = path.join(codexRoot, 'skills', skill, 'SKILL.md');
    if (!codexSkills.has(skill) || !fs.existsSync(skillPath)) {
      errors.push(`Missing Codex skill equivalent for .antigravity/skills/${skill}`);
    }
  }

  const codexSquadsDir = path.join(codexRoot, 'squads');
  const antigravitySquadsDir = path.join(antigravityRoot, 'squads');
  const antigravitySquadFiles = walkFiles(antigravitySquadsDir);
  for (const sourceFile of antigravitySquadFiles) {
    const relative = path.relative(antigravitySquadsDir, sourceFile);
    const target = path.join(codexSquadsDir, relative);
    if (!fs.existsSync(target)) {
      errors.push(`Missing Codex squad file equivalent: ${rel(projectRoot, target)}`);
    }
  }

  const forbiddenPatterns = [
    { pattern: /\.antigravity[\\/]/i, label: '.antigravity path reference' },
    { pattern: /ANTIGRAVITY\.md/, label: 'ANTIGRAVITY.md reference' },
    { pattern: /\bsearch_web\b/, label: 'unmapped interface-native search_web reference' },
    { pattern: /\bread_url_content\b/, label: 'unmapped interface-native read_url_content reference' },
    { pattern: /\bview_file\b/, label: 'unmapped interface-native view_file reference' },
    { pattern: /\bwrite_to_file\b/, label: 'unmapped interface-native write_to_file reference' },
    { pattern: /\breplace_file_content\b/, label: 'unmapped interface-native replace_file_content reference' },
    { pattern: /\bmcp_stitch_[a-z0-9_]+/i, label: 'unmapped interface-native Stitch MCP reference' },
  ];
  const sharedSquadForbiddenPatterns = [
    { pattern: /\bsearch_web\b/, label: 'unmapped interface-native search_web reference', allowRuntimeAware: true },
    { pattern: /\bread_url_content\b/, label: 'unmapped interface-native read_url_content reference', allowRuntimeAware: true },
    { pattern: /\bview_file\b/, label: 'unmapped interface-native view_file reference', allowRuntimeAware: true },
    { pattern: /\bwrite_to_file\b/, label: 'unmapped interface-native write_to_file reference', allowRuntimeAware: true },
    { pattern: /\breplace_file_content\b/, label: 'unmapped interface-native replace_file_content reference', allowRuntimeAware: true },
    { pattern: /\bmcp_stitch_[a-z0-9_]+/i, label: 'unmapped interface-native Stitch MCP reference', allowRuntimeAware: false },
  ];

  const filesToScan = [
    ...walkFiles(path.join(codexRoot, 'skills')),
    ...walkFiles(path.join(codexRoot, 'squads')),
  ].filter(file => /\.(md|yaml|yml|json|py)$/i.test(file));

  const codexArtifactFiles = CODEX_FAMILIES
    .flatMap(family => walkFiles(path.join(codexRoot, family)))
    .filter(file => /\.(md|yaml|yml|json|py)$/i.test(file));

  const codexWorkflowFiles = [
    ...walkFiles(path.join(codexRoot, 'workflows')),
    ...walkFiles(path.join(codexRoot, 'squads')),
  ].filter(file => /[\\/]workflows[\\/].+\.(md|yaml|yml)$/i.test(file));

  const antigravityWorkflowFiles = walkFiles(path.join(antigravityRoot, 'workflows'))
    .filter(file => /\.(md|yaml|yml)$/i.test(file));

  const sharedWorkflowFiles = walkFiles(path.join(projectRoot, 'squads'))
    .filter(file => /[\\/]workflows[\\/].+\.(md|yaml|yml)$/i.test(file));

  for (const file of filesToScan) {
    const content = readText(file);
    for (const rule of forbiddenPatterns) {
      if (rule.pattern.test(content)) {
        errors.push(`${rel(projectRoot, file)} contains ${rule.label}`);
      }
    }
  }

  const codexWorkflowForbiddenPatterns = [
    { pattern: /\bAntiGravity\b|\bAntigravity\b/, label: 'Antigravity wording in Codex workflow' },
    { pattern: /runtime-aware|runtime ativo|runtime active/i, label: 'runtime-aware wording in Codex workflow' },
    { pattern: /\.antigravity[\\/]/i, label: '.antigravity path reference in Codex workflow' },
    { pattern: /ANTIGRAVITY\.md/, label: 'ANTIGRAVITY.md reference in Codex workflow' },
    { pattern: /\b(search_web|read_url_content|view_file|write_to_file|replace_file_content)\b/, label: 'unmapped interface-native tool in Codex workflow' },
    { pattern: /\bmcp_stitch_[a-z0-9_]+/i, label: 'unmapped Stitch MCP call in Codex workflow' },
    { pattern: /exclusiv[ao]s?|exclusive/i, label: 'exclusive capability wording in Codex workflow' },
  ];

  for (const file of codexWorkflowFiles) {
    if (isRuntimeSwitchWorkflow(file)) {
      continue;
    }
    const content = readText(file);
    for (const rule of codexWorkflowForbiddenPatterns) {
      if (rule.pattern.test(content)) {
        errors.push(`${rel(projectRoot, file)} contains ${rule.label}`);
      }
    }
  }

  const antigravityWorkflowForbiddenPatterns = [
    { pattern: /\.codex[\\/]/i, label: '.codex path reference in Antigravity workflow' },
    { pattern: /CODEX\.md/, label: 'CODEX.md reference in Antigravity workflow' },
  ];

  for (const file of antigravityWorkflowFiles) {
    if (isRuntimeSwitchWorkflow(file)) {
      continue;
    }
    const content = readText(file);
    for (const rule of antigravityWorkflowForbiddenPatterns) {
      if (rule.pattern.test(content)) {
        errors.push(`${rel(projectRoot, file)} contains ${rule.label}`);
      }
    }
  }

  for (const file of sharedWorkflowFiles) {
    const content = readText(file);
    const mentionsRuntimePath = /\.codex[\\/]|\.antigravity[\\/]/i.test(content);
    if (mentionsRuntimePath && !isRuntimeAwareWorkflow(content)) {
      errors.push(`${rel(projectRoot, file)} references runtime paths without runtime-aware workflow mapping`);
    }
    if (/exclusiv[ao]s?|exclusive/i.test(content)) {
      errors.push(`${rel(projectRoot, file)} contains exclusive capability wording in shared workflow`);
    }
  }

  const sharedSquadFiles = walkFiles(path.join(projectRoot, 'squads'))
    .filter(file => /\.(md|yaml|yml|json)$/i.test(file));
  for (const file of sharedSquadFiles) {
    const content = readText(file);
    const runtimeAware = isRuntimeAwareSharedArtifact(content);
    const runtimeBiasIssues = findSharedRuntimeBiasIssues(content, runtimeAware);
    for (const issue of runtimeBiasIssues) {
      errors.push(`${rel(projectRoot, file)} contains ${issue}`);
    }
    for (const rule of sharedSquadForbiddenPatterns) {
      if (rule.pattern.test(content)) {
        if (rule.allowRuntimeAware && runtimeAware) {
          continue;
        }
        errors.push(`${rel(projectRoot, file)} contains ${rule.label}`);
      }
    }
  }

  const squadYamlFiles = walkFiles(codexSquadsDir).filter(file => /squad\.ya?ml$/i.test(file));
  for (const file of squadYamlFiles) {
    const content = readText(file);
    if (!content.includes('.codex/squads/') && content.includes('skill:')) {
      warnings.push(`${rel(projectRoot, file)} has skill entries without explicit .codex/squads path`);
    }
  }

  const deepScanFiles = codexArtifactFiles
    .filter(file => !filesToScan.includes(file))
    .filter(file => !isRuntimeSwitchWorkflow(file));
  const legacyPatterns = [
    { pattern: /\.antigravity[\\/]/i, label: '.antigravity path reference' },
    { pattern: /ANTIGRAVITY\.md/, label: 'ANTIGRAVITY.md reference' },
    { pattern: /\bsearch_web\b/, label: 'unmapped interface-native search_web reference' },
    { pattern: /\bread_url_content\b/, label: 'unmapped interface-native read_url_content reference' },
    { pattern: /\bview_file\b/, label: 'unmapped interface-native view_file reference' },
    { pattern: /\bwrite_to_file\b/, label: 'unmapped interface-native write_to_file reference' },
    { pattern: /\breplace_file_content\b/, label: 'unmapped interface-native replace_file_content reference' },
    { pattern: /\bmcp_stitch_[a-z0-9_]+/i, label: 'unmapped interface-native Stitch MCP reference' },
  ];
  const deepScan = countPatternHits(deepScanFiles, projectRoot, legacyPatterns);
  const deepScanLabels = Object.entries(deepScan.counts)
    .map(([label, count]) => `${label}: ${count}`)
    .join('; ');
  if (deepScanLabels) {
    warnings.push(`Deep scan found Codex adaptation backlog outside skills/squads (${deepScanLabels})`);
    warnings.push(...deepScan.examples.map(example => `Deep scan sample: ${example}`));
  }

  return {
    ok: errors.length === 0,
    errors,
    warnings,
    metrics: {
      antigravitySkills: antigravitySkills.length,
      codexSkills: codexSkills.size,
      antigravitySquadFiles: antigravitySquadFiles.length,
      scannedFiles: filesToScan.length,
      codexArtifactFiles: codexArtifactFiles.length,
      codexFamilyCounts: groupCountsByFamily(codexRoot, codexArtifactFiles),
      deepScanFindings: deepScan.counts,
      sharedSquadFiles: sharedSquadFiles.length,
      codexWorkflowFiles: codexWorkflowFiles.length,
      antigravityWorkflowFiles: antigravityWorkflowFiles.length,
      sharedWorkflowFiles: sharedWorkflowFiles.length,
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
    ? `✅ Codex operational artifacts validation passed (${result.metrics.scannedFiles} files scanned)`
    : `❌ Codex operational artifacts validation failed (${result.errors.length} issue(s))`);
  lines.push(`Skills: Antigravity=${result.metrics.antigravitySkills}, Codex=${result.metrics.codexSkills}`);
  lines.push(`Squad files mirrored from .antigravity: ${result.metrics.antigravitySquadFiles}`);
  lines.push(`Codex artifact files scanned for inventory: ${result.metrics.codexArtifactFiles}`);
  lines.push(`Codex family counts: ${JSON.stringify(result.metrics.codexFamilyCounts)}`);
  lines.push(`Shared squad files scanned: ${result.metrics.sharedSquadFiles}`);
  lines.push(`Workflow files: Codex=${result.metrics.codexWorkflowFiles}, Antigravity=${result.metrics.antigravityWorkflowFiles}, shared=${result.metrics.sharedWorkflowFiles}`);
  if (result.errors.length > 0) {
    lines.push(...result.errors.map(error => `- ${error}`));
  }
  if (result.warnings.length > 0) {
    lines.push(...result.warnings.map(warning => `⚠️ ${warning}`));
  }
  return lines.join('\n');
}

function main() {
  const args = parseArgs();
  const result = validateCodexOperationalArtifacts();
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
  validateCodexOperationalArtifacts,
  parseArgs,
  formatReport,
  findSharedRuntimeBiasIssues,
};
