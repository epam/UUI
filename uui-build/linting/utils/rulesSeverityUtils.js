const { isLintStaged } = require('../../utils/envUtils.js');

const SEVERITY = {
    off: 'off',
    warn: isLintStaged ? 2 : 1, // if it's run from the lint-staged task, warnings don't prevent commit, so we make them as errors.
    error: isLintStaged ? 2 : 1,
};

function setSeverity(ruleConfig, severity) {
    if (Array.isArray(ruleConfig)) {
        return [severity].concat(ruleConfig.slice(1));
    }
    if (typeof ruleConfig === 'number' || typeof ruleConfig === 'string') {
        return severity;
    }
    throw new Error('Unexpected rule config', ruleConfig);
}

function overrideSeverityInRulesMap(rulesMap) {
    return Object.keys(rulesMap).reduce((acc, ruleName) => {
        acc[ruleName] = setSeverity(rulesMap[ruleName], SEVERITY.warn);
        return acc;
    }, {});
}

module.exports = { SEVERITY, setSeverity, overrideSeverityInRulesMap };
