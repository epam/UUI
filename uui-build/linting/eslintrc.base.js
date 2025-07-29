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
const pickFromAirbnb = require('./eslintConfigAirBnb/all');
const { turnOffEslintRulesToBeFixed, shouldTurnOffRulesToBeFixed } = require('./utils/rulesToBeFixed');
const { isCI, isLintStaged, isLintScript } = require('../utils/envUtils');
const { getIgnoredPatterns } = require('./../../.eslintignore');
const { unifiedSeverity } = require('./utils/rulesSeverityUtils');

process.env.NODE_ENV = 'production'; // this line is required by "babel-preset-react-app".
module.exports = {
    env: {
        browser: true,
        es6: true,
        node: true,
    },
    ignorePatterns: getIgnoredPatterns({ isCI: isCI(), isLintStaged: isLintStaged(), isLintScript: isLintScript() }),
    // We need to remove such directives only if full set of rules is checked.
    reportUnusedDisableDirectives: !shouldTurnOffRulesToBeFixed,
    extends: require.resolve('./eslintConfigReactApp/all.js'),
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
                'react-hooks/exhaustive-deps': 'off',
            },
        },
        {
            files: ['**/__tests__/**/*', '**/*.{test}.ts?(x)'],
            extends: require.resolve('./eslintConfigReactApp/allJest.js'),
            env: { 'jest/globals': true },
            rules: {
                'import/no-extraneous-dependencies': 'off',
                'no-restricted-imports': ['error', {
                    paths: [
                        { name: 'react-test-renderer', message: 'Please use: import { renderer } from \'@epam/uui-test-utils\';' },
                        { name: '@testing-library/react', message: 'Please use: import { ... } from \'@epam/uui-test-utils\';' },
                        { name: '@testing-library/user-event', message: 'Please use: import { userEvent } from \'@epam/uui-test-utils\';' },
                    ],
                    patterns: [
                        { group: ['*.test'], message: 'It\'s not allowed to import "*.test.*" files to any other files.' },
                    ],
                }],
                /**
                 * Don't want to force usage of userEvent because it slows down the performance of tests (with user-event it's ~3 times slower).
                 * https://github.com/testing-library/user-event/issues/650
                 */
                'testing-library/prefer-user-event': 'off',
                'testing-library/render-result-naming-convention': 'off',
                'testing-library/no-node-access': unifiedSeverity,
                'testing-library/no-manual-cleanup': unifiedSeverity,
                'testing-library/prefer-explicit-assert': unifiedSeverity,
                ...turnOffEslintRulesToBeFixed(),
            },
        },
        {
            files: ['./server/**/*.ts', './uui-build/**/*.ts'],
            env: {
                node: true,
            },
            rules: {
                ...uuiJsRules(),
                ...uuiTsRules(),
                // 'import/no-unresolved': [
                //     unifiedSeverity, {
                //         commonjs: true,
                //         caseSensitive: true,
                //     },
                // ],
                'no-restricted-imports': 'off',
                'import/extensions': [
                    unifiedSeverity, 'never', { ignorePackages: true },
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
            alias: { map: [['@epam/uui-test-utils', './test-utils/index.ts']] },
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
        'no-unused-expressions': 'off',
        '@typescript-eslint/no-unused-expressions': uuiJsRules()['no-unused-expressions'],
        'no-shadow': 'off',
        '@typescript-eslint/no-shadow': uuiJsRules()['no-shadow'],
        // non-stylistic - end
        // stylistic - start
        ...pickFromAirbnb.typescript.stylistic,
        indent: 'off',
        '@typescript-eslint/indent': uuiJsRules()['indent'],
        'comma-dangle': 'off',
        '@typescript-eslint/comma-dangle': [
            unifiedSeverity, {
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
        'default-case': 'off',
        'no-use-before-define': 'off',
        'guard-for-in': 'off', // we disallow for-in statement by another rule, so this rule not needed.
        'no-restricted-syntax': [
            unifiedSeverity, {
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
        'import/no-cycle': [unifiedSeverity, { maxDepth: 4 }],
        'import/no-extraneous-dependencies': ['error', {}],
        'no-restricted-imports': ['error', {
            patterns: [
                { group: ['@epam/*/build/*', '@epam/*/build'], message: 'Import from "build" folder of UUI modules is not allowed.' },
                { group: ['dayjs', 'dayjs/plugin/*'], message: 'Direct import from "dayjs" module is not allowed. Please use a reusable wrapper instead (dayJsHelper.ts)' },
            ],
        }],
        'import/no-unresolved': [
            unifiedSeverity, {
                ignore: [
                    '^@epam/uui-[\\w]+/styles.css$', '@epam/promo/styles.css', '@epam/loveship/styles.css', '^uui-doc-pages/',
                ],
            },
        ],
        'no-console': [unifiedSeverity, { allow: ['error', 'warn'] }],
        'no-param-reassign': [unifiedSeverity, { props: false }],
        radix: [unifiedSeverity, 'as-needed'],
        'no-cond-assign': [unifiedSeverity, 'except-parens'],
        'no-unused-expressions': [unifiedSeverity, { allowShortCircuit: true }],
        eqeqeq: [unifiedSeverity, 'smart'],
        'prefer-const': [
            unifiedSeverity, {
                destructuring: 'any',
                ignoreReadBeforeAssign: true,
            },
        ],
        'no-shadow': [unifiedSeverity, { allow: ['props'] }],
        // non-stylistic- end
        // stylistic - start
        ...pickFromAirbnb.base.stylistic,
        'no-trailing-spaces': 'off',
        'max-len': [
            unifiedSeverity, {
                code: 170,
                ignoreUrls: true,
                ignoreComments: true,
                ignoreTemplateLiterals: true,
                ignoreRegExpLiterals: true,
                ignoreStrings: true,
            },
        ],
        'array-element-newline': [unifiedSeverity, 'consistent'],
        'array-bracket-newline': [unifiedSeverity, 'consistent'],
        indent: [
            unifiedSeverity, 4, { SwitchCase: 1 },
        ],
        'comma-dangle': [
            unifiedSeverity, {
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
        'react/no-unescaped-entities': [unifiedSeverity, { forbid: ['>', '}'] }],
        'react/jsx-no-useless-fragment': unifiedSeverity,
        'react/function-component-definition': [
            unifiedSeverity, {
                namedComponents: ['function-declaration', 'function-expression'],
                unnamedComponents: 'function-expression',
            },
        ],
        // non-stylistic - end
        // stylistic - start
        ...pickFromAirbnb.react.stylistic,
        'react/jsx-wrap-multilines': [
            unifiedSeverity, {
                condition: 'parens-new-line',
                logical: 'parens-new-line',
                arrow: 'parens-new-line',
                return: 'parens-new-line',
                assignment: 'parens-new-line',
                declaration: 'parens-new-line',
            },
        ],
        'react/jsx-curly-spacing': [
            unifiedSeverity, 'always', { allowMultiline: true },
        ],
        'react/jsx-indent': [unifiedSeverity, 4],
        'react/jsx-indent-props': [unifiedSeverity, 4],
        // stylistic - end
    };
}
