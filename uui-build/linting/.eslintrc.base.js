/**
 * (TBD) Notes regarding "stylistic" rules (such as indents, etc.):
 * - https://typescript-eslint.io/linting/troubleshooting/formatting
 * - https://eslint.org/blog/2020/05/changes-to-rules-policies/#what-are-the-changes
 *
 */
module.exports = {
    env: { browser: true, es6: true, node: true },
    extends: ['airbnb/base'],
    rules: { ...sharedJsRules() },
    overrides: [
        {
            files: ['**/__tests__/**/*', '**/*.{test}.ts?(x)'],
            extends: ['react-app/jest'],
            env: { 'jest/globals': true },
            rules: { 'testing-library/render-result-naming-convention': 0 },
        }, {
            files: ['**/*.ts?(x)'],
            extends: ['airbnb', 'airbnb/hooks', 'airbnb-typescript'],
            rules: {
                ...sharedJsRules(),
                ...sharedReactRules(),
                ...sharedTsRules(),
            },
        }, {
            files: ['./server/**/*.js', './uui-build/**/*.js'],
            env: { node: true, commonjs: true },
            parserOptions: { ecmaVersion: 2020 },
            extends: ['airbnb/base'],
            rules: { ...sharedJsRules() },
        },
    ],
};

function sharedTsRules() {
    return {
        // off
        indent: 0, // it's not TS rule, but we need to explicitly turn it off to avoid conflict with TS indents.
        '@typescript-eslint/dot-notation': 0,
        '@typescript-eslint/no-implied-eval': 0,
        '@typescript-eslint/no-throw-literal': 0,
        '@typescript-eslint/return-await': 0,
        '@typescript-eslint/no-use-before-define': 0,
        '@typescript-eslint/naming-convention': 0,
        '@typescript-eslint/func-call-spacing': 0,
        // err
        '@typescript-eslint/indent': [2, 4],
        '@typescript-eslint/no-unused-expressions': [2, { allowShortCircuit: true }],
        '@typescript-eslint/quotes': [2, 'single'], // most places use single-quotes (18k vs 7k errors)
    };
}

function sharedJsRules() {
    return {
        // off
        'arrow-body-style': 0,
        'arrow-parens': 0,
        'class-methods-use-this': 0,
        'consistent-return': 0,
        'default-case': 0,
        'global-require': 0,
        'import/extensions': 0,
        'import/no-extraneous-dependencies': 0,
        'import/no-mutable-exports': 0,
        'import/order': 0,
        'import/prefer-default-export': 0,
        'max-classes-per-file': 0,
        'no-continue': 0,
        'no-plusplus': 0,
        'no-underscore-dangle': 0,
        'no-use-before-define': 0,
        'prefer-destructuring': 0,
        'vars-on-top': 0,
        camelcase: 0,
        // warn
        'guard-for-in': 1,
        'import/no-cycle': 1,
        'no-console': [1, { allow: ['warn', 'error'] }],
        'no-param-reassign': [1, { props: false }],
        'prefer-regex-literals': 1,
        // err
        'max-len': [
            2, {
                code: 170, ignoreUrls: true, ignoreComments: true, ignoreTemplateLiterals: true,
            },
        ],
        'no-cond-assign': [2, 'except-parens'],
        'no-unused-expressions': [2, { allowShortCircuit: true }],
        'object-curly-newline': [2, { multiline: true, minProperties: 4 }],
        'array-bracket-newline': [2, { multiline: true, minItems: 4 }],
        'object-property-newline': [2, { allowAllPropertiesOnSameLine: true }],
        'array-element-newline': [2, { minItems: 4 }],
        indent: [2, 4, { SwitchCase: 1 }],
    };
}

function sharedReactRules() {
    return {
        // off
        'jsx-a11y/control-has-associated-label': 0,
        'jsx-a11y/no-autofocus': 0,
        'react/destructuring-assignment': 0,
        'react/function-component-definition': 0,
        'react/jsx-boolean-value': 0,
        'react/jsx-props-no-spreading': 0, // TBD: I would rather not disable this rule, but it's violated in many places.
        'react/no-children-prop': 0,
        'react/no-danger': 0,
        'react/no-unused-class-component-methods': 0,
        'react/no-unused-prop-types': 0,
        'react/no-unused-state': 0,
        'react/require-default-props': 0,
        'react/sort-comp': 0,
        'react/state-in-constructor': 0,
        'react/static-property-placement': 0,
        // warn
        'jsx-a11y/click-events-have-key-events': 1,
        'jsx-a11y/iframe-has-title': 1,
        'jsx-a11y/img-redundant-alt': 1,
        'jsx-a11y/mouse-events-have-key-events': 1,
        'jsx-a11y/no-static-element-interactions': 1,
        'react-hooks/exhaustive-deps': 1,
        'react/forbid-prop-types': 1,
        'react/no-array-index-key': 1,
        'react/no-find-dom-node': 1,
        'react/prefer-stateless-function': 1,
        radix: [1, 'as-needed'],
        // err
        'react/jsx-wrap-multilines': [
            2, {
                condition: 'parens-new-line',
                logical: 'parens-new-line',
                arrow: 'parens-new-line',
                return: 'parens-new-line',
                assignment: 'parens-new-line',
                declaration: 'parens-new-line',
            },
        ],
        'jsx-quotes': [2, 'prefer-double'], // amount of errors double vs single is equal (4k).
        'react/jsx-curly-spacing': [2, { when: 'always' }],
        'react/jsx-indent': [2, 4],
        'react/jsx-indent-props': [2, 4],
    };
}
