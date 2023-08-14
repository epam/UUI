const config = require('eslint-config-react-app/jest.js');
const { overrideSeverityInRulesMap } = require('../utils/rulesSeverityUtils.js');

const newConfig = {
    ...config,
    overrides: config.overrides.map((o) => {
        return {
            ...o,
            rules: overrideSeverityInRulesMap(o.rules),
        };
    }),
};

module.exports = newConfig;
