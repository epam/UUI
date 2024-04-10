const { turnOffEslintRulesToBeFixed } = require('../uui-build/linting/utils/rulesToBeFixed.js');
const { unifiedSeverity } = require('../uui-build/linting/utils/rulesSeverityUtils.js');

module.exports = {
    extends: require.resolve('../.eslintrc.js'),
    rules: {
        // in the future, this rule will be enabled globally (not only in "app")
        'react-hooks/exhaustive-deps': unifiedSeverity,
        'tree-shaking/no-side-effects-in-initialization': 'off',
        ...turnOffEslintRulesToBeFixed(),
    },
};
