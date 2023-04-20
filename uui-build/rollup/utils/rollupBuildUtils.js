const { createRollupConfigForModule } = require('../rollup.config.js');
const rollup = require('rollup');
const { logger } = require('./../../utils/loggerUtils.js');
const { getIndexFileRelativePath } = require('../../utils/indexFileUtils.js');

module.exports = { buildUsingRollup, watchUsingRollup };

/**
 * Starts Rollup build for the given module.
 *
 * @param {Object} params
 * @param {string} params.moduleRootDir absolute path to module root dir
 * @param {any} [params.external] pass a callback if you need to override default behavior
 * @param {any} [params.packageJsonTransform] (it's applied before build is started). callback to adjust content of package.json when it's copied to the "build" folder.
 * @param {string[]} [params.copyAsIs] (it's applied before build is started). files to copy as is to the "build" folder.
 * @returns {Promise<void>}
 */
async function buildUsingRollup(params) {
    const cfg = await getConfigEffective({ ...params, isWatch: false });
    const { output: outputConfig, ...inputConfig } = cfg[0];
    let bundle;
    const cleanup = async () => {
        bundle && (await bundle.close());
    };
    try {
        bundle = await rollup.rollup({ ...inputConfig });
        await Promise.all(outputConfig.map(bundle.write));
    } catch (error) {
        console.error(error);
        process.exit(1);
    } finally {
        await cleanup();
    }
}

/**
 * Starts Rollup watcher for the given module.
 *
 * @param {Object} params
 * @param {string} params.moduleRootDir absolute path to module root dir
 * @param {any} [params.external] pass a callback if you need to override default behavior
 * @param {any} [params.packageJsonTransform] (it's applied before build is started). callback to adjust content of package.json when it's copied to the "build" folder.
 * @param {string[]} [params.copyAsIs] (it's applied before build is started). files to copy as is to the "build" folder.
 * @returns {Promise<void>}
 */
async function watchUsingRollup(params) {
    const cfg = await getConfigEffective({ ...params, isWatch: true });
    const watcher = rollup.watch(cfg);
    watcher.on('event', ({ code, result }) => {
        switch (code) {
            case 'START': {
                logger.success(`Watcher started: ${params.moduleRootDir}`);
                break;
            }
            case 'BUNDLE_START': {
                logger.info(`Compiling: ${params.moduleRootDir}`);
                break;
            }
            case 'BUNDLE_END': {
                logger.info(`Compiling done: ${params.moduleRootDir}`);
                break;
            }
            case 'ERROR': {
                logger.error(`Compile error: ${params.moduleRootDir}`);
                break;
            }
        }
        if (result) {
            result.close();
        }
    });
}

/**
 * Creates rollup config for the module
 *
 * @param {Object} params
 * @param {string} params.moduleRootDir absolute path to module root dir
 * @param {any} [params.external] pass a callback if you need to override default behavior
 * @param {boolean} [params.isWatch] pass true if the config will be used in watch mode
 * @param {any} [params.packageJsonTransform] (it's applied before build is started). callback to adjust content of package.json when it's copied to the "build" folder.
 * @param {string[]} [params.copyAsIs] (it's applied before build is started). files to copy as is to the "build" folder.
 * @returns {Promise<import('rollup').RollupOptions[]>}
 */
async function getConfigEffective(params) {
    const {
        moduleRootDir, external, isWatch, packageJsonTransform, copyAsIs,
    } = params;
    const indexFileRelativePath = await getIndexFileRelativePath(moduleRootDir);
    return await createRollupConfigForModule({
        moduleRootDir,
        indexFileRelativePath,
        external,
        isWatch,
        packageJsonTransform,
        copyAsIs,
    });
}
