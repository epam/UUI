const { isLintStaged } = require('../../utils/envUtils.js');

const SEVERITY = {
    off: 'off',
    warn: isLintStaged ? 2 : 1, // if it's run from the lint-staged task, warnings don't prevent commit, so we make them as errors.
    error: isLintStaged ? 2 : 1,
};

function isRuleTurnedOff(ruleConfig) {
    let s;
    if (Array.isArray(ruleConfig)) {
        s = ruleConfig[0];
    } else {
        s = ruleConfig;
    }
    return s === 'off' || s === 0;
}

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
        const ruleConfig = rulesMap[ruleName];
        if (isRuleTurnedOff(ruleConfig)) {
            acc[ruleName] = ruleConfig;
        } else {
            acc[ruleName] = setSeverity(ruleConfig, SEVERITY.warn);
        }
        return acc;
    }, {});
}

module.exports = { SEVERITY, setSeverity, overrideSeverityInRulesMap };
