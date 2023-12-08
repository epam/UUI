import path from 'path';
import fs from 'fs';

import { TDocGenStatsResult } from '../types/types';
import { uuiRoot } from '../constants';
import { saveContentToFile } from '../utils/fileUtils';

const OUTPUT_FILE_COMPARISON_REPORT_MD = path.resolve(uuiRoot, './.reports/generateComponentsApiStats.md');

export function getPrevStatsFromCliArg(): string | undefined {
    const arg = process.argv[2];
    if (arg) {
        const [name, relPath] = arg.split('=');
        if (name === '--prev-stats') {
            return relPath;
        }
        throw new Error(`Unknown argument: ${arg}`);
    }
}

export function getStatsFromFile(relPath: string): TDocGenStatsResult | undefined {
    const fullPath = path.resolve(uuiRoot, relPath);
    if (fs.existsSync(fullPath)) {
        return JSON.parse(fs.readFileSync(fullPath).toString());
    } else {
        console.warn(`Stats not found. This file doesn't exist: ${fullPath}`);
        return;
    }
}

export function saveComparisonReportMd(reportMd: string) {
    const targetDir = path.dirname(reportMd);
    !fs.existsSync(targetDir) && fs.mkdirSync(targetDir, { recursive: true });
    saveContentToFile(OUTPUT_FILE_COMPARISON_REPORT_MD, reportMd);
}
export function removeComparisonReportMd() {
    if (fs.existsSync(OUTPUT_FILE_COMPARISON_REPORT_MD)) {
        fs.rmSync(OUTPUT_FILE_COMPARISON_REPORT_MD, { force: true });
    }
}
