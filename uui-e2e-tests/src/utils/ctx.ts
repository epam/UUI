import fs from 'node:fs';
import path from 'node:path';
import { fileNameToTestName } from './testNameUtils';
import { Logger } from './logger';
import { readEnvFile } from '../../scripts/envFileUtils';

const { UUI_REPORT_OBSOLETE_SCREENSHOTS } = readEnvFile();

export class Ctx {
    private seenTestNames: Set<string> = new Set();

    constructor(private screenshotsDir: string) {}

    seen(testName: string) {
        if (this.seenTestNames.has(testName)) {
            throw new Error(`Duplicated test found: "${testName}"`);
        }
        this.seenTestNames.add(testName);
    }

    reportUnusedScreenshots() {
        if (UUI_REPORT_OBSOLETE_SCREENSHOTS !== 'true') {
            return;
        }
        const rootDir = path.resolve(this.screenshotsDir, process.platform);
        if (!fs.existsSync(rootDir)) {
            // The directory does not exist. Obsolete screenshots check is skipped.
            return;
        }
        const engines = fs.readdirSync(rootDir);
        const obsoleteScreenshots: string[] = [];
        engines.forEach((name) => {
            const enginePath = path.resolve(rootDir, name);
            fs.readdirSync(enginePath).forEach((fileName) => {
                const fileNameNoExt = path.basename(fileName, '.png');
                if (!this.seenTestNames.has(fileNameToTestName(fileNameNoExt))) {
                    obsoleteScreenshots.push(path.resolve(enginePath, fileName));
                }
            });
        });
        if (obsoleteScreenshots.length > 0) {
            Logger.error(`Next screenshots are not used by any test:\n${obsoleteScreenshots.join('\n\t')}`);
            process.exit(1);
        }
    }
}
