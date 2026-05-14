/**
 * IDE Selector Module
 *
 * Story 1.4: IDE Selection
 * Provides single IDE prompt for wizard
 *
 * @module wizard/ide-selector
 */

const inquirer = require('inquirer');
const { getIDEChoices, getIDEKeys } = require('../config/ide-configs');
const { colors } = require('../utils/aiox-colors');
const { t } = require('./i18n');

/**
 * Validate IDE selection (exactly one required)
 * @param {string[]} selectedIDEs - Array of selected IDE keys
 * @returns {boolean|string} True if valid, error message if invalid
 */
function validateIDESelection(selectedIDEs) {
  if (!Array.isArray(selectedIDEs)) {
    return 'Invalid selection format';
  }

  // Validate all selected IDEs are valid
  const validIDEs = getIDEKeys();
  const invalidIDEs = selectedIDEs.filter((ide) => !validIDEs.includes(ide));

  if (invalidIDEs.length > 0) {
    return `Invalid IDE selections: ${invalidIDEs.join(', ')}`;
  }

  if (selectedIDEs.length !== 1) {
    return 'Please select exactly one IDE/runtime';
  }

  return true;
}

/**
 * Prompt user to select one IDE
 *
 * @returns {Promise<string[]>} Array of selected IDE keys
 *
 * @example
 * const selectedIDEs = await selectIDEs();
 * console.log(selectedIDEs); // ['codex']
 */
async function selectIDEs() {
  const { selectedIDEs } = await inquirer.prompt([
    {
      type: 'list',
      name: 'selectedIDEs',
      message: colors.primary(t('ideQuestion')) + colors.dim(`\n  (${t('ideHint')})`),
      choices: getIDEChoices(),
      filter: value => [value],
      pageSize: 10,
    },
  ]);

  return Array.isArray(selectedIDEs) ? selectedIDEs : [selectedIDEs];
}

/**
 * Get IDE selection question for wizard integration
 * @returns {Object} Inquirer question object
 */
function getIDESelectionQuestion() {
  return {
    type: 'list',
    name: 'selectedIDEs',
    message: colors.primary(t('ideQuestion')) + colors.dim(`\n  (${t('ideHint')})`),
    choices: getIDEChoices(),
    filter: value => [value],
    pageSize: 10,
  };
}

module.exports = {
  selectIDEs,
  validateIDESelection,
  getIDESelectionQuestion,
};
