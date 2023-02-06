/**
 * This file contains a public api exported from "uui-build".
 */
const { createRollupConfigForModule } = require('../rollup/rollup.config.js');
const { buildModuleUsingRollup } = require('../utils/moduleBuildUtils.js');

module.exports = { createRollupConfigForModule, buildModuleUsingRollup }
