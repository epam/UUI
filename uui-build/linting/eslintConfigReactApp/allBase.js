const cfg = require('eslint-config-react-app/base.js');
const { overrideSeverityInRulesMap } = require('../utils/rulesSeverityUtils.js');

module.exports = {
    ...cfg,
    rules: overrideSeverityInRulesMap(cfg.rules),
};
