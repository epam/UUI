// eslint-disable-next-line import/no-extraneous-dependencies
import { defineConfig, devices, PlaywrightTestOptions } from '@playwright/test';

type TDeviceCfg = Record<string, Partial<PlaywrightTestOptions>>;

const SHARED_DEVICE_CFG: TDeviceCfg = {
    DEFAULT: {
        locale: 'en-US',
        timezoneId: 'EET',
        viewport: { width: 1440, height: 720 },
    },
};
const IS_CI = !!process.env.CI;
const LOCAL_SERVER_ORIGIN = 'http://127.0.0.1:5000';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
    testMatch: 'app/**/__e2e__/**/*.e2e.ts?(x)',
    fullyParallel: true,
    forbidOnly: IS_CI,
    retries: IS_CI ? 2 : 0,
    workers: IS_CI ? 1 : undefined,
    outputDir: '.reports/playwrite/results',
    snapshotPathTemplate: '{testFileDir}/__screenshots__/{testFileName}-{projectName}/{arg}{ext}',
    reporter: [
        ['html', { outputFolder: '.reports/playwrite/report', open: IS_CI ? 'never' : 'on-failure' }],
    ],
    use: {
        baseURL: LOCAL_SERVER_ORIGIN,
        trace: 'on-first-retry',
        ...SHARED_DEVICE_CFG.DEFAULT,
    },
    projects: [
        {
            name: 'chromium',
            use: {
                ...devices['Desktop Chrome'],
            },
        },
    ],
    /* Run server before starting the tests */
    webServer: {
        command: 'yarn start-server',
        url: LOCAL_SERVER_ORIGIN,
        reuseExistingServer: !IS_CI,
    },
    expect: {
        toHaveScreenshot: {
            animations: 'disabled',
            caret: 'hide',
        },
    },
});
