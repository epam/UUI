const { uuiRoot } = require('../utils/constants');
const path = require('path');

const stylelintCustomRules = path.resolve(uuiRoot, './uui-build/linting/stylelintCustomRules/index.js');

const SCSS_COMMON_RULES = {
    // start - migrated stylistic rules
    'scss/at-extend-no-missing-placeholder': null,
    'block-opening-brace-space-before': 'always',
    'declaration-bang-space-after': 'never',
    'declaration-bang-space-before': 'always',
    'declaration-block-semicolon-newline-after': 'always',
    'declaration-block-semicolon-space-before': 'never',
    'declaration-block-trailing-semicolon': 'always',
    'declaration-colon-space-after': 'always-single-line',
    'declaration-colon-space-before': 'never',
    'function-comma-space-after': 'always-single-line',
    'function-parentheses-space-inside': 'never',
    'media-feature-parentheses-space-inside': 'never',
    'no-missing-end-of-source-newline': null,
    'number-leading-zero': 'always',
    'number-no-trailing-zeros': true,
    'selector-list-comma-newline-after': null,
    'string-quotes': 'single',
    indentation: 4,
    'color-hex-case': 'upper',
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
            files: [
                '**/epam-assets/theme/theme_promo.scss',
                '**/epam-assets/theme/theme_electric.scss',
                '**/epam-assets/theme/theme_loveship.scss',
                '**/epam-assets/theme/theme_loveship_dark.scss',
            ],
            rules: {
                ...SCSS_COMMON_RULES,
                'uui-custom-rules/theme-tokens-validation': [
                    true,
                    {
                        ignoredUnknownVars: ['--font-inter', '--font-museo-sans', '--uui-btn-bg'],
                        ignoredRedeclaredVars: ['--uui-border-radius'],
                    },
                ],
            },
        },
    ],
};
