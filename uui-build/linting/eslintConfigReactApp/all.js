const cfg = require('eslint-config-react-app/index.js');
const { overrideSeverityInRulesMap } = require('../utils/rulesSeverityUtils.js');
const config = require('eslint-config-react-app/jest');

module.exports = {
    ...cfg,
    extends: require.resolve('./allBase.js'),
    overrides: config.overrides.map((o) => {
        return {
            ...o,
            rules: overrideSeverityInRulesMap(o.rules),
        };
    }),
    rules: overrideSeverityInRulesMap(cfg.rules),
};
