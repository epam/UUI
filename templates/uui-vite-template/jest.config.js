module.exports = {
    // https://jestjs.io/docs/configuration#testenvironment-string
    testEnvironment: 'jsdom',
    // https://jestjs.io/docs/configuration#roots-arraystring
    roots: ['<rootDir>/src/'],
    // https://jestjs.io/docs/configuration#testmatch-arraystring
    testMatch: ['**/*.test.ts?(x)'],
    // https://jestjs.io/docs/configuration#transform-objectstring-pathtotransformer--pathtotransformer-object
    transform: {
        '^.+\\.tsx?$': 'ts-jest', // Transform TypeScript files using ts-jest
    },
    // https://jestjs.io/docs/configuration#setupfilesafterenv-array
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
    // Important: order matters, specific rules should be defined first
    // https://jestjs.io/fr/docs/configuration#modulenamemapper-objectstring-string--arraystring
    moduleNameMapper: {
        // https://jestjs.io/docs/webpack#mocking-css-modules
        '^.+\\.(css|scss)$': 'identity-obj-proxy',
        // https://jestjs.io/docs/webpack#handling-static-assets
        '^.+\\.(jpg|jpeg|png|gif|webp|avif|svg|ttf|woff|woff2)$': `<rootDir>/__mocks__/fileMock.js`,
    },
};
