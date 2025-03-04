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
const { isCI, isLintStaged } = require('../../utils/envUtils');

// Only CI & pre-commit hooks should ignore these rules.
const shouldTurnOffRulesToBeFixed = Boolean(isCI() || isLintStaged());

/**
 * Please make sure that stylistic rules aren't included (especially ones related to spacing, etc.) because it may break formatting after autofix.
 * @type {string[]}
 */
const eslintRulesToBeFixed = [
    '@typescript-eslint/no-useless-constructor', 'array-callback-return', 'func-names', 'import/extensions', 'import/no-cycle', 'jest/no-identical-title', 'jsx-a11y/alt-text', 'jsx-a11y/click-events-have-key-events', 'jsx-a11y/mouse-events-have-key-events', 'jsx-a11y/no-noninteractive-element-interactions', 'jsx-a11y/no-noninteractive-tabindex', 'jsx-a11y/no-static-element-interactions', 'jsx-a11y/role-supports-aria-props', 'jsx-a11y/role-supports-aria-props', 'no-loop-func', 'no-nested-ternary', 'no-param-reassign', 'no-restricted-syntax', 'no-return-assign', 'no-throw-literal', 'no-unused-vars', 'no-useless-concat', 'no-useless-escape', 'prefer-const', 'prefer-promise-reject-errors', 'prefer-rest-params', 'radix', 'react-hooks/exhaustive-deps', 'react-hooks/rules-of-hooks', 'react/function-component-definition', 'react/jsx-no-useless-fragment', 'react/no-access-state-in-setstate', 'react/prefer-stateless-function',
];

function turnOffEslintRulesToBeFixed() {
    if (!shouldTurnOffRulesToBeFixed) {
        return {};
    }
    return eslintRulesToBeFixed.reduce((acc, n) => {
        acc[n] = 'off';
        return acc;
    }, {});
}

module.exports = {
    shouldTurnOffRulesToBeFixed,
    eslintRulesToBeFixed,
    turnOffEslintRulesToBeFixed,
};
