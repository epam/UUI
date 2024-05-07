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
        const rootDir = path.resolve(this.screenshotsDir, PLATFORM);
        if (!UUI_TEST_PARAM_CHECK_ISSUES || !fs.existsSync(rootDir)) {
            return;
        }

        const engines = fs.readdirSync(rootDir);
        const obsoleteScreenshots: string[] = [];
        const screenshotSizeMap: {
            [component: string]: {
                [previewId: string]: {
                    [themeId: string]: {
                        NotSkin?: number;
                        Skin?: number;
                    }
                }
            }
        } = {};
        engines.forEach((name, i) => {
            const enginePath = path.resolve(rootDir, name);
            fs.readdirSync(enginePath).forEach((fileName) => {
                const testName = path.basename(fileName, '.png');
                const screenshotFileFullPath = path.resolve(enginePath, fileName);
                if (!this.seenTestNames.has(testName)) {
                    obsoleteScreenshots.push(screenshotFileFullPath);
                }
                if (i === 0) {
                    // Always use first engine. It does not matter which engine to use for this check.
                    const [componentId, ...rest] = testName.split('-');
                    const previewId = rest.slice(0, rest.length - 2).join('-');
                    const [themeId, skinKey] = rest.slice(rest.length - 2);
                    if (!screenshotSizeMap[componentId]) {
                        screenshotSizeMap[componentId] = {};
                    }
                    if (!screenshotSizeMap[componentId][previewId]) {
                        screenshotSizeMap[componentId][previewId] = {};
                    }
                    if (!screenshotSizeMap[componentId][previewId][themeId]) {
                        screenshotSizeMap[componentId][previewId][themeId] = {};
                    }
                    screenshotSizeMap[componentId][previewId][themeId][skinKey as ('Skin' | 'NotSkin')] = fs.statSync(screenshotFileFullPath).size;
                }
            });
        });
        const skinEqualsNotSkinComponents = new Set<string>();
        Object.keys(screenshotSizeMap).forEach((cId) => {
            const pMap = screenshotSizeMap[cId];
            const skinEqualsNotSkin = Object.keys(pMap).every((pId) => {
                return Object.keys(pMap[pId]).every((themeId) => {
                    const { NotSkin, Skin } = pMap[pId][themeId];
                    return NotSkin === Skin;
                });
            });
            if (skinEqualsNotSkin) {
                skinEqualsNotSkinComponents.add(cId);
            }
        });
        const issuesArr: { msg: string; exit: boolean }[] = [];
        if (skinEqualsNotSkinComponents.size > 0) {
            const msg = `Next components have no difference between Skin/NotSkin:\n${[...skinEqualsNotSkinComponents].join('\n\t')}`;
            issuesArr.push({ msg, exit: false });
        }
        if (obsoleteScreenshots.length > 0) {
            const msg = `Next screenshots are not used by any test:\n${obsoleteScreenshots.join('\n\t')}`;
            Logger.warn({ msg, exit: true });
        }
        if (issuesArr.length) {
            let shouldExit = false;
            issuesArr.forEach(({ msg, exit }) => {
                Logger.warn(msg);
                shouldExit = shouldExit || exit;
            });
            if (shouldExit && isCi) {
                process.exit(1);
            }
        } else {
            Logger.info('No issues found');
        }
    }
}
