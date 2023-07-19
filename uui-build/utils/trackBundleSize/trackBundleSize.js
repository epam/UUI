/**
 * This script is used for bundle size tracking to prevent accidental bundle size regression.
 * The generated reports can be compared with each other in order to detect any regression in bundle size.
 */
const { logger } = require('../loggerUtils.js');
const {
    isAllLocalDependenciesBuilt,
    getAllMonorepoPackages, getAllLocalDependenciesInfo,
} = require('../monorepoUtils.js');
const path = require('path');
const fs = require('fs');
const { readPackageJsonContentSync } = require('../packageJsonUtils.js');
const {
    runYarnScriptFromRootSync,
    runCmdFromRootSync,
    runCmdSync,
} = require('../cmdUtils.js');
const { uuiRoot } = require('../constants.js');
const {
    APP_TEMPLATE_DIR,
    TEMPLATE_APP_TARGET_DIR,
} = require('./bundleStatsConstants.js');
const { comparisonResultToMd } = require('./trackBundleSizeMdFormatter.js');
const { compareBundleSizes } = require('./trackBundleSizeComparator.js');
const { overrideBaseLineFileSync, getCurrentBaseLineSync, saveComparisonResultsMd } = require('./trackBundleSizeFileUtils.js');
const { measureAllBundleSizes } = require('./trackBundleSizeMeasureUtils.js');
const { createBaseLineJson } = require('./trackBundleSizeFileUtils.js');

const epamPrefix = '@epam/';
const appTargetDirResolved = path.resolve(uuiRoot, TEMPLATE_APP_TARGET_DIR);
const webpackConfigResolved = path.resolve(appTargetDirResolved, 'node_modules/react-scripts/config/webpack.config.js');
const webpackPatch = { replaceWhat: 'resolve: {', replaceTo: 'resolve: {symlinks: false,' };
const CLI = {
    buildApp: { cmd: 'npm', args: ['run', 'build'] },
    createAppFromTemplate: {
        cmd: 'npx',
        args: [
            'create-react-app', TEMPLATE_APP_TARGET_DIR, '--template', `file:${APP_TEMPLATE_DIR}`,
        ],
    },
};

module.exports = { trackBundleSize };

/**
 * Generate report which contains bundle size.
 * More specifically, it does the following:
 * - Build react app from the local UUI template. All local UUI dependencies will be symlinked to this app.
 * - Build the app to generate bundles.
 * - Use source-map-explorer to collect total size of all js bundles.
 * - Generate report at: ./.reports/collect-bundle-stats.json
 */
async function trackBundleSize({ overrideBaseline } = {}) {
    await runSimpleWorkflow([
        checkAllModulesAreBuilt,
        createCraFromUuiTemplate,
        symlinkAppDependencies,
        fixCraConfig,
        buildApp,
        function compareWithBaseLineWrapper() { return compareWithBaseLine({ overrideBaseline }); },
    ]);
}

async function logTimeTook(fn, name) {
    const label = name || fn.name;
    const begin = new Date();
    function secondsBetween(d1, d2) {
        return Math.ceil((d2.getTime() - d1.getTime()) / 1000);
    }
    logger.info(`Started "${label}".`);
    await fn();
    const end = new Date();
    logger.success(`Completed "${label}". Took: ${secondsBetween(begin, end)} (sec).`);
}

async function runSimpleWorkflow(arr) {
    const fn = async () => {
        for (let i = 0; i < arr.length; i++) {
            logger.info('');
            const f = arr[i];
            await logTimeTook(f);
        }
    };
    await logTimeTook(fn, 'main');
}

async function checkAllModulesAreBuilt() {
    const { isBuilt } = isAllLocalDependenciesBuilt();
    if (!isBuilt) {
        runYarnScriptFromRootSync('build-modules');
    }
}

async function createCraFromUuiTemplate() {
    if (fs.existsSync(appTargetDirResolved)) {
        fs.rmSync(appTargetDirResolved, { recursive: true, force: true });
    }
    runCmdFromRootSync(CLI.createAppFromTemplate.cmd, CLI.createAppFromTemplate.args);
}

async function symlinkAppDependencies() {
    // 1. get list of dependencies which can be symlinked to local folders
    const { dependencies, devDependencies } = readPackageJsonContentSync(appTargetDirResolved);
    const potentiallyLocalDeps = Object.keys({ ...dependencies, ...devDependencies }).filter((n) => n.indexOf(epamPrefix) === 0);

    // 2. check whether we have any local dependencies with same names and symlink them if so.
    const allLocalPackages = getAllMonorepoPackages();
    const localDepsToBeSymlinkedMap = potentiallyLocalDeps.reduce((acc, name) => {
        const loc = allLocalPackages[name];
        if (loc) {
            acc[name] = loc;

            // also, need to add local deps of this local dep. otherwise - it will take it from NPM, which is unexpected.
            const allDepsIncludingTransitive = getAllLocalDependenciesInfo(name);
            allDepsIncludingTransitive.forEach((dt) => {
                acc[dt.name] = allLocalPackages[dt.name];
            });
        }
        return acc;
    }, {});

    // 3. create actual symlinks
    Object.values(localDepsToBeSymlinkedMap).forEach(({ name, moduleRootDir }) => {
        const dirName = path.resolve(moduleRootDir, './build');
        const cmd = 'npm';
        const cwd = appTargetDirResolved;
        runCmdSync({
            cmd,
            cwd,
            args: [
                'link', dirName, '--save',
            ],
        });
        logger.info(`Symlink created for "${name}".`);
    });
}

async function fixCraConfig() {
    const contentStr = fs.readFileSync(webpackConfigResolved, 'utf8').toString();
    if (contentStr.indexOf(webpackPatch.replaceTo) === -1) {
        fs.writeFileSync(webpackConfigResolved, contentStr.replace(webpackPatch.replaceWhat, webpackPatch.replaceTo));
    }
}

async function buildApp() {
    const cmd = CLI.buildApp.cmd;
    const args = CLI.buildApp.args;
    const cwd = appTargetDirResolved;
    runCmdSync({ cmd, cwd, args });
}

async function compareWithBaseLine(params) {
    const { overrideBaseline } = params || {};
    const newSizes = await measureAllBundleSizes();
    console.log('New sizes:');
    console.table(newSizes);
    const newBaseLine = createBaseLineJson(newSizes);
    if (overrideBaseline) {
        overrideBaseLineFileSync(newBaseLine);
    }
    const currentBaseLine = getCurrentBaseLineSync();
    const baseLineSizes = currentBaseLine.sizes;
    console.log('Baseline sizes:');
    console.table(baseLineSizes);
    const comparisonResult = compareBundleSizes({ baseLineSizes, newSizes });
    const comparisonResultMd = comparisonResultToMd({ comparisonResult, currentBaseLine, newBaseLine });
    console.log('Comparison results:');
    console.table(comparisonResult);
    saveComparisonResultsMd(comparisonResultMd);
}
