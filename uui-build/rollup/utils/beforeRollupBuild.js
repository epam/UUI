const fs = require('fs-extra');
const { copyPackageJsonAsync } = require('./../../utils/packageJsonUtils.js');
const path = require('path');

const BUILD_FOLDER = 'build';

module.exports = {
    beforeRollupBuild,
};

/**
 * @param {string[]} copyAsIs
 * @returns {Promise<void>}
 */
async function copyStaticFilesAsync(copyAsIs = []) {
    const p = copyAsIs.map(async (c) => {
        if (await fs.exists(c)) {
            await fs.copy(c, `${BUILD_FOLDER}/${c}`);
        }
    });
    await Promise.all(p);
}

async function copyPackageJson({ moduleRootDir, packageJsonTransform }) {
    await copyPackageJsonAsync({
        fromDir: moduleRootDir,
        toDir: path.resolve(moduleRootDir, `./${BUILD_FOLDER}`),
        transform: packageJsonTransform,
    });
}

async function beforeRollupBuild({ moduleRootDir, packageJsonTransform, copyAsIs }) {
    fs.emptyDirSync(BUILD_FOLDER);
    await copyStaticFilesAsync(copyAsIs);
    await copyPackageJson({ moduleRootDir, packageJsonTransform });
}
