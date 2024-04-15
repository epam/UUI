import type { Config } from 'jest';
import nextJest from 'next/jest';

// defaults: https://nextjs.org/docs/pages/building-your-application/testing/jest
const createJestConfig = nextJest({
    // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
    dir: './',
});

// Add any custom config to be passed to Jest
const config: Config = {
    coverageProvider: 'v8',
    testEnvironment: 'jest-environment-jsdom',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
    testMatch: ['**/test/**/*.test.{ts,tsx}'],
    moduleNameMapper: {
        // overriding the key which is defined here: "next/dist/build/jest/jest.js"
        '^.+\\.(svg)$': '<rootDir>/test/__mock__/svgrMock.js',
    },
};
// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config);
