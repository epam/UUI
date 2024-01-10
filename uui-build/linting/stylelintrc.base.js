const { uuiRoot } = require('../utils/constants');
const path = require('path');

const stylelintCustomRules = path.resolve(uuiRoot, './uui-build/linting/stylelintCustomRules/index.js');

const SCSS_COMMON_RULES = {
    // start - migrated stylistic rules
    '@stylistic/block-opening-brace-space-before': 'always',
    '@stylistic/declaration-bang-space-after': 'never',
    '@stylistic/declaration-bang-space-before': 'always',
    '@stylistic/declaration-block-semicolon-newline-after': 'always',
    '@stylistic/declaration-block-semicolon-space-before': 'never',
    '@stylistic/declaration-block-trailing-semicolon': 'always',
    '@stylistic/declaration-colon-space-after': 'always-single-line',
    '@stylistic/declaration-colon-space-before': 'never',
    '@stylistic/function-comma-space-after': 'always-single-line',
    '@stylistic/function-parentheses-space-inside': 'never',
    '@stylistic/media-feature-parentheses-space-inside': 'never',
    '@stylistic/no-missing-end-of-source-newline': null,
    '@stylistic/number-leading-zero': 'always',
    '@stylistic/number-no-trailing-zeros': true,
    '@stylistic/selector-list-comma-newline-after': null,
    '@stylistic/string-quotes': 'single',
    // end - migrated stylistic rules
    'order/properties-alphabetical-order': null,
    'max-nesting-depth': null,
    'color-named': null,
    'selector-max-compound-selectors': null,
    'shorthand-property-no-redundant-values': null,
    'color-hex-length': null,
    'selector-class-pattern': null,
    'selector-no-vendor-prefix': null,
    'property-no-vendor-prefix': null,
    'selector-no-qualifying-type': null,
    //
    'declaration-empty-line-before': 'never',
    'property-no-unknown': [true, { ignoreProperties: ['composes'] }],
    'declaration-property-value-disallowed-list': [
        {
            border: ['none'],
            'border-top': ['none'],
            'border-right': ['none'],
            'border-bottom': ['none'],
            'border-left': ['none'],
        }, { message: 'E.g.: border: none can be replaced by "border: 0 none;"' },
    ],
    '@stylistic/indentation': 4,
    '@stylistic/color-hex-case': 'upper',
    'unit-no-unknown': true,
    'media-feature-name-no-unknown': true,
    'color-no-invalid-hex': true,
    'declaration-block-no-duplicate-properties': [
        true, {
            ignore: ['consecutive-duplicates-with-different-values'],
        },
    ],
    'no-empty-source': true,
    'order/order': [
        [
            'dollar-variables',
            'custom-properties',
            {
                type: 'at-rule',
                name: 'extend',
            },
            'declarations',
            'rules',
        ],
    ],
    'scss/at-mixin-pattern': null,
    'scss/at-import-partial-extension-blacklist': null,
    'scss/selector-no-redundant-nesting-selector': null,
    'scss/dollar-variable-pattern': null,
    'scss/no-global-function-names': null,
};

module.exports = {
    reportInvalidScopeDisables: true,
    reportNeedlessDisables: true,
    plugins: [
        'stylelint-order',
        // this plugin contains stylistic rules which were removed from the list of built-in stylelint (version 15 and newer) rules.
        '@stylistic/stylelint-plugin',
        'stylelint-value-no-unknown-custom-properties',
        stylelintCustomRules,
    ],
    overrides: [
        {
            extends: ['stylelint-config-sass-guidelines'],
            files: ['**/*.scss'],
            rules: {
                ...SCSS_COMMON_RULES,
            },
        },
        {
            extends: ['stylelint-config-sass-guidelines'],
            files: ['**/epam-assets/theme/*.scss'],
            rules: {
                ...SCSS_COMMON_RULES,
                'uui-custom-rules/no-unknown-theme-tokens': [
                    true,
                    { ignored: ['--font-inter', '--font-museo-sans', '--uui-btn-bg'] }, // It's temporarily ignored
                ],
            },
        },
    ],
};
