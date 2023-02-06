const fs = require('fs-extra');
const path = require('path');
const { getIndexFileRelativePath } = require('./../utils/indexFileUtils');
const { logger, ModuleBuildProgressLogger } = require('./../utils/loggerUtils');
const { buildUsingRollup, watchUsingRollup } = require('../rollup/utils/rollupBuildUtils');
const { copyPackageJsonAsync } = require("../utils/packageJsonUtils");

const BUILD_FOLDER = 'build'

module.exports = { buildUuiModule, buildModuleUsingRollup };

async function withEventsLogger({ moduleRootDir, isRollup, asyncCallback }) {
    const moduleBuildLogger = new ModuleBuildProgressLogger({ moduleRootDir, isRollup });
    moduleBuildLogger.start();
    try {
        await asyncCallback();
        moduleBuildLogger.done()
    } catch(err) {
        moduleBuildLogger.error()
        err && err.message && logger.error(err.message);
        process.exit(1);
    }
}

async function buildUuiModule() {
    const moduleRootDir = process.cwd();
    const isRollup = await isRollupModule(moduleRootDir);
    if (isRollup) {
        await buildModuleUsingRollup({
            moduleRootDir,
            copyAsIs: ['readme.md', 'assets'],
            packageJsonTransform: content => { delete content['epam:uui:main']; },
        });
    } else {
        await buildStaticModule({ moduleRootDir });
    }
}

/**
 * This is to handle modules which don't require build.
 * This function just copies all files to the output dir.
 *
 * @param moduleRootDir
 */
async function buildStaticModule({ moduleRootDir }) {
    const asyncCallback = async () => {
        fs.emptyDirSync(BUILD_FOLDER);
        copyAllModuleFilesToOutputSync(moduleRootDir);
    };
    await withEventsLogger({ moduleRootDir, isRollup: false, asyncCallback });
}

/**
 * Builds module using Rollup.
 *
 * @param {Object}      options
 * @param {string}      options.moduleRootDir   "absolute" path to the module root dir
 * @param {string[]}    options.copyAsIs        array of file/folder names in the module root dir
 *      which must be copied to the output "as-is" (except for package.json which is always copied anyway).
 * @param {any}         [options.packageJsonTransform] pass callback if content of copied package.json needs to be adjusted.
 * @param {boolean}     [options.isWatch = false]       pass true to start rollup watcher.
 * @param {any}         [options.external]      pass a callback if you need to override default behavior
 *
 * @returns {Promise<void>}
 */
async function buildModuleUsingRollup(options) {
    const { moduleRootDir, copyAsIs, packageJsonTransform, external, isWatch } = options;
    const asyncCallback = async () => {
        fs.emptyDirSync(BUILD_FOLDER);
        await copyStaticFilesAsync(copyAsIs);
        await copyPackageJson({ moduleRootDir, packageJsonTransform });
        const params = { moduleRootDir, external };
        if (isWatch) {
            await watchUsingRollup(params);
        } else {
            await buildUsingRollup(params);
        }
    };
    if (isWatch) {
        // Don't log anything, because Rollup watcher already does it.
        return await asyncCallback();
    }
    await withEventsLogger({ moduleRootDir, isRollup: true, asyncCallback })
}

/**
 * @param {string[]} copyAsIs
 * @returns {Promise<void>}
 */
async function copyStaticFilesAsync(copyAsIs = []) {
    const p = copyAsIs.map(async (c) => {
        if (await fs.exists(c)) {
            await fs.copy(c, `${BUILD_FOLDER}/${c}`);
        }
    })
    await Promise.all(p)
}

async function copyPackageJson({ moduleRootDir, packageJsonTransform }) {
    await copyPackageJsonAsync({
        fromDir: moduleRootDir,
        toDir: path.resolve(moduleRootDir, `./${BUILD_FOLDER}`),
        transform: packageJsonTransform
    });
}

/**
 * Copy everything to the output folder "as-is".
 * @param {string} moduleRootDir
 */
function copyAllModuleFilesToOutputSync(moduleRootDir) {
    for(let file of fs.readdirSync(moduleRootDir)) {
        if (file !== BUILD_FOLDER) {
            const from = path.resolve(moduleRootDir, file);
            const to = path.resolve(moduleRootDir, BUILD_FOLDER, file)
            fs.copySync(from, to)
        }
    }
}

/**
 * @param {string} moduleRootDir
 *
 * @returns {Promise<boolean>}
 */
async function isRollupModule(moduleRootDir) {
    const moduleIndexFile = await getIndexFileRelativePath(moduleRootDir);
    return !!moduleIndexFile;
}
