import fs from 'node:fs';
import path from 'node:path';
import { Logger } from './logger';
import { PLATFORM } from '../constants';
import { getFailedTestNamesFromLastRun } from './failedTestsUtils';
import { readUuiSpecificEnvVariables } from '../../scripts/envParamUtils';
import * as console from 'console';
import { TEngine } from '../types';
import { parseTestName } from './testNameUtils';

const {
    isCi,
    UUI_TEST_PARAM_ONLY_FAILED,
    UUI_TEST_PARAM_CHECK_ISSUES,
    UUI_TEST_PARAM_CHECK_ISSUES_REMOVE_OBSOLETE_SCR,
} = readUuiSpecificEnvVariables();

type TScrSizeMap = {
    [component: string]: {
        [previewIdWithTag: string]: {
            [themeId: string]: {
                NotSkin?: number;
                Skin?: number;
            }
        }
    }
};
type TIssues = { msg: string; exit: boolean }[];

export class TestBuilderContext {
    private seenTestNames: Set<string> = new Set();
    private onlyChromiumTests: Set<string> = new Set();
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

    isDryRun() {
        return !!UUI_TEST_PARAM_CHECK_ISSUES;
    }

    seen(testName: string, onlyChromium?: boolean) {
        if (this.seenTestNames.has(testName)) {
            throw new Error(`Duplicated test found: "${testName}"`);
        }
        this.seenTestNames.add(testName);
        if (onlyChromium) {
            this.onlyChromiumTests.add(testName);
        }
    }

    reportIssues() {
        const rootDir = path.resolve(this.screenshotsDir, PLATFORM);
        if (!UUI_TEST_PARAM_CHECK_ISSUES || !fs.existsSync(rootDir)) {
            return;
        }

        const engines = fs.readdirSync(rootDir);
        const obsoleteScr: string[] = [];
        const scrSizeMap: TScrSizeMap = {};
        engines.forEach((engineName) => {
            const enginePath = path.resolve(rootDir, engineName);
            fs.readdirSync(enginePath).forEach((fileName) => {
                const testName = path.basename(fileName, '.png');
                const scrFileFullPath = path.resolve(enginePath, fileName);
                const scrSize = fs.statSync(scrFileFullPath).size;

                const parsedTestName = parseTestName(testName);

                const isObsoleteScr = !this.seenTestNames.has(testName) || (this.onlyChromiumTests.has(testName) && engineName !== TEngine.chromium);
                if (isObsoleteScr) {
                    if (UUI_TEST_PARAM_CHECK_ISSUES_REMOVE_OBSOLETE_SCR) {
                        fs.rmSync(scrFileFullPath);
                    }
                    obsoleteScr.push(scrFileFullPath);
                }
                if (engineName === TEngine.chromium && !isObsoleteScr) {
                    // Always use chromium engine. It does not matter which engine to use for this check.
                    const { componentId, previewIdWithTag, theme, skinToken } = parsedTestName;
                    if (!scrSizeMap[componentId]) {
                        scrSizeMap[componentId] = {};
                    }
                    if (!scrSizeMap[componentId][previewIdWithTag]) {
                        scrSizeMap[componentId][previewIdWithTag] = {};
                    }
                    if (!scrSizeMap[componentId][previewIdWithTag][theme]) {
                        scrSizeMap[componentId][previewIdWithTag][theme] = {};
                    }
                    scrSizeMap[componentId][previewIdWithTag][theme][skinToken as ('Skin' | 'NotSkin')] = scrSize;
                }
            });
        });
        const numOfEngines = 2;
        const numOfChromiumOnlyTests = this.onlyChromiumTests.size;
        const numOfAllEnginesTests = (this.seenTestNames.size - numOfChromiumOnlyTests);

        console.log(`Total number of tests: ${numOfAllEnginesTests * 2 + numOfChromiumOnlyTests} = ${numOfAllEnginesTests} * ${numOfEngines}(engines) + ${numOfChromiumOnlyTests}(only chromium)`);

        const issuesArr: TIssues = [];
        reportObsoleteScr(obsoleteScr, issuesArr, !!UUI_TEST_PARAM_CHECK_ISSUES_REMOVE_OBSOLETE_SCR);
        reportEqualPreview(scrSizeMap, issuesArr);
        reportUnnecessarySkinTests(scrSizeMap, issuesArr);

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

/**
 * It prints list of previews which have associated exactly same screenshot file size
 * @param scrSizeMap
 * @param issuesArr
 */
function reportEqualPreview(scrSizeMap: TScrSizeMap, issuesArr: TIssues) {
    const errs: { compId: string, duplicates: string[] }[] = [];
    Object.keys(scrSizeMap).forEach((compId: string) => {
        const mapSizesToArrOfPreview = new Map<string, string[]>();
        const previewMap = scrSizeMap[compId];
        Object.keys(previewMap).forEach((previewIdWithTag) => {
            const themeMap = previewMap[previewIdWithTag];
            const sortedThemeIds = Object.keys(themeMap).sort();
            const sizeStr = sortedThemeIds.map((themeId) => {
                const { NotSkin, Skin } = themeMap[themeId];
                return `${NotSkin}/${Skin}`;
            }).join(';');
            if (!mapSizesToArrOfPreview.get(sizeStr)) {
                mapSizesToArrOfPreview.set(sizeStr, []);
            }
            mapSizesToArrOfPreview.get(sizeStr)!.push(previewIdWithTag);
        });
        mapSizesToArrOfPreview.forEach((duplicates) => {
            if (duplicates.length > 1) {
                errs.push({ compId, duplicates });
            }
        });
    });
    if (errs.length > 0) {
        const errsStr = errs.map(({ compId, duplicates }) => {
            return `"${compId}": ${duplicates.join(' === ')}`;
        }).join('\n\t');
        const msg = `Next components have several "preview" which produce exact same screenshots in all modes:\n\t${errsStr}`;
        issuesArr.push({ msg, exit: false });
    }
}

function reportObsoleteScr(obsoleteScreenshots: string[], issuesArr: TIssues, isRemoved: boolean) {
    if (obsoleteScreenshots.length > 0) {
        const prefix = isRemoved ? 'Obsolete screenshots were deleted' : 'Obsolete screenshots found';
        const msg = `${prefix} (${obsoleteScreenshots.length}):\n\t${obsoleteScreenshots.join('\n\t')}`;
        issuesArr.push({ msg, exit: false });
    }
}

function reportUnnecessarySkinTests(scrSizeMap: TScrSizeMap, issuesArr: TIssues) {
    const res = new Set<string>();
    Object.keys(scrSizeMap).forEach((componentId) => {
        const previewMap = scrSizeMap[componentId];
        const skinEqualsNotSkin = Object.keys(previewMap).every((previewId) => {
            return Object.keys(previewMap[previewId]).every((themeId) => {
                const { NotSkin, Skin } = previewMap[previewId][themeId];
                return NotSkin === Skin;
            });
        });
        if (skinEqualsNotSkin) {
            res.add(componentId);
        }
    });
    if (res.size > 0) {
        const msg = `Next components have no difference between Skin/NotSkin:\n\t${[...res].join('\n\t')}`;
        issuesArr.push({ msg, exit: false });
    }
}
