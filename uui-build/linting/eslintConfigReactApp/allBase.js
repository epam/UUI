const originalConfig = require('eslint-config-react-app/base');
const { setUnifiedSeverityToConfig } = require('../utils/rulesSeverityUtils');

const newConfig = setUnifiedSeverityToConfig(originalConfig);

module.exports = newConfig;
