const fs = require('fs-extra');
const path = require('path');

module.exports = { getIndexFileRelativePath };

const indexFileNames = ['index.ts', 'index.tsx'];
/**
 * Returns relative path to "index" file if it exists.
 *
 * @param {string} moduleRootDir
 */
async function getIndexFileRelativePath(moduleRootDir) {
    const found = await Promise.all(
        indexFileNames.map(async name => {
            const relativePath = `./${name}`;
            const pathResolved = path.resolve(moduleRootDir, relativePath);
            if (await fs.exists(pathResolved)) {
                return relativePath;
            }
        })
    );
    return found.find(Boolean);
}
