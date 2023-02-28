/**
 * Rules specified in this array will be turned off:
 * - in CI
 * - in DEV server
 * But still will be checked in all other cases (e.g. in IDE, local "yarn eslint", local "yarn stylelint", etc.)
 *
 * This approach has next advantages:
 * - we can fix all eslint errors iteratively one by one.
 * - the developers won't be overwhelmed by too many errors which cannot be easily fixed.
 *
 * Note: a rule must be removed from this array as soon as all errors/warnings related to this rule are fixed.
 */
const { isCI, isDevServer } = require('../utils/envUtils.js');

// Only CI & DEV server should disable it.
const shouldTurnOffRulesToBeFixed = isCI() || isDevServer();

const eslintRulesToBeFixed = [
    '@typescript-eslint/indent',
    '@typescript-eslint/no-redeclare',
    '@typescript-eslint/no-shadow',
    '@typescript-eslint/no-unused-expressions',
    '@typescript-eslint/no-unused-vars',
    '@typescript-eslint/no-useless-constructor',
    'array-callback-return',
    'block-scoped-var',
    'eqeqeq',
    'func-names',
    'import/export',
    'import/extensions',
    'import/no-anonymous-default-export',
    'import/no-cycle',
    'import/no-unresolved',
    'jest/no-conditional-expect',
    'jest/no-identical-title',
    'jest/valid-expect',
    'jsx-a11y/alt-text',
    'jsx-a11y/anchor-is-valid',
    'jsx-a11y/click-events-have-key-events',
    'jsx-a11y/iframe-has-title',
    'jsx-a11y/img-redundant-alt',
    'jsx-a11y/mouse-events-have-key-events',
    'jsx-a11y/no-noninteractive-element-interactions',
    'jsx-a11y/no-noninteractive-tabindex',
    'jsx-a11y/no-static-element-interactions',
    'jsx-a11y/role-supports-aria-props',
    'max-len',
    'no-console',
    'no-empty-pattern',
    'no-global-assign',
    'no-loop-func',
    'no-mixed-operators',
    'no-mixed-spaces-and-tabs',
    'no-multi-assign',
    'no-nested-ternary',
    'no-param-reassign',
    'no-promise-executor-return',
    'no-redeclare',
    'no-restricted-globals',
    'no-restricted-syntax',
    'no-return-assign',
    'no-shadow',
    'no-tabs',
    'no-throw-literal',
    'no-undef',
    'no-unused-expressions',
    'no-unused-vars',
    'no-useless-concat',
    'no-useless-escape',
    'no-var',
    'prefer-const',
    'prefer-promise-reject-errors',
    'prefer-rest-params',
    'radix',
    'react-hooks/exhaustive-deps',
    'react-hooks/rules-of-hooks',
    'react/function-component-definition',
    'react/jsx-closing-tag-location',
    'react/jsx-indent',
    'react/jsx-no-bind',
    'react/jsx-no-useless-fragment',
    'react/jsx-props-no-multi-spaces',
    'react/no-access-state-in-setstate',
    'react/no-find-dom-node',
    'react/prefer-stateless-function',
    'testing-library/no-unnecessary-act',
];

const stylelintRulesToBeFixed = ['declaration-property-value-disallowed-list', 'block-no-empty'];

function turnOffEslintRulesToBeFixed() {
    if (!shouldTurnOffRulesToBeFixed) {
        return {};
    }
    return eslintRulesToBeFixed.reduce((acc, n) => {
        acc[n] = 'off';
        return acc;
    }, {});
}

function turnOffStylelintRulesToBeFixed() {
    if (!shouldTurnOffRulesToBeFixed) {
        return {};
    }
    return stylelintRulesToBeFixed.reduce((acc, n) => {
        acc[n] = null;
        return acc;
    }, {});
}

module.exports = {
    eslintRulesToBeFixed,
    stylelintRulesToBeFixed,
    turnOffEslintRulesToBeFixed,
    turnOffStylelintRulesToBeFixed,
};
