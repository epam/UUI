const { turnOffStylelintRulesToBeFixed } = require('./utils/rulesToBeFixed.js');

const SCSS_AND_LESS_COMMON_RULES = {
    'order/properties-alphabetical-order': null,
    'max-nesting-depth': null,
    'selector-list-comma-newline-after': null,
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
    indentation: 4,
    'color-hex-case': 'upper',
    'unit-no-unknown': true,
    'media-feature-name-no-unknown': true,
    'color-no-invalid-hex': true,
    'declaration-block-no-duplicate-properties': [
        true, {
            ignore: ['consecutive-duplicates-with-different-values'],
        },
    ],
    ...turnOffStylelintRulesToBeFixed(),
};

module.exports = {
    reportInvalidScopeDisables: true,
    reportNeedlessDisables: true,
    plugins: ['stylelint-order'],
    overrides: [
        {
            extends: ['stylelint-config-sass-guidelines'],
            files: ['**/*.scss'],
            rules: {
                ...SCSS_AND_LESS_COMMON_RULES,
                'scss/at-mixin-pattern': null,
                'scss/at-import-partial-extension-blacklist': null,
                'scss/selector-no-redundant-nesting-selector': null,
                'scss/dollar-variable-pattern': null,
            },
        },
    ],
};
