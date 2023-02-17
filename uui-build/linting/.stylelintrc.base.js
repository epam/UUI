const lessSyntax = require('postcss-less')
const { rules: sassGuidelinesRules } = require('stylelint-config-sass-guidelines');

const sassGuidelinesRulesSubsetForLess = Object.keys(sassGuidelinesRules)
    .filter(k => k.indexOf('scss/') !== 0)
    .reduce((acc, k) => {acc[k] = sassGuidelinesRules[k]; return acc;}, {});

const SCSS_AND_LESS_COMMON_RULES = {
    "indentation": 4,
    "declaration-empty-line-before": "never",
    "order/properties-alphabetical-order": null,
    "max-nesting-depth": null,
    "selector-list-comma-newline-after": null,
    "no-missing-end-of-source-newline": null,
    "color-named": null,
    "selector-max-compound-selectors": null,
    "shorthand-property-no-redundant-values":null,
    "color-hex-case": null,
    "color-hex-length": null,
    "property-no-vendor-prefix": null,
    "property-no-unknown": [
        true,
        {
            "ignoreProperties": ["composes"]
        }
    ],
    "selector-class-pattern": null,
    "selector-no-vendor-prefix": null,
    "value-no-vendor-prefix": null,
}

module.exports = {
    extends: "stylelint-config-sass-guidelines",
    plugins: ['stylelint-order'],
    overrides: [
        {
            files: ['**/*.scss'],
            "rules": {
                ...SCSS_AND_LESS_COMMON_RULES,
                "scss/at-mixin-pattern": null,
                "scss/at-import-partial-extension-blacklist": null,
                "scss/selector-no-redundant-nesting-selector": null,
                "scss/dollar-variable-pattern": null
            },
        },
        {
            files: ['**/*.less'],
            customSyntax: lessSyntax,
            extends: [],
            rules: {
                ...sassGuidelinesRulesSubsetForLess,
                ...SCSS_AND_LESS_COMMON_RULES,
            },
        },
    ],
}
