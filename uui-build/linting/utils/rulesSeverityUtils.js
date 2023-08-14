const { isLintStaged } = require('../../utils/envUtils.js');

const SEVERITY = {
    off: 'off',
    warn: 2, // during lint staged warnings don't prevent from commit, so we make them as errors.
    error: 2,
};

function setSeverity(ruleConfig, severity) {
    if (Array.isArray(ruleConfig)) {
        ruleConfig[0] = severity;
        return ruleConfig;
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
