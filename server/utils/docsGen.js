const fs = require('fs');
const path = require('path');

let docsGenCache = null;

/**
 * Reads and caches the docs gen results JSON file
 */
function readDocsGenResultsJson() {
    if (!docsGenCache) {
        const filePath = path.join(__dirname, '../../public/docs/docsGenOutput/docsGenOutput.json');
        docsGenCache = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
    return docsGenCache;
}

let componentSummariesLookupCache = null;

/**
 * Creates a lookup table mapping component references to their summaries
 */
function getComponentSummariesLookup() {
    if (!componentSummariesLookupCache) {
        const { docsGenTypes } = readDocsGenResultsJson();
        componentSummariesLookupCache = Object.fromEntries(
            Object.entries(docsGenTypes).map(([ref, type]) => [ref, type.summary]),
        );
    }
    return componentSummariesLookupCache;
}

module.exports = {
    readDocsGenResultsJson,
    getComponentSummariesLookup,
};
