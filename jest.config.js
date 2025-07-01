const BASE_CONFIG = {
    testPathIgnorePatterns: ['node_modules'],
    modulePathIgnorePatterns: ['/build/'],
    moduleFileExtensions: [
        'js', 'ts', 'tsx', 'json',
    ],
    moduleNameMapper: {
        '@epam/uui-test-utils': '<rootDir>/test-utils',
    },
    transform: {
        '^.+\\.(js|ts|tsx)$': ['<rootDir>/node_modules/babel-jest'],
    },
};

const JSDOM_ENV_CONFIG = {
    ...BASE_CONFIG,
    testEnvironment: 'jsdom',
    setupFiles: ['<rootDir>/node_modules/react-app-polyfill/jsdom'],
    setupFilesAfterEnv: ['<rootDir>/uui-build/jest/setupJsDom.js'],
    testMatch: ['<rootDir>/**/__tests__/**/*.test.{js,ts,tsx}'],
    testURL: 'http://localhost',
    transform: {
        ...BASE_CONFIG.transform,
        '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/uui-build/jest/fileTransform.js',
        '^.+\\.css$': '<rootDir>/uui-build/jest/cssTransform.js',
    },
    transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(js|jsx|ts|tsx)$', '^.+\\.(sass|scss|less)$'],
    moduleNameMapper: {
        ...BASE_CONFIG.moduleNameMapper,
        '^.+\\.(sass|scss|less)$': '<rootDir>/uui-build/jest/cssModuleTransform.js',
        '^.+\\.svg$': '<rootDir>/uui-build/jest/svgrMock.js',
    },
};

const NODE_ENV_CONFIG = {
    ...BASE_CONFIG,
    testEnvironment: 'node',
    testMatch: ['<rootDir>/**/__tests__/**/*.test.{js,ts}'],
};

const JSDOM_TESTS_ROOTS = [
    'uui-core',
    'uui-components',
    'uui',
    'epam-promo',
    'epam-electric',
    'loveship',
    'uui-editor',
    // TODO: uncomment line(s) below as soon as we have any tests in these modules
    // 'extra',
    // 'uui-db',
    // 'app',
    // 'uui-docs',
    // 'uui-timeline',
];

const COLLECT_COVERAGE_FROM_PACKAGES = [
    'uui-core',
    'uui-components',
    'uui',
    'epam-promo',
    'epam-electric',
    'loveship',
];

const NODEJS_TESTS_ROOTS = [
    // TODO: uncomment line(s) below as soon as we have any tests in these modules
    'uui-build',
    'server',
];

const argv = process.argv.slice(2);
const createHtmlReport = argv.indexOf('--collectCoverage') !== -1;

const reporters = createHtmlReport ? [
    'default', [
        'jest-html-reporter', {
            pageTitle: 'UUI Unit Tests Results',
            outputPath: '.reports/unit-tests/results.html',
            executionTimeWarningThreshold: 3,
            dateFormat: 'yyyy-mm-dd HH:MM:ss',
            sort: 'status',
            includeFailureMsg: true,
            includeSuiteFailure: true,
        },
    ],
] : undefined;

/**
 * @type {import('@jest/types').Config.GlobalConfig}
 */
module.exports = {
    coverageDirectory: '<rootDir>/.reports/unit-tests/coverage',
    coverageReporters: ['html-spa'],
    collectCoverageFrom: [
        ...COLLECT_COVERAGE_FROM_PACKAGES.map((dir) => `${dir}/**/*.{js,ts,tsx}`), ...NODEJS_TESTS_ROOTS.map((dir) => `${dir}/**/*.{js,ts}`), '!**/__tests__/**', '!**/node_modules/**', '!**/build/**',
    ],
    reporters,
    projects: [
        {
            displayName: 'jsdom',
            roots: [...JSDOM_TESTS_ROOTS],
            ...JSDOM_ENV_CONFIG,
        }, ...(NODEJS_TESTS_ROOTS.length > 0 ? [
            {
                displayName: 'nodejs',
                roots: [...NODEJS_TESTS_ROOTS],
                ...NODE_ENV_CONFIG,
            },
        ] : []),
    ],
};
