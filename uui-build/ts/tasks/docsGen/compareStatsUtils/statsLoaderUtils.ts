import path from 'path';
import fs from 'fs';

import { TDocGenStatsResult } from '../types/types';
import { saveContentToFile } from '../utils/fileUtils';
import { uuiRoot } from '../../../constants';

const OUTPUT_FILE_COMPARISON_REPORT_MD = path.resolve(uuiRoot, './.reports/generateComponentsApiStats.md');

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
    const targetDir = path.dirname(OUTPUT_FILE_COMPARISON_REPORT_MD);
    !fs.existsSync(targetDir) && fs.mkdirSync(targetDir, { recursive: true });
    saveContentToFile(OUTPUT_FILE_COMPARISON_REPORT_MD, reportMd);
}
export function removeComparisonReportMd() {
    if (fs.existsSync(OUTPUT_FILE_COMPARISON_REPORT_MD)) {
        fs.rmSync(OUTPUT_FILE_COMPARISON_REPORT_MD, { force: true });
    }
}
