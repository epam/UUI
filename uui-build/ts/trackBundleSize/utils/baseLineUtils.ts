import path from 'path';
import fs from 'fs';
import { BASE_LINE_PATH, BASELINE_JSON_FORMAT, TRACK_BUNDLE_SIZE_REPORT_MD } from '../constants';
import { createFileSync, getUuiVersion, logger, readJsonFileSync, uuiRoot } from '../../jsBridge';
import { TBundleSizeBaseLine, TBundleSizeMap } from '../types';

const pathToBaselineResolved = path.resolve(uuiRoot, BASE_LINE_PATH);

export function createBaseLine(sizes: TBundleSizeMap): TBundleSizeBaseLine {
    const timestamp = new Date().toISOString().split('T')[0];
    const uuiVersion = getUuiVersion();
    return {
        version: uuiVersion,
        format: BASELINE_JSON_FORMAT,
        timestamp,
        sizes,
    };
}

export const baseLineToString = (baseline: TBundleSizeBaseLine) => {
    return JSON.stringify(baseline, undefined, 2);
};

/**
 * Creates new file if it doesn't exist.
 * @param baselineStr
 */
export function overrideBaseLineFileSync(baselineStr: string) {
    createFileSync(pathToBaselineResolved, baselineStr);
    logger.info(`New baseline generated at: "${pathToBaselineResolved}".`);
}

export function getCurrentBaseLineSync() {
    if (fs.existsSync(pathToBaselineResolved)) {
        const data = readJsonFileSync(pathToBaselineResolved);
        const isFormatSupported = data.format === BASELINE_JSON_FORMAT;
        if (isFormatSupported) {
            return data as TBundleSizeBaseLine;
        }
    }
}

export function saveComparisonResultsMd(contentMd: string) {
    const crPathResolved = path.resolve(uuiRoot, TRACK_BUNDLE_SIZE_REPORT_MD);
    createFileSync(crPathResolved, contentMd);
    logger.info(`Comparison result generated at: "${crPathResolved}".`);
}
