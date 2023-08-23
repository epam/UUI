const originalConfig = require('eslint-config-react-app/index');
const { setUnifiedSeverityToConfig } = require('../utils/rulesSeverityUtils');

const newConfig = setUnifiedSeverityToConfig({
    ...originalConfig,
    extends: require.resolve('./allBase.js'),
});

module.exports = newConfig;
