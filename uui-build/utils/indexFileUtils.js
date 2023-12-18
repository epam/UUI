const fs = require('fs-extra');
const path = require('path');

module.exports = { getIndexFileRelativePath, isRollupModule };

const indexFileNames = ['index.ts', 'index.tsx'];
/**
 * Returns relative path to "index" file if it exists.
 *
 * @param {string} moduleRootDir
 */
function getIndexFileRelativePath(moduleRootDir) {
    return indexFileNames.reduce((acc, name) => {
        const relativePath = `./${name}`;
        const pathResolved = path.resolve(moduleRootDir, relativePath);
        if (fs.existsSync(pathResolved)) {
            return relativePath;
        }
        return acc;
    }, null);
}

/**
 * @param {string} moduleRootDir
 *
 * @returns {Promise<boolean>}
 */
function isRollupModule(moduleRootDir) {
    const moduleIndexFile = getIndexFileRelativePath(moduleRootDir);
    return !!moduleIndexFile;
}
