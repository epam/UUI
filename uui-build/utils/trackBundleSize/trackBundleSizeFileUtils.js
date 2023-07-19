const { logger } = require('../loggerUtils.js');
const { createFileSync, readJsonFileSync } = require('../fileUtils.js');
const path = require('path');
const { uuiRoot } = require('../constants.js');
const { BASE_LINE_PATH, TRACK_BUNDLE_SIZE_REPORT_MD } = require('./bundleStatsConstants.js');
const fs = require('fs');
const { getUuiVersion } = require('../monorepoUtils.js');

const pathToBaselineResolved = path.resolve(uuiRoot, BASE_LINE_PATH);
const uuiVersion = getUuiVersion();

module.exports = {
    overrideBaseLineFileSync,
    getCurrentBaseLineSync,
    saveComparisonResultsMd,
    createBaseLineJson,
};

function createBaseLineJson(sizes) {
    const timestamp = new Date().toISOString().split('T')[0];
    const newBaseline = {
        version: uuiVersion,
        timestamp,
        sizes,
    };
    return JSON.stringify(newBaseline, undefined, 2);
}

/**
 * Creates new file if it doesn't exist.
 * @param sizes
 */
function overrideBaseLineFileSync(newBaseLine) {
    createFileSync(pathToBaselineResolved, newBaseLine);
    logger.info(`New baseline generated at: "${pathToBaselineResolved}".`);
}

function getCurrentBaseLineSync() {
    return fs.existsSync(pathToBaselineResolved) ? readJsonFileSync(pathToBaselineResolved) : undefined;
}

function saveComparisonResultsMd(contentMd) {
    const crPathResolved = path.resolve(uuiRoot, TRACK_BUNDLE_SIZE_REPORT_MD);
    createFileSync(crPathResolved, contentMd);
    logger.info(`Comparison result generated at: "${crPathResolved}".`);
}
