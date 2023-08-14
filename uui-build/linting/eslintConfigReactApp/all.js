const cfg = require('eslint-config-react-app/index.js');
const { overrideSeverityInRulesMap } = require('../utils/rulesSeverityUtils.js');

const newConfig = {
    ...cfg,
    extends: require.resolve('./allBase.js'),
    overrides: cfg.overrides.map((o) => {
        return {
            ...o,
            rules: overrideSeverityInRulesMap(o.rules),
        };
    }),
    rules: overrideSeverityInRulesMap(cfg.rules),
};

module.exports = newConfig;
