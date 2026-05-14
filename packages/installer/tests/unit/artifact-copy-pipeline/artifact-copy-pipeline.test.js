'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');

const {
  copySkillFiles,
  copyExtraCommandFiles,
} = require('../../../../../packages/installer/src/wizard/ide-config-generator');

function createTempDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'artifact-copy-'));
}

function cleanup(dir) {
  fs.rmSync(dir, { recursive: true, force: true });
}

describe('artifact-copy-pipeline (Story INS-4.3)', () => {
  describe('copySkillFiles', () => {
    test('copies skill directories from source to target via real function', async () => {
      const sourceRoot = createTempDir();
      const targetRoot = createTempDir();

      try {
        // Create source skills
        const skillsDir = path.join(sourceRoot, '.antigravity', 'skills');
        for (const skill of ['skill-a', 'skill-b', 'skill-c']) {
          const dir = path.join(skillsDir, skill);
          fs.mkdirSync(dir, { recursive: true });
          fs.writeFileSync(path.join(dir, 'SKILL.md'), `# ${skill}`, 'utf8');
        }

        // Call the REAL exported function with _sourceRoot override
        const result = await copySkillFiles(targetRoot, sourceRoot);

        expect(result.count).toBe(3);
        expect(result.skipped).toBe(false);

        // Verify files actually copied to target
        const targetSkills = path.join(targetRoot, '.antigravity', 'skills');
        const copied = fs.readdirSync(targetSkills);
        expect(copied).toContain('skill-a');
        expect(copied).toContain('skill-b');
        expect(copied).toContain('skill-c');
        expect(copied.length).toBe(3);

        // Verify SKILL.md content preserved
        const skillMd = fs.readFileSync(path.join(targetSkills, 'skill-a', 'SKILL.md'), 'utf8');
        expect(skillMd).toBe('# skill-a');
      } finally {
        cleanup(sourceRoot);
        cleanup(targetRoot);
      }
    });

    test('returns skipped when source does not exist', async () => {
      const targetRoot = createTempDir();
      const fakeSourceRoot = path.join(os.tmpdir(), 'nonexistent-source-' + Date.now());

      try {
        // Call the REAL function with a non-existent source
        const result = await copySkillFiles(targetRoot, fakeSourceRoot);

        expect(result.skipped).toBe(true);
        expect(result.count).toBe(0);
      } finally {
        cleanup(targetRoot);
      }
    });

    test('copy is idempotent — re-copy overwrites without corruption', async () => {
      const sourceRoot = createTempDir();
      const targetRoot = createTempDir();

      try {
        const skillsDir = path.join(sourceRoot, '.antigravity', 'skills', 'test-skill');
        fs.mkdirSync(skillsDir, { recursive: true });
        fs.writeFileSync(path.join(skillsDir, 'SKILL.md'), '# v1', 'utf8');

        // First copy
        await copySkillFiles(targetRoot, sourceRoot);

        // Update source to v2
        fs.writeFileSync(path.join(skillsDir, 'SKILL.md'), '# v2', 'utf8');

        // Second copy (idempotent overwrite)
        const result = await copySkillFiles(targetRoot, sourceRoot);

        expect(result.count).toBe(1);
        const content = fs.readFileSync(
          path.join(targetRoot, '.antigravity', 'skills', 'test-skill', 'SKILL.md'),
          'utf8'
        );
        expect(content).toBe('# v2');
      } finally {
        cleanup(sourceRoot);
        cleanup(targetRoot);
      }
    });
  });

  describe('copyExtraCommandFiles', () => {
    test('copies .md files recursively excluding AIOX/agents/ via real function', async () => {
      const sourceRoot = createTempDir();
      const targetRoot = createTempDir();

      try {
        const cmdDir = path.join(sourceRoot, '.antigravity', 'workflows');

        // Create greet.md (root level)
        fs.mkdirSync(cmdDir, { recursive: true });
        fs.writeFileSync(path.join(cmdDir, 'greet.md'), '# Greet', 'utf8');

        // Create synapse/manager.md
        const synapseDir = path.join(cmdDir, 'synapse');
        fs.mkdirSync(synapseDir, { recursive: true });
        fs.writeFileSync(path.join(synapseDir, 'manager.md'), '# Manager', 'utf8');

        // Create synapse/tasks/add-rule.md
        const tasksDir = path.join(synapseDir, 'tasks');
        fs.mkdirSync(tasksDir, { recursive: true });
        fs.writeFileSync(path.join(tasksDir, 'add-rule.md'), '# Add Rule', 'utf8');

        // Create AIOX/agents/dev.md (should be EXCLUDED)
        const agentsDir = path.join(cmdDir, 'AIOX', 'agents');
        fs.mkdirSync(agentsDir, { recursive: true });
        fs.writeFileSync(path.join(agentsDir, 'dev.md'), '# Dev Agent', 'utf8');

        // Create AIOX/stories/story.md (should be EXCLUDED — project-specific)
        const storiesDir = path.join(cmdDir, 'AIOX', 'stories');
        fs.mkdirSync(storiesDir, { recursive: true });
        fs.writeFileSync(path.join(storiesDir, 'story.md'), '# Story', 'utf8');

        // Create squad directory (should be EXCLUDED — private)
        const squadDir = path.join(cmdDir, 'cohort-squad');
        fs.mkdirSync(squadDir, { recursive: true });
        fs.writeFileSync(path.join(squadDir, 'manager.md'), '# Squad', 'utf8');

        // Call the REAL exported function with _sourceRoot override
        const result = await copyExtraCommandFiles(targetRoot, sourceRoot);

        expect(result.count).toBe(3); // greet.md, manager.md, add-rule.md
        expect(result.skipped).toBe(false);

        // Verify distributable entries copied
        const targetCmd = path.join(targetRoot, '.antigravity', 'workflows');
        expect(fs.existsSync(path.join(targetCmd, 'greet.md'))).toBe(true);
        expect(fs.existsSync(path.join(targetCmd, 'synapse', 'manager.md'))).toBe(true);
        expect(fs.existsSync(path.join(targetCmd, 'synapse', 'tasks', 'add-rule.md'))).toBe(true);

        // Verify AIOX/agents/ was excluded (handled by copyAgentFiles)
        expect(fs.existsSync(path.join(targetCmd, 'AIOX', 'agents', 'dev.md'))).toBe(false);

        // Verify AIOX/stories/ was excluded (project-specific)
        expect(fs.existsSync(path.join(targetCmd, 'AIOX', 'stories', 'story.md'))).toBe(false);

        // Verify squad directories not copied (private)
        expect(fs.existsSync(path.join(targetCmd, 'cohort-squad'))).toBe(false);
      } finally {
        cleanup(sourceRoot);
        cleanup(targetRoot);
      }
    });
  });



  describe('generator failure graceful degradation', () => {
    test('generate-settings-json throws on missing config — install should catch', () => {
      const { generate } = require('../../../../../.aiox-core/infrastructure/scripts/generate-settings-json');

      // Calling generate on a non-existent path should throw
      expect(() => generate('/nonexistent/path')).toThrow();
    });
  });
});
