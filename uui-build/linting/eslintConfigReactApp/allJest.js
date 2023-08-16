const originalConfig = require('eslint-config-react-app/jest.js');
const { setUnifiedSeverityToConfig } = require('../utils/rulesSeverityUtils.js');

const newConfig = setUnifiedSeverityToConfig(originalConfig);

module.exports = newConfig;
