module.exports = {
    "collectCoverageFrom": [
        "**/*.{ts,tsx}",
        "!src/**/*.d.ts",
        "!**/*.doc*",
        "!./app/**/*",
        "!./infrastructure/**/*"
    ],
    coverageReporters: ["html"],
    "resolver": "jest-pnp-resolver",
    "setupFiles": [
        "react-app-polyfill/jsdom",
    ],
    "setupFilesAfterEnv": ["./setupTests.js"],
    "testMatch": [
      '<rootDir>/**/*.{spec,test}.{js,jsx,ts,tsx}',
    ],
    "testEnvironment": "jsdom",
    "testURL": "http://localhost",
    "transform": {
        "^.+\\.(js|jsx|ts|tsx)$": "<rootDir>/node_modules/babel-jest",
        "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/uui-build/config/jest/fileTransform.js",
        "^.+\\.css$": "<rootDir>/uui-build/config/jest/cssTransform.js",
    },
    "transformIgnorePatterns": [
        "[/\\\\]node_modules[/\\\\].+\\.(js|jsx|ts|tsx)$",
        "^.+\\.(sass|scss|less)$"
    ],
    "testPathIgnorePatterns": [
        "node_modules"
    ],
    "modulePathIgnorePatterns": [
        "/build/"
    ],
    "moduleNameMapper": {
        "^react-native$": "react-native-web",
        "^.+\\.(sass|scss|less)$": "<rootDir>/uui-build/config/jest/cssModuleTransform.js",
    },
    "moduleFileExtensions": [
        "web.js",
        "js",
        "web.ts",
        "ts",
        "web.tsx",
        "tsx",
        "json",
        "web.jsx",
        "jsx",
        "node"
    ]
}