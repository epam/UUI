import fs from 'node:fs';
import path from 'node:path';
import { Logger } from './logger';
import { PLATFORM } from '../constants';
import { getFailedTestNamesFromLastRun } from './failedTestsUtils';
import { readUuiSpecificEnvVariables } from '../../scripts/envParamUtils';

const { isCi, UUI_TEST_PARAM_ONLY_FAILED, UUI_TEST_PARAM_CHECK_ISSUES } = readUuiSpecificEnvVariables();

export class TestBuilderContext {
    private seenTestNames: Set<string> = new Set();
    private failedTestNames: Set<string>;

    constructor(private screenshotsDir: string) {
        this.failedTestNames = getFailedTestNamesFromLastRun();
    }

    shouldSkipTest(testName: string) {
        if (UUI_TEST_PARAM_ONLY_FAILED) {
            return !this.failedTestNames.has(testName);
        }
        return false;
    }

    seen(testName: string) {
        if (this.seenTestNames.has(testName)) {
            throw new Error(`Duplicated test found: "${testName}"`);
        }
        this.seenTestNames.add(testName);
    }

    reportIssues() {
        if (!UUI_TEST_PARAM_CHECK_ISSUES) {
            return;
        }

        const rootDir = path.resolve(this.screenshotsDir, PLATFORM);
        if (fs.existsSync(rootDir)) {
            const engines = fs.readdirSync(rootDir);
            const obsoleteScreenshots: string[] = [];
            engines.forEach((name) => {
                const enginePath = path.resolve(rootDir, name);
                fs.readdirSync(enginePath).forEach((fileName) => {
                    const testName = path.basename(fileName, '.png');
                    if (!this.seenTestNames.has(testName)) {
                        obsoleteScreenshots.push(path.resolve(enginePath, fileName));
                    }
                });
            });
            if (obsoleteScreenshots.length > 0) {
                Logger.warn(`Next screenshots are not used by any test:\n${obsoleteScreenshots.join('\n\t')}`);
                if (isCi) {
                    process.exit(1);
                }
            } else {
                Logger.info('No issues found');
            }
        } else {
            // The directory does not exist. Obsolete screenshots check is skipped.
            return;
        }
    }
}
