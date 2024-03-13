import { defineConfig, devices, PlaywrightTestOptions } from '@playwright/test';
import process from 'node:process';

type TDeviceCfg = Record<string, Partial<PlaywrightTestOptions>>;

const SHARED_DEVICE_CFG: TDeviceCfg = {
    DEFAULT: {
        locale: 'en-US',
        timezoneId: 'EET',

        /**
         * PlayWrite cannot take screenshot larger than 32767 pixels on any dimension.
         */
        viewport: { width: 576, height: 576 },
    },
};

const IS_LOCAL_PROD_BUILD = true; // Manually change this flag to 'true' to run the test using the local prod build
const IS_CI = !!process.env.CI;
const baseURL = (IS_CI || IS_LOCAL_PROD_BUILD) ? 'http://127.0.0.1:5000' : 'http://127.0.0.1:3000';
const startServerCmd = (IS_CI || IS_LOCAL_PROD_BUILD) ? 'yarn start-server' : 'yarn start';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
    timeout: 20000,
    testMatch: 'app/**/__e2e__/**/*.e2e.ts',
    fullyParallel: true,
    forbidOnly: IS_CI,
    retries: IS_CI ? 2 : 1,
    workers: IS_CI ? 1 : undefined,
    outputDir: '.reports/playwrite/results',
    snapshotPathTemplate: '{testFileDir}/__screenshots__/{testFileName}-{projectName}/{arg}{ext}',
    reporter: [
        ['html', { outputFolder: '.reports/playwrite/report', open: IS_CI ? 'never' : 'on-failure' }],
    ],
    use: {
        baseURL,
        trace: 'retry-with-trace',
        ...SHARED_DEVICE_CFG.DEFAULT,
    },
    projects: [
        /**
         * Playwright downloads Chromium, WebKit and Firefox browsers into the OS-specific cache folders:
         * %USERPROFILE%\AppData\Local\ms-playwright on Windows
         * ~/Library/Caches/ms-playwright on MacOS
         * ~/.cache/ms-playwright on Linux
         */
        {
            name: 'chromium',
            use: {
                ...devices['Desktop Chrome'],
                ...SHARED_DEVICE_CFG.DEFAULT,
                launchOptions: {
                    ignoreDefaultArgs: ['--hide-scrollbars'],
                },
            },
        },
        /*        {
            name: 'webkit',
            use: {
                ...devices['Desktop Safari'],
                ...SHARED_DEVICE_CFG.DEFAULT,
            },
        }, */
    ],
    /* Run server before starting the tests */
    webServer: {
        command: startServerCmd,
        url: baseURL,
        reuseExistingServer: true,
    },
    expect: {
        timeout: 50000,
        toHaveScreenshot: {
            animations: 'disabled',
            caret: 'hide',
        },
    },
});
