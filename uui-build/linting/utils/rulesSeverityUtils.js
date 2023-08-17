const { isLintStaged } = require('../../utils/envUtils');

const SEVERITY = {
    off: 'off',
    warn: 1,
    error: 2,
};
const unifiedSeverity = _getUnifiedSeverity();

module.exports = { unifiedSeverity, setUnifiedSeverityToConfig };

/// /

function setUnifiedSeverityToConfig(config) {
    const result = { ...config };
    if (result.rules) {
        result.rules = Object.keys(result.rules).reduce((acc, ruleName) => {
            const ruleConfig = result.rules[ruleName];
            if (_isRuleTurnedOff(ruleConfig)) {
                acc[ruleName] = ruleConfig;
            } else {
                acc[ruleName] = _setSeverity(ruleConfig, unifiedSeverity);
            }
            return acc;
        }, {});
    }
    if (result.overrides) {
        result.overrides = result.overrides.map((overrideConfig) => {
            return setUnifiedSeverityToConfig(overrideConfig);
        });
    }
    return result;
}

function _getUnifiedSeverity() {
    if (isLintStaged()) {
        // if it's run from the lint-staged task, warnings don't prevent commit, so we make them as errors.
        return SEVERITY.error;
    }
    return SEVERITY.warn;
}

function _isRuleTurnedOff(ruleConfig) {
    let s;
    if (Array.isArray(ruleConfig)) {
        s = ruleConfig[0];
    } else {
        s = ruleConfig;
    }
    return s === 'off' || s === 0;
}

function _setSeverity(ruleConfig, severity) {
    if (Array.isArray(ruleConfig)) {
        return [severity].concat(ruleConfig.slice(1));
    }
    if (typeof ruleConfig === 'number' || typeof ruleConfig === 'string') {
        return severity;
    }
    throw new Error('Unexpected rule config', ruleConfig);
}
