import { defineConfig, devices, type TraceMode } from '@playwright/test';
import { SHARED_DEVICE_CFG } from './src/constants';
import { readEnvParams } from './scripts/cliUtils';
import { readEnvFile } from './scripts/envFileUtils';
import path from 'node:path';

const { isCi, isDocker } = readEnvParams();
const { UUI_APP_BASE_URL } = readEnvFile();

const timeout = isCi ? 20000 : 50000;
const maxFailures = isCi ? 10 : 20;
const retries = isCi ? 1 : 0;
const workers = isCi ? 1 : undefined;
const forbidOnly = isCi;
const trace = (isCi ? 'retry-with-trace' : 'retain-on-failure') as TraceMode;
const server = {
    startCmd: isCi ? 'yarn start-server' : undefined,
    baseUrl: UUI_APP_BASE_URL,
};
//
const parentDir = '';
export const screenshotsDirAbsPath = path.resolve(process.cwd(), 'tests/__screenshots__');
const testMatch = `${parentDir}tests/*.e2e.ts`;
const outputDir = `${parentDir}tests/.report/results`;
const outputFolder = `${parentDir}tests/.report/report`;
const snapshotPathTemplate = '{testFileDir}/__screenshots__/{platform}/{projectName}/{arg}{ext}';
export const stylePath = `${parentDir}src/fixtures/screenshot.css`;

export default defineConfig({
    timeout,
    maxFailures,
    testMatch,
    fullyParallel: true,
    forbidOnly,
    retries,
    workers,
    outputDir,
    snapshotPathTemplate,
    reporter: [['html', { outputFolder, open: (isDocker || isCi) ? 'never' : 'on-failure' }]],
    use: {
        baseURL: server.baseUrl,
        trace,
        ...SHARED_DEVICE_CFG.DEFAULT,
    },
    projects: [
        {
            name: 'chromium',
            use: {
                ...devices['Desktop Chrome'],
            },
        },
        {
            name: 'webkit',
            use: {
                ...devices['Desktop Safari'],
            },
        },
    ],
    webServer: server.startCmd ? {
        command: server.startCmd,
        url: server.baseUrl,
        reuseExistingServer: true,
    } : undefined,
    expect: {
        toHaveScreenshot: {
            animations: 'disabled',
            caret: 'hide',
            /**
             * Threshold is an acceptable perceived color difference between two pixels
             * The default value 0.2 is not strict enough, so we are changing it to lower value.
             */
            threshold: 0.1,
        },
    },
});
