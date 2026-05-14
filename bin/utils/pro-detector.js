/**
 * Pro Detector - REMOVED
 *
 * This module previously detected the pro/ submodule availability.
 * The pro/ submodule has been removed from this project as part of the
 * migration to the Antigravity-native architecture.
 *
 * All functions now return safe no-op / null values for backward
 * compatibility with any code that may still import this module.
 *
 * @module bin/utils/pro-detector
 * @deprecated Since Antigravity migration — pro/ submodule removed
 */

'use strict';

/**
 * @returns {boolean} Always false — pro submodule removed
 */
function isProAvailable() {
  return false;
}

/**
 * @returns {null} Always null — pro submodule removed
 */
function loadProModule(_moduleName) {
  return null;
}

/**
 * @returns {null} Always null — pro submodule removed
 */
function getProVersion() {
  return null;
}

/**
 * @returns {{ available: false, version: null, path: null }}
 */
function getProInfo() {
  return { available: false, version: null, path: null };
}

module.exports = {
  isProAvailable,
  loadProModule,
  getProVersion,
  getProInfo,
  _PRO_DIR: null,
  _PRO_PACKAGE_PATH: null,
};
