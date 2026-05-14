/**
 * Unit Tests: Doctor Check Modules
 * Story INS-4.1: aiox doctor rewrite
 * Story INS-4.8: 3 new checks (skills-count, commands-count, hooks-antigravity-count)
 *
 * Tests all 15 check modules individually with mocked filesystem.
 */

const path = require('path');
const fs = require('fs');

// Mock fs for controlled test scenarios
jest.mock('fs');

const nodeVersionCheck = require('../../../../../.aiox-core/core/doctor/checks/node-version');
const npmPackagesCheck = require('../../../../../.aiox-core/core/doctor/checks/npm-packages');
const settingsJsonCheck = require('../../../../../.aiox-core/core/doctor/checks/settings-json');
const rulesFilesCheck = require('../../../../../.aiox-core/core/doctor/checks/rules-files');
const agentMemoryCheck = require('../../../../../.aiox-core/core/doctor/checks/agent-memory');
const entityRegistryCheck = require('../../../../../.aiox-core/core/doctor/checks/entity-registry');
const gitHooksCheck = require('../../../../../.aiox-core/core/doctor/checks/git-hooks');
const coreConfigCheck = require('../../../../../.aiox-core/core/doctor/checks/core-config');
const antigravityMdCheck = require('../../../../../.aiox-core/core/doctor/checks/antigravity-md');
const graphDashboardCheck = require('../../../../../.aiox-core/core/doctor/checks/graph-dashboard');
const codeIntelCheck = require('../../../../../.aiox-core/core/doctor/checks/code-intel');
const ideSyncCheck = require('../../../../../.aiox-core/core/doctor/checks/ide-sync');
const skillsCountCheck = require('../../../../../.aiox-core/core/doctor/checks/skills-count');
const workflowsCountCheck = require('../../../../../.aiox-core/core/doctor/checks/workflows-count');
const governanceAgpCheck = require('../../../../../.aiox-core/core/doctor/checks/governance-agp');
const { loadChecks } = require('../../../../../.aiox-core/core/doctor/checks');

const mockContext = {
  projectRoot: '/mock/project',
  frameworkRoot: '/mock/framework',
  options: { fix: false, json: false, dryRun: false, quiet: false },
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('node-version check', () => {
  it('should PASS for current Node.js version (>=18)', async () => {
    const result = await nodeVersionCheck.run(mockContext);
    expect(result.check).toBe('node-version');
    expect(result.status).toBe('PASS');
    expect(result.message).toContain('Node.js');
  });
});

describe('npm-packages check', () => {
  it('should PASS when node_modules exists', async () => {
    fs.existsSync.mockReturnValue(true);
    const result = await npmPackagesCheck.run(mockContext);
    expect(result.status).toBe('PASS');
    expect(result.message).toContain('node_modules present');
  });

  it('should FAIL when node_modules missing', async () => {
    fs.existsSync.mockReturnValue(false);
    const result = await npmPackagesCheck.run(mockContext);
    expect(result.status).toBe('FAIL');
    expect(result.fixCommand).toBe('npm install');
  });
});

describe('settings-json check', () => {
  it('should PASS with valid settings and sufficient deny rules', async () => {
    fs.existsSync.mockReturnValue(true);
    const mockSettings = {
      permissions: {
        deny: new Array(50).fill('Edit(.aiox-core/core/)'),
        allow: ['Edit(docs/)'],
      },
    };
    const coreConfig = 'boundary:\n  protected:\n    - .aiox-core/core/**\n  exceptions:\n    - agents/MEMORY.md';
    fs.readFileSync.mockImplementation((p) => {
      if (p.includes('settings.json')) return JSON.stringify(mockSettings);
      if (p.includes('core-config')) return coreConfig;
      return '';
    });

    const result = await settingsJsonCheck.run(mockContext);
    expect(result.status).toBe('PASS');
    expect(result.message).toContain('50 rules');
  });

  it('should FAIL when settings.json not found', async () => {
    fs.existsSync.mockReturnValue(false);
    const result = await settingsJsonCheck.run(mockContext);
    expect(result.status).toBe('FAIL');
  });

  it('should WARN when deny rules below threshold', async () => {
    fs.existsSync.mockReturnValue(true);
    const mockSettings = { permissions: { deny: ['one'], allow: [] } };
    fs.readFileSync.mockReturnValue(JSON.stringify(mockSettings));

    const result = await settingsJsonCheck.run(mockContext);
    expect(result.status).toBe('WARN');
  });

  it('should WARN when boundary paths not covered by deny rules', async () => {
    fs.existsSync.mockReturnValue(true);
    const mockSettings = {
      permissions: {
        deny: new Array(50).fill('Edit(docs/)'),
        allow: [],
      },
    };
    const coreConfig = 'boundary:\n  protected:\n    - .aiox-core/core/**\n    - bin/aiox.js\n  exceptions:\n    - test';
    fs.readFileSync.mockImplementation((p) => {
      if (p.includes('settings.json')) return JSON.stringify(mockSettings);
      if (p.includes('core-config')) return coreConfig;
      return '';
    });

    const result = await settingsJsonCheck.run(mockContext);
    expect(result.status).toBe('WARN');
    expect(result.message).toContain('boundary coverage');
  });
});

describe('rules-files check', () => {
  it('should PASS when all 7 rules files exist', async () => {
    fs.existsSync.mockReturnValue(true);
    const result = await rulesFilesCheck.run(mockContext);
    expect(result.status).toBe('PASS');
    expect(result.message).toContain('7');
  });

  it('should FAIL when rules directory missing', async () => {
    fs.existsSync.mockReturnValue(false);
    const result = await rulesFilesCheck.run(mockContext);
    expect(result.status).toBe('FAIL');
  });

  it('should WARN when some rules missing', async () => {
    fs.existsSync.mockImplementation((p) => {
      // Directory exists
      if (p.endsWith('rules')) return true;
      // Most files exist except 2
      if (p.includes('agent-authority') || p.includes('workflow-execution')) return false;
      return true;
    });

    const result = await rulesFilesCheck.run(mockContext);
    expect(result.status).toBe('WARN');
    expect(result.message).toContain('Missing 2');
  });
});

describe('agent-memory check', () => {
  it('should PASS when all 10 MEMORY.md files exist', async () => {
    fs.existsSync.mockReturnValue(true);
    const result = await agentMemoryCheck.run(mockContext);
    expect(result.status).toBe('PASS');
    expect(result.message).toContain('10/10');
  });

  it('should WARN when some MEMORY.md files missing', async () => {
    fs.existsSync.mockImplementation((p) => {
      if (p.endsWith('agents')) return true;
      if (p.includes('analyst') || p.includes('ux')) return false;
      return true;
    });

    const result = await agentMemoryCheck.run(mockContext);
    expect(result.status).toBe('WARN');
    expect(result.message).toContain('8/10');
  });
});

describe('entity-registry check', () => {
  it('should PASS when registry exists and is fresh', async () => {
    fs.existsSync.mockReturnValue(true);
    fs.statSync.mockReturnValue({ mtimeMs: Date.now() - 1000 });
    fs.readFileSync.mockReturnValue('line1\nline2\nline3');

    const result = await entityRegistryCheck.run(mockContext);
    expect(result.status).toBe('PASS');
  });

  it('should FAIL when registry not found', async () => {
    fs.existsSync.mockReturnValue(false);
    const result = await entityRegistryCheck.run(mockContext);
    expect(result.status).toBe('FAIL');
  });

  it('should WARN when registry is stale (>48h)', async () => {
    fs.existsSync.mockReturnValue(true);
    fs.statSync.mockReturnValue({ mtimeMs: Date.now() - 72 * 60 * 60 * 1000 });
    fs.readFileSync.mockReturnValue('line1\nline2');

    const result = await entityRegistryCheck.run(mockContext);
    expect(result.status).toBe('WARN');
    expect(result.message).toContain('72h');
  });
});

describe('git-hooks check', () => {
  it('should PASS when both hooks exist', async () => {
    fs.existsSync.mockReturnValue(true);
    const result = await gitHooksCheck.run(mockContext);
    expect(result.status).toBe('PASS');
  });

  it('should WARN when .husky directory missing', async () => {
    fs.existsSync.mockReturnValue(false);
    const result = await gitHooksCheck.run(mockContext);
    expect(result.status).toBe('WARN');
  });
});

describe('core-config check', () => {
  it('should PASS when config has all required sections', async () => {
    fs.existsSync.mockReturnValue(true);
    fs.readFileSync.mockReturnValue('boundary:\n  test: true\nproject:\n  name: test\nide:\n  sync: true');

    const result = await coreConfigCheck.run(mockContext);
    expect(result.status).toBe('PASS');
  });

  it('should FAIL when config missing', async () => {
    fs.existsSync.mockReturnValue(false);
    const result = await coreConfigCheck.run(mockContext);
    expect(result.status).toBe('FAIL');
  });

  it('should FAIL when missing required sections', async () => {
    fs.existsSync.mockReturnValue(true);
    fs.readFileSync.mockReturnValue('project:\n  name: test');

    const result = await coreConfigCheck.run(mockContext);
    expect(result.status).toBe('FAIL');
    expect(result.message).toContain('boundary');
  });
});

describe('antigravity-md check', () => {
  it('should PASS when all sections present', async () => {
    fs.existsSync.mockReturnValue(true);
    fs.readFileSync.mockReturnValue(
      '## Constitution\n## Sistema de Agentes\n## Story-Driven Development',
    );

    const result = await antigravityMdCheck.run(mockContext);
    expect(result.status).toBe('PASS');
  });

  it('should WARN when sections missing', async () => {
    fs.existsSync.mockReturnValue(true);
    fs.readFileSync.mockReturnValue('## Constitution\nSome content');

    const result = await antigravityMdCheck.run(mockContext);
    expect(result.status).toBe('WARN');
    expect(result.message).toContain('Missing sections');
  });
});

describe('graph-dashboard check', () => {
  it('should PASS when directory has .js files', async () => {
    fs.existsSync.mockReturnValue(true);
    fs.readdirSync.mockReturnValue(['index.js', 'cli.js']);

    const result = await graphDashboardCheck.run(mockContext);
    expect(result.status).toBe('PASS');
  });

  it('should WARN when directory missing', async () => {
    fs.existsSync.mockReturnValue(false);
    const result = await graphDashboardCheck.run(mockContext);
    expect(result.status).toBe('WARN');
  });
});

describe('code-intel check', () => {
  // The code-intel check does a real require() of index.js and triggers
  // provider auto-detection. Tests that need provider detection must use
  // the real projectRoot and real fs (jest.requireActual).
  const realFs = jest.requireActual('fs');
  const realProjectRoot = path.join(__dirname, '..', '..', '..', '..', '..');

  it('should return INFO when code-intel dir does not exist', async () => {
    fs.existsSync.mockReturnValue(false);
    const result = await codeIntelCheck.run(mockContext);
    expect(result.status).toBe('INFO');
  });

  it('should WARN when index.js missing but dir exists', async () => {
    fs.existsSync.mockImplementation((p) => {
      // Dir exists, but index.js does not
      if (p.includes('index.js')) return false;
      return true;
    });
    const result = await codeIntelCheck.run(mockContext);
    expect(result.status).toBe('WARN');
    expect(result.message).toContain('index.js not found');
  });

  it('should PASS with RegistryProvider when entity-registry exists', async () => {
    // Use real fs + real project root so require() resolves the actual module
    // and RegistryProvider can load the real entity-registry.yaml
    const realContext = {
      ...mockContext,
      projectRoot: realProjectRoot,
    };

    // Temporarily restore real fs for this test
    fs.existsSync.mockImplementation(realFs.existsSync);
    fs.readFileSync.mockImplementation(realFs.readFileSync);
    fs.statSync.mockImplementation(realFs.statSync);

    // Only run if entity-registry actually exists (skip in CI without registry)
    const registryPath = path.join(realProjectRoot, '.aiox-core', 'data', 'entity-registry.yaml');
    if (!realFs.existsSync(registryPath)) {
      return; // skip — no registry available
    }

    const result = await codeIntelCheck.run(realContext);
    expect(result.status).toBe('PASS');
    expect(result.message).toContain('RegistryProvider');
  });

  it('should WARN when provider detection fails (no valid registry)', async () => {
    // Use real project root so require() works, but mock registry as empty
    const realContext = {
      ...mockContext,
      projectRoot: realProjectRoot,
    };

    // Real existsSync for module resolution, mocked readFileSync for empty registry
    fs.existsSync.mockImplementation((p) => {
      if (p.includes('entity-registry.yaml')) return true;
      return realFs.existsSync(p);
    });
    fs.statSync.mockImplementation((p) => {
      if (p.includes('entity-registry.yaml')) return { mtimeMs: Date.now(), size: 10 };
      return realFs.statSync(p);
    });
    fs.readFileSync.mockImplementation((p, enc) => {
      if (typeof p === 'string' && p.includes('entity-registry.yaml')) {
        return 'metadata:\n  entityCount: 0';
      }
      return realFs.readFileSync(p, enc);
    });

    const result = await codeIntelCheck.run(realContext);
    // Without valid entities, provider won't be available → WARN or INFO
    expect(['WARN', 'INFO']).toContain(result.status);
  });
});

describe('ide-sync check', () => {
  it('should PASS when counts match', async () => {
    fs.existsSync.mockReturnValue(true);
    fs.readdirSync.mockImplementation((p) => {
      if (p.includes('commands')) return ['dev.md', 'qa.md'];
      return ['dev.md', 'qa.md'];
    });

    const result = await ideSyncCheck.run(mockContext);
    expect(result.status).toBe('PASS');
  });

  it('should WARN when counts mismatch', async () => {
    fs.existsSync.mockReturnValue(true);
    fs.readdirSync.mockImplementation((p) => {
      if (p.includes('.antigravity')) return ['dev.md', 'qa.md', 'pm.md'];
      return ['dev.md', 'qa.md'];
    });

    const result = await ideSyncCheck.run(mockContext);
    expect(result.status).toBe('WARN');
  });
});

// === INS-4.8: New checks ===

describe('skills-count check', () => {
  it('should PASS when >=7 skills directories with SKILL.md', async () => {
    fs.existsSync.mockReturnValue(true);
    const dirs = Array.from({ length: 8 }, (_, i) => ({
      name: `skill-${i}`,
      isDirectory: () => true,
      isFile: () => false,
    }));
    fs.readdirSync.mockReturnValue(dirs);

    const result = await skillsCountCheck.run(mockContext);
    expect(result.check).toBe('skills-count');
    expect(result.status).toBe('PASS');
    expect(result.message).toContain('8');
  });

  it('should WARN when <7 skills found', async () => {
    fs.existsSync.mockImplementation((p) => {
      if (p.includes('skills') && !p.includes('SKILL.md')) return true;
      if (p.includes('SKILL.md')) return true;
      return true;
    });
    const dirs = Array.from({ length: 3 }, (_, i) => ({
      name: `skill-${i}`,
      isDirectory: () => true,
      isFile: () => false,
    }));
    fs.readdirSync.mockReturnValue(dirs);

    const result = await skillsCountCheck.run(mockContext);
    expect(result.status).toBe('WARN');
    expect(result.message).toContain('3/7');
  });

  it('should FAIL when 0 skills found', async () => {
    fs.existsSync.mockImplementation((p) => {
      if (p.includes('SKILL.md')) return false;
      return true;
    });
    const dirs = [{ name: 'empty', isDirectory: () => true, isFile: () => false }];
    fs.readdirSync.mockReturnValue(dirs);

    const result = await skillsCountCheck.run(mockContext);
    expect(result.status).toBe('FAIL');
    expect(result.fixCommand).toBe('npx aiox-antigravity install --force');
  });

  it('should FAIL when skills directory missing', async () => {
    fs.existsSync.mockReturnValue(false);
    const result = await skillsCountCheck.run(mockContext);
    expect(result.status).toBe('FAIL');
  });
});

describe('workflows-count check', () => {
  it('should PASS when >=4 workflow files', async () => {
    fs.existsSync.mockReturnValue(true);
    const files = Array.from({ length: 5 }, (_, i) => ({
      name: `workflow-${i}.md`,
      isDirectory: () => false,
      isFile: () => true,
    }));
    fs.readdirSync.mockReturnValue(files);

    const result = await workflowsCountCheck.run(mockContext);
    expect(result.check).toBe('workflows-count');
    expect(result.status).toBe('PASS');
    expect(result.message).toContain('5');
  });

  it('should WARN when 1-3 workflow files', async () => {
    fs.existsSync.mockReturnValue(true);
    const files = Array.from({ length: 2 }, (_, i) => ({
      name: `workflow-${i}.md`,
      isDirectory: () => false,
      isFile: () => true,
    }));
    fs.readdirSync.mockReturnValue(files);

    const result = await workflowsCountCheck.run(mockContext);
    expect(result.status).toBe('WARN');
    expect(result.message).toContain('2/4');
  });

  it('should FAIL when 0 workflow files', async () => {
    fs.existsSync.mockReturnValue(true);
    fs.readdirSync.mockReturnValue([]);

    const result = await workflowsCountCheck.run(mockContext);
    expect(result.status).toBe('FAIL');
    expect(result.message).toContain('No workflow');
  });

  it('should FAIL when workflows directory missing', async () => {
    fs.existsSync.mockReturnValue(false);
    const result = await workflowsCountCheck.run(mockContext);
    expect(result.status).toBe('FAIL');
  });
});

describe('governance-agp check', () => {
  it('should PASS when AGP is fully configured', async () => {
    fs.existsSync.mockReturnValue(true);
    const result = await governanceAgpCheck.run(mockContext);
    expect(result.check).toBe('governance-agp');
    expect(result.status).toBe('PASS');
    expect(result.message).toContain('fully configured');
  });

  it('should WARN when partially configured', async () => {
    fs.existsSync.mockImplementation((p) => {
      if (p.includes('SKILL.md')) return true;
      return false;
    });

    const result = await governanceAgpCheck.run(mockContext);
    expect(result.status).toBe('WARN');
    expect(result.message).toContain('partially configured');
  });

  it('should FAIL when no AGP configuration found', async () => {
    fs.existsSync.mockReturnValue(false);

    const result = await governanceAgpCheck.run(mockContext);
    expect(result.status).toBe('FAIL');
  });
});

// === INS-4.8: Registry and task validation ===

describe('check registry (INS-4.8)', () => {
  it('should load 15 checks total', () => {
    // loadChecks is the real function (not mocked) — verifies registration
    const checks = loadChecks();
    expect(checks).toHaveLength(15);
  });

  it('should include all 3 new checks', () => {
    const checks = loadChecks();
    const names = checks.map((c) => c.name);
    expect(names).toContain('skills-count');
    expect(names).toContain('workflows-count');
    expect(names).toContain('governance-agp');
  });
});

describe('health-check.yaml task (INS-4.8)', () => {
  it('should NOT have *doctor alias', () => {
    const realFs = jest.requireActual('fs');
    const yaml = realFs.readFileSync(
      path.join(__dirname, '..', '..', '..', '..', '..', '.aiox-core', 'development', 'tasks', 'health-check.yaml'),
      'utf8',
    );
    // Verify *doctor is not in the aliases list (only *hc should be)
    const aliasMatch = yaml.match(/aliases:\s*\n((?:\s+-\s+.*\n)*)/);
    expect(aliasMatch).toBeTruthy();
    expect(aliasMatch[1]).not.toContain('*doctor');
    expect(aliasMatch[1]).toContain('*hc');
  });

  it('should reference aiox doctor --json in instructions', () => {
    const realFs = jest.requireActual('fs');
    const yaml = realFs.readFileSync(
      path.join(__dirname, '..', '..', '..', '..', '..', '.aiox-core', 'development', 'tasks', 'health-check.yaml'),
      'utf8',
    );
    expect(yaml).toContain('aiox doctor --json');
    expect(yaml).toContain('npx aiox-antigravity doctor --json');
  });

  it('should have governance_map with all 15 checks', () => {
    const realFs = jest.requireActual('fs');
    const yaml = realFs.readFileSync(
      path.join(__dirname, '..', '..', '..', '..', '..', '.aiox-core', 'development', 'tasks', 'health-check.yaml'),
      'utf8',
    );
    const expectedChecks = [
      'settings-json', 'rules-files', 'agent-memory', 'entity-registry',
      'git-hooks', 'core-config', 'antigravity-md', 'ide-sync', 'graph-dashboard',
      'code-intel', 'node-version', 'npm-packages', 'skills-count',
      'workflows-count', 'governance-agp',
    ];
    for (const check of expectedChecks) {
      expect(yaml).toContain(`${check}:`);
    }
  });
});
