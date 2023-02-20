/**
 * (TBD) Notes regarding "stylistic" rules (such as indents, etc.):
 * - https://typescript-eslint.io/linting/troubleshooting/formatting
 * - https://eslint.org/blog/2020/05/changes-to-rules-policies/#what-are-the-changes
 *
 */
process.env.NODE_ENV = 'production'; // this line is required by "babel-preset-react-app".
module.exports = {
    env: { browser: true, es6: true, node: true },
    extends: ['react-app'],
    rules: {
        ...sharedJsRules(),
        ...sharedTsRules(),
        ...sharedReactRules(),

    },
    overrides: [
        {
            files: ['**/__tests__/**/*', '**/*.{test}.ts?(x)'],
            extends: ['react-app/jest'],
            env: { 'jest/globals': true },
            rules: { 'testing-library/render-result-naming-convention': 0 },
        }
    ],
};

function sharedTsRules() {
    return {
        // off
        // err
        '@typescript-eslint/indent': [2, 4],
        '@typescript-eslint/no-unused-expressions': [2, { allowShortCircuit: true }],
        '@typescript-eslint/quotes': [2, 'single'], // most places use single-quotes (18k vs 7k errors)
    };
}

function sharedJsRules() {
    return {
        // off
        'default-case': 0, // exists in cra
        'no-use-before-define': 0, // exists in cra only for js
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
        'no-cond-assign': [2, 'except-parens'], // exists in cra, but as warn
        'no-unused-expressions': [2, { allowShortCircuit: true }], // exists in cra
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
        // warn
        'jsx-a11y/click-events-have-key-events': 1,
        'jsx-a11y/iframe-has-title': 1, // exists in cra
        'jsx-a11y/img-redundant-alt': 1, // exists in cra
        'jsx-a11y/mouse-events-have-key-events': 1,
        'jsx-a11y/no-static-element-interactions': 1,
        'react-hooks/exhaustive-deps': 1, // exists in cra
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
