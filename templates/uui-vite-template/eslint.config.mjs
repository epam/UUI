import globals from 'globals';
import js from '@eslint/js'
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks'
import prettierRecommended from "eslint-plugin-prettier/recommended";
import vitestPlugin from 'eslint-plugin-vitest';
import testingLibrary from 'eslint-plugin-testing-library';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
    globalIgnores(['node_modules/**', 'dist/**']),
    {
        files: ['**/*.{ts,tsx}'],
        extends: [
            js.configs.recommended,
            tseslint.configs.recommended,
            reactHooks.configs['recommended-latest'],
            prettierRecommended
        ],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
        },
    },
    {
        files: ['**/*.test.ts', '**/*.test.tsx'],
        plugins: {
            'testing-library': testingLibrary,
            vitest: vitestPlugin,
        },
        languageOptions: {
            globals: {
                ...vitestPlugin.environments.env.globals,
            },
        },
        rules: {
            ...testingLibrary.configs.react.rules,
            ...vitestPlugin.configs.recommended.rules,
        },
    },
]);
