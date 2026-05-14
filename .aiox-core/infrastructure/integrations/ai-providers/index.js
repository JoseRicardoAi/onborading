/**
 * @fileoverview AI Providers Module
 *
 * Exports all AI provider classes and factory functions.
 *
 * @module aiox-core/infrastructure/integrations/ai-providers
 * @see Epic GEMINI-INT - Story 2: AI Provider Factory Pattern
 */

const { AIProvider } = require('./ai-provider');
const { AntigravityProvider } = require('./antigravity-provider');
const { GeminiProvider } = require('./gemini-provider');
const {
  getProvider,
  getPrimaryProvider,
  getFallbackProvider,
  getProviderForTask,
  executeWithFallback,
  getAvailableProviders,
  getProvidersStatus,
  clearProviderCache,
  getConfig,
} = require('./ai-provider-factory');

module.exports = {
  // Base class
  AIProvider,

  // Provider implementations
  AntigravityProvider,
  GeminiProvider,

  // Factory functions
  getProvider,
  getPrimaryProvider,
  getFallbackProvider,
  getProviderForTask,
  executeWithFallback,
  getAvailableProviders,
  getProvidersStatus,
  clearProviderCache,
  getConfig,
};
