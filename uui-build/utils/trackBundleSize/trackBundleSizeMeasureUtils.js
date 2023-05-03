const path = require('path');
const { uuiRoot } = require('../constants.js');
const { APP_TARGET_DIR, COLLECT_SIZE_GLOB, TEMPLATE_APP_TARGET_DIR } = require('./bundleStatsConstants.js');
const { getAllMonorepoPackages } = require('../monorepoUtils.js');
const { isRollupModule } = require('../moduleBuildUtils.js');
const SourceMapExplorer = require('source-map-explorer');
const { UNTRACKED_MODULES } = require('./bundleStatsConstants');

module.exports = { measureAllBundleSizes };

async function measureBundleSizeBytes(globPattern) {
    try {
        const result = await SourceMapExplorer.explore(globPattern, { output: { format: 'json' }, noBorderChecks: true, gzip: false });
        return result.bundles.reduce((acc, { totalBytes }) => {
            return acc + totalBytes;
        }, 0);
    } catch (err) {
        console.error(err);
        console.error('Unable to measure size of: ' + globPattern);
        throw new Error(err);
    }
}
async function measureAllBundleSizes() {
    const appSize = await measureBundleSizeBytes(path.resolve(uuiRoot, `${APP_TARGET_DIR}/${COLLECT_SIZE_GLOB.APP}`));
    const templateAppSize = await measureBundleSizeBytes(path.resolve(uuiRoot, `${TEMPLATE_APP_TARGET_DIR}/${COLLECT_SIZE_GLOB.APP}`));
    const allLocalPackages = getAllMonorepoPackages();

    const moduleBundleSizesPromises = Object.keys(allLocalPackages)
        .filter((name) => {
            return isRollupModule(allLocalPackages[name].moduleRootDir) && UNTRACKED_MODULES.indexOf(name) === -1;
        })
        .map((name) => {
            return measureBundleSizeBytes(`${allLocalPackages[name].moduleRootDir}/${COLLECT_SIZE_GLOB.MODULE}`)
                .then((size) => {
                    return { name, size };
                }).catch(console.error);
        });

    const moduleBundleSizes = await Promise.all(moduleBundleSizesPromises);
    const moduleBundleSizesMap = moduleBundleSizes.reduce((acc, { name, size }) => {
        acc[name] = size;
        return acc;
    }, {});

    return {
        templateApp: templateAppSize,
        '@epam/app': appSize,
        ...moduleBundleSizesMap,
    };
}
