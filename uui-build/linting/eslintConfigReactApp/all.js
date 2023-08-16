const originalConfig = require('eslint-config-react-app/index.js');
const { setUnifiedSeverityToConfig } = require('../utils/rulesSeverityUtils.js');

const newConfig = setUnifiedSeverityToConfig({
    ...originalConfig,
    extends: require.resolve('./allBase.js'),
});

module.exports = newConfig;
