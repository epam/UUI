const { turnOffEslintRulesToBeFixed } = require('../uui-build/linting/utils/rulesToBeFixed.js');
const { SEVERITY } = require('../uui-build/linting/utils/rulesSeverityUtils.js');

module.exports = {
    extends: require.resolve('../.eslintrc.js'),
    rules: {
        // in the future, this rule will be enabled globally (not only in "app")
        'react-hooks/exhaustive-deps': SEVERITY.warn,
        ...turnOffEslintRulesToBeFixed(),
    },
};
