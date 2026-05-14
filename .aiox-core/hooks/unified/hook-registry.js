/**
 * Unified Hook Registry
 * Story GEMINI-INT.8 - Cross-CLI Hook Abstraction
 *
 * Central registry for unified hooks.
 */

const fs = require('fs');
const path = require('path');
const { UnifiedHook, EVENT_MAPPING } = require('./hook-interface');

/**
 * Hook Registry - manages all unified hooks
 */
class HookRegistry {
  constructor() {
    this.hooks = new Map();
  }

  /**
   * Register a hook
   * @param {UnifiedHook} hook - Hook to register
   */
  register(hook) {
    if (!(hook instanceof UnifiedHook)) {
      throw new Error('Hook must extend UnifiedHook');
    }
    this.hooks.set(hook.name, hook);
  }

  /**
   * Get a hook by name
   * @param {string} name - Hook name
   * @returns {UnifiedHook|undefined}
   */
  get(name) {
    return this.hooks.get(name);
  }

  /**
   * Get all hooks for an event
   * @param {string} event - Event name
   * @returns {UnifiedHook[]}
   */
  getByEvent(event) {
    return Array.from(this.hooks.values()).filter((h) => h.event === event);
  }

  /**
   * Generate Antigravity Code hooks configuration
   * @returns {Object} Antigravity hooks config for .antigravity/settings.json
   */
  toAntigravityConfig() {
    const config = {};

    for (const hook of this.hooks.values()) {
      const antigravityConfig = hook.toAntigravityConfig();
      if (!antigravityConfig) continue;

      const event = antigravityConfig.event;
      if (!config[event]) {
        config[event] = [];
      }

      config[event].push({
        matcher: antigravityConfig.matcher,
        command: antigravityConfig.handler,
      });
    }

    return config;
  }

  /**
   * Generate Gemini CLI hooks configuration
   * @returns {Object} Gemini hooks config for .gemini/settings.json
   */
  toGeminiConfig() {
    const config = {};

    for (const hook of this.hooks.values()) {
      const geminiConfig = hook.toGeminiConfig();
      const event = EVENT_MAPPING[hook.event]?.gemini;

      if (!event) continue;

      if (!config[event]) {
        config[event] = [];
      }

      config[event].push(geminiConfig);
    }

    return { hooks: config };
  }

  /**
   * Write configurations to project
   * @param {string} projectDir - Project directory
   */
  async writeConfigs(projectDir) {
    // Write Gemini config
    const geminiDir = path.join(projectDir, '.gemini');
    if (!fs.existsSync(geminiDir)) {
      fs.mkdirSync(geminiDir, { recursive: true });
    }

    const geminiConfig = this.toGeminiConfig();
    const geminiSettingsPath = path.join(geminiDir, 'settings.json');

    let existingGemini = {};
    if (fs.existsSync(geminiSettingsPath)) {
      existingGemini = JSON.parse(fs.readFileSync(geminiSettingsPath, 'utf8'));
    }

    const mergedGemini = {
      ...existingGemini,
      hooks: {
        ...existingGemini.hooks,
        ...geminiConfig.hooks,
      },
    };

    fs.writeFileSync(geminiSettingsPath, JSON.stringify(mergedGemini, null, 2));

    // Write Antigravity config (if applicable)
    const antigravityConfig = this.toAntigravityConfig();
    if (Object.keys(antigravityConfig).length > 0) {
      const antigravityDir = path.join(projectDir, '.antigravity');
      if (!fs.existsSync(antigravityDir)) {
        fs.mkdirSync(antigravityDir, { recursive: true });
      }

      const hooksPath = path.join(antigravityDir, 'hooks.json');
      fs.writeFileSync(hooksPath, JSON.stringify(antigravityConfig, null, 2));
    }
  }
}

// Singleton instance
const registry = new HookRegistry();

module.exports = { HookRegistry, registry };
