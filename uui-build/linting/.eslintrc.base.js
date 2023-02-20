/**
 * (TBD) Notes regarding "stylistic" rules (such as indents, etc.):
 * - https://typescript-eslint.io/linting/troubleshooting/formatting
 * - https://eslint.org/blog/2020/05/changes-to-rules-policies/#what-are-the-changes
 *
 */
process.env.NODE_ENV = 'production'; // this line is required by "babel-preset-react-app".
module.exports = {
    env: { browser: true, es6: true, node: true },
    plugins: ['prettier'],
    extends: ['react-app', 'prettier'],
    rules: {
        'prettier/prettier': 'error',
        ...uuiJsRules(),
        ...uuiTsRules(),
        ...uuiReactRules(),
    },
    overrides: [
        {
            files: ['**/__tests__/**/*', '**/*.{test}.ts?(x)'],
            extends: ['react-app/jest', 'prettier'],
            env: { 'jest/globals': true },
            rules: {
                'prettier/prettier': 'error',
                'testing-library/render-result-naming-convention': 0,
            },
        },
    ],
};

function uuiTsRules() {
    return {
        // err
        '@typescript-eslint/no-unused-expressions': [2, { allowShortCircuit: true }],
    };
}

function uuiJsRules() {
    return {
        // off
        'default-case': 0,
        'no-use-before-define': 0,
        // warn
        'guard-for-in': 1,
        'import/no-cycle': 1,
        'no-console': [1, { allow: ['warn', 'error'] }],
        'no-param-reassign': [1, { props: false }],
        'prefer-regex-literals': 1,
        // err
        'no-cond-assign': [2, 'except-parens'],
        'no-unused-expressions': [2, { allowShortCircuit: true }],
    };
}

function uuiReactRules() {
    return {
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
    };
}
