/**
 * This config was created using next approach:
 * 1) Use eslint-config-react-app as a basis
 * 2) Pick additional "non-stylistic" rules from "airbnb"
 * 3) Pick almost all "stylistic" rules from "airbnb"
 * 4) Add few UUI-specific "non-stylistic" rules
 * 5) Add few UUI-specific "stylistic" rules.
 *
 * Notes:
 * - Stylistic rules are those related to spacing, conventions, and generally anything that does not highlight an error or a better way to do something.
 * - eslint made all "stylistic" rules as frozen.
 *  (see details here: https://eslint.org/blog/2020/05/changes-to-rules-policies/#what-are-the-changes)
 * - eslint suggests to use another tool (e.g. Prettier) for all "stylistic" stuff.
 *  (see their readme https://github.com/eslint/eslint/blob/main/README.md)
 *
 *  Reason why we don't use Prettier at the moment:
 *  - No possibility to add JSX attr spaces as described here: https://github.com/prettier/prettier/issues/95
 */
const pickFromAirbnb = require('./utils/eslintRulesFromAirbnb.js');
const { turnOffEslintRulesToBeFixed } = require('./utils/rulesToBeFixed.js');

process.env.NODE_ENV = 'production'; // this line is required by "babel-preset-react-app".
module.exports = {
    env: {
        browser: true,
        es6: true,
        node: true,
    },
    reportUnusedDisableDirectives: true,
    extends: ['react-app'],
    rules: {
        ...uuiJsRules(),
        ...turnOffEslintRulesToBeFixed(),
    },
    overrides: [
        {
            files: ['**/*.ts?(x)'],
            rules: {
                ...uuiJsRules(),
                ...uuiTsRules(),
                ...uuiReactRules(),
                ...turnOffEslintRulesToBeFixed(),
                /**
                 * Temporarily turn off react-hooks/exhaustive-deps everywhere except for "app".
                 * In the future, we want to enable it globally. But it would require code changes in ~140 places where this rule is intentionally violated.
                 * The code change will be:
                 * 1) put dependencies which we expect never change to the "useRef()",
                 *    so that it's explicitly clear why this or that variable is not added to the array of dependencies.
                 * 2) in such case, the react-hooks/exhaustive-deps would not ask to include such variables into the list of dependencies.
                 *
                 * as soon as this is done, this rule can be enabled globally
                 */
                'react-hooks/exhaustive-deps': 0,
            },
        }, {
            files: ['**/__tests__/**/*', '**/*.{test}.ts?(x)'],
            extends: ['react-app/jest'],
            env: { 'jest/globals': true },
            rules: {
                'import/no-extraneous-dependencies': 0,
                /**
                 * Don't want to force usage of userEvent because it slows down the performance of tests (with user-event it's ~3 times slower).
                 * https://github.com/testing-library/user-event/issues/650
                 */
                'testing-library/prefer-user-event': 0,
                'testing-library/render-result-naming-convention': 0,
                'testing-library/no-node-access': 1,
                'testing-library/no-manual-cleanup': 2,
                'testing-library/prefer-explicit-assert': 2,
                ...turnOffEslintRulesToBeFixed(),
            },
        }, {
            files: ['./server/**/*.js', './uui-build/**/*.js'],
            env: {
                es6: true,
                node: true,
                commonjs: true,
            },
            parserOptions: { ecmaVersion: 2020 },
            rules: {
                ...uuiJsRules(),
                'import/no-unresolved': [
                    2, {
                        commonjs: true,
                        caseSensitive: true,
                    },
                ],
                'import/extensions': [
                    2, 'always', { ignorePackages: true },
                ],
                ...turnOffEslintRulesToBeFixed(),
            },
        },
    ],
    settings: {
        'import/parsers': {
            '@typescript-eslint/parser': [
                '.ts', '.tsx', '.d.ts',
            ],
        },
        'import/resolver': {
            node: {
                extensions: [
                    '.js', '.ts', '.tsx', '.d.ts', '.css', '.scss', '.svg',
                ],
            },
            alias: { map: [['@epam/test-utils', './test-utils/index.ts']] },
        },
        'import/extensions': [
            '.js', '.ts', '.tsx', '.d.ts',
        ],
        'import/external-module-folders': ['node_modules', 'node_modules/@types'],
    },
};

function uuiTsRules() {
    return {
        // non-stylistic - start
        ...pickFromAirbnb.typescript.nonStylistic,
        'no-unused-expressions': 0,
        '@typescript-eslint/no-unused-expressions': uuiJsRules()['no-unused-expressions'],
        // non-stylistic - end
        // stylistic - start
        ...pickFromAirbnb.typescript.stylistic,
        indent: 0,
        '@typescript-eslint/indent': uuiJsRules()['indent'],
        'comma-dangle': 0,
        '@typescript-eslint/comma-dangle': [
            2, {
                arrays: 'always-multiline',
                objects: 'always-multiline',
                imports: 'always-multiline',
                exports: 'always-multiline',
                functions: 'always-multiline',
                generics: 'ignore', // ts-specific
            },
        ],
        '@typescript-eslint/lines-between-class-members': uuiJsRules()['lines-between-class-members'],
        // stylistic - end
    };
}

function uuiJsRules() {
    return {
        // non-stylistic - start
        ...pickFromAirbnb.base.nonStylistic,
        'default-case': 0,
        'no-use-before-define': 0,
        'guard-for-in': 0, // we disallow for-in statement by another rule, so this rule not needed.
        'no-restricted-syntax': [
            2, {
                selector: 'ForInStatement',
                message:
                    'for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.',
            },
        ],
        /**
         * 'import/no-cycle' rule is extremely slow! (this single rule takes 70%+ of total time)
         * What we can do in case of performance issues:
         * - keep it turned off and enable only occasionally if necessary.
         * - change maxDepth to lower value and increase it if you need to see all circular deps.
         */
        'import/no-cycle': [1, { maxDepth: 4 }],
        'import/no-extraneous-dependencies': ['error', {}],
        'import/no-unresolved': [
            2, {
                ignore: [
                    '^@epam/uui-[\\w]+/styles.css$', '@epam/promo/styles.css', '@epam/loveship/styles.css',
                ],
            },
        ],
        'no-console': [1, { allow: ['error', 'warn'] }],
        'no-param-reassign': [1, { props: false }],
        radix: [1, 'as-needed'],
        'no-cond-assign': [2, 'except-parens'],
        'no-unused-expressions': [1, { allowShortCircuit: true }],
        eqeqeq: [2, 'smart'],
        'prefer-const': [
            1, {
                destructuring: 'any',
                ignoreReadBeforeAssign: true,
            },
        ],
        // non-stylistic- end
        // stylistic - start
        ...pickFromAirbnb.base.stylistic,
        'max-len': [
            2, {
                code: 170,
                ignoreUrls: true,
                ignoreComments: true,
                ignoreTemplateLiterals: true,
                ignoreRegExpLiterals: true,
                ignoreStrings: true,
            },
        ],
        'array-element-newline': [2, 'consistent'],
        'array-bracket-newline': [2, 'consistent'],
        indent: [
            2, 4, { SwitchCase: 1 },
        ],
        'comma-dangle': [
            2, {
                arrays: 'always-multiline',
                objects: 'always-multiline',
                imports: 'always-multiline',
                exports: 'always-multiline',
                functions: 'always-multiline',
            },
        ],
        'lines-between-class-members': ['error', 'always', { exceptAfterSingleLine: true }],
        // stylistic - end
    };
}

function uuiReactRules() {
    return {
        // non-stylistic - start
        ...pickFromAirbnb.react.nonStylistic,
        'react/no-unescaped-entities': [2, { forbid: ['>', '}'] }],
        'react/jsx-no-useless-fragment': 1,
        'react/function-component-definition': [
            2, {
                namedComponents: ['function-declaration', 'function-expression'],
                unnamedComponents: 'function-expression',
            },
        ],
        // non-stylistic - end
        // stylistic - start
        ...pickFromAirbnb.react.stylistic,
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
        'react/jsx-curly-spacing': [
            2, 'always', { allowMultiline: true },
        ],
        'react/jsx-indent': [2, 4],
        'react/jsx-indent-props': [2, 4],
        // stylistic - end
    };
}
