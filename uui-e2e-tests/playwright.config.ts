import { defineConfig, devices, type TraceMode } from '@playwright/test';
import { SHARED_DEVICE_CFG } from './src/constants';
import { readEnvParams } from './scripts/cliUtils';
import { readEnvFile } from './scripts/envFileUtils';
import path from 'node:path';

const { isDocker, isCi } = readEnvParams();
const { UUI_APP_BASE_URL } = readEnvFile();

const maxFailures = isCi ? 10 : 20;
const retries = isCi ? 1 : 1;
const workers = isCi ? 1 : 1;
const forbidOnly = isCi;
const trace = (isCi ? 'retry-with-trace' : 'retain-on-failure') as TraceMode;
const server = {
    startCmd: isCi ? 'yarn start-server' : undefined,
    baseUrl: UUI_APP_BASE_URL,
};
//
const parentDir = isDocker ? '' : '';
export const screenshotsDirAbsPath = path.resolve(process.cwd(), 'tests/__screenshots__');
const testMatch = `${parentDir}tests/*.e2e.ts`;
const outputDir = `${parentDir}tests/.report/results`;
const outputFolder = `${parentDir}tests/.report/report`;
const snapshotPathTemplate = '{testFileDir}/__screenshots__/{platform}/{projectName}/{arg}{ext}';
export const stylePath = `${parentDir}src/fixtures/screenshot.css`;

export default defineConfig({
    timeout: 50000,
    maxFailures,
    testMatch,
    fullyParallel: true,
    forbidOnly,
    retries,
    workers,
    outputDir,
    snapshotPathTemplate,
    reporter: [['html', { outputFolder, open: 'never' }]],
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
                ...SHARED_DEVICE_CFG.DEFAULT,
                launchOptions: {},
            },
        },
        {
            name: 'webkit',
            use: {
                ...devices['Desktop Safari'],
                ...SHARED_DEVICE_CFG.DEFAULT,
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
        },
    },
});
