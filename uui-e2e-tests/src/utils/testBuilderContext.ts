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
            const screenshotSizeMap: {
                [component: string]: {
                    [preview: string]: {
                        notSkin?: number;
                        skin?: number;
                    }
                }
            } = {};
            engines.forEach((name, i) => {
                const enginePath = path.resolve(rootDir, name);
                fs.readdirSync(enginePath).forEach((fileName) => {
                    const testName = path.basename(fileName, '.png');
                    if (!this.seenTestNames.has(testName)) {
                        obsoleteScreenshots.push(path.resolve(enginePath, fileName));
                    }
                    if (i === 0) {
                        // Always use first engine. It does not matter which engine to use for this check.
                        const [componentId, ...rest] = testName.split('-');
                        const previewId = rest.slice(0, rest.length - 2).join('-');
                        if (!screenshotSizeMap[componentId]) {
                            screenshotSizeMap[componentId] = {};
                        }
                        if (!screenshotSizeMap[componentId][previewId]) {
                            screenshotSizeMap[componentId][previewId] = {};
                        }
                        const key = testName.endsWith('-Skin') ? 'skin' : 'notSkin';
                        screenshotSizeMap[componentId][previewId][key] = fs.statSync(path.resolve(enginePath, fileName)).size;
                    }
                });
            });
            const skinEqualsNotSkinComponents = new Set<string>();
            Object.keys(screenshotSizeMap).forEach((cId) => {
                const pMap = screenshotSizeMap[cId];
                const skinEqualsNotSkin = Object.keys(pMap).every((pId) => {
                    const { notSkin, skin } = pMap[pId];
                    return notSkin === skin;
                });
                if (skinEqualsNotSkin) {
                    skinEqualsNotSkinComponents.add(cId);
                }
            });
            let issuesFound = false;
            if (skinEqualsNotSkinComponents.size > 0) {
                issuesFound = true;
                Logger.warn(`Next components have the same screenshot for both 'skin' and 'notSkin' mode:\n${[...skinEqualsNotSkinComponents].join('\n\t')}`);
            }
            if (obsoleteScreenshots.length > 0) {
                issuesFound = true;
                Logger.warn(`Next screenshots are not used by any test:\n${obsoleteScreenshots.join('\n\t')}`);
                if (isCi) {
                    process.exit(1);
                }
            }
            if (!issuesFound) {
                Logger.info('No issues found');
            }
        } else {
            // The directory does not exist. Obsolete screenshots check is skipped.
            return;
        }
    }
}
