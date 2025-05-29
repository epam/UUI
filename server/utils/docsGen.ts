import fs from 'fs';
import path from 'path';

let docsGenCache: any = null;

/**
 * Reads and caches the docs gen results JSON file
 */
export function readDocsGenResultsJson() {
    if (!docsGenCache) {
        const filePath = path.resolve(__dirname, '../../../public/docs/docsGenOutput/docsGenOutput.json');
        docsGenCache = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
    return docsGenCache;
}

let componentSummariesLookupCache: any = null;

/**
 * Creates a lookup table mapping component references to their summaries
 */
export function getComponentSummariesLookup() {
    if (!componentSummariesLookupCache) {
        const { docsGenTypes } = readDocsGenResultsJson();
        componentSummariesLookupCache = Object.fromEntries(
            Object.entries(docsGenTypes).map(([ref, type]: any) => [ref, type.summary]),
        );
    }
    return componentSummariesLookupCache;
}
