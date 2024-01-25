const themeTokensValidation = require('./rules/themeTokensValidation');
const stylelint = require('stylelint');

const allRules = {
    [themeTokensValidation.ruleName]: themeTokensValidation,
};

const rulesPlugins = Object.keys(allRules).map((ruleName) => {
    return stylelint.createPlugin(ruleName, allRules[ruleName]);
});

module.exports = rulesPlugins;
