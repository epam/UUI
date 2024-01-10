const noUnknownThemeTokens = require('./rules/noUnknownThemeTokens');
const stylelint = require('stylelint');

const allRules = {
    [noUnknownThemeTokens.ruleName]: Promise.resolve(noUnknownThemeTokens),
};

const rulesPlugins = Object.keys(allRules).map((ruleName) => {
    return stylelint.createPlugin(ruleName, allRules[ruleName]);
});

module.exports = rulesPlugins;
