const vitest = require('eslint-plugin-vitest');

module.exports = {
    root: true,
    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        'plugin:prettier/recommended',
        'plugin:react/jsx-runtime',
    ],
    env: {
        es6: true,
        browser: true,
        node: true,
    },
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module',
    },
    settings: {
        react: {
            version: 'detect',
        },
        'import/parsers': {
            '@typescript-eslint/parser': ['.ts', '.tsx'],
        },
        'import/resolver': {
            node: {
                extensions: [
                    '.js',
                    '.ts',
                    '.tsx',
                    '.d.ts',
                    '.css',
                    '.scss',
                    '.svg',
                ],
            },
        },
    },
    overrides: [
        {
            files: ['./src/**/*.test.ts?(x)'],
            extends: [
                'plugin:testing-library/react',
                'plugin:vitest/recommended',
            ],
            globals: {
                ...vitest.environments.env.globals,
            },
        },
    ],
};
