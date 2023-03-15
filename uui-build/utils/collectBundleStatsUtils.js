/**
 * This script is used for bundle size tracking to prevent accidental bundle size regression.
 * The generated reports can be compared with each other in order to detect any regression in bundle size.
 */
const { logger } = require('./loggerUtils.js');
const { createFileSync, readJsonFileSync } = require('./fileUtils.js');
const { isAllLocalDependenciesBuilt,
    getAllMonorepoPackages
} = require('./monorepoUtils');
const path = require('path');
const fs = require('fs');
const SourceMapExplorer = require('source-map-explorer');
const { readPackageJsonContentSync } = require('./packageJsonUtils');
const { runYarnScriptFromRootSync,
    runCmdFromRootSync,
    runCmdSync
} = require('./cmdUtils.js');
const { uuiRoot } = require('./constants.js');

const appTemplateDir = './templates/uui-cra-template';
const appTargetDir = './.templates/uui-cra-template/app';
const epamPrefix = '@epam/';
const appTargetDirResolved = path.resolve(uuiRoot, appTargetDir);
const appBuildDirResolved = path.resolve(appTargetDirResolved, './build');
const webpackConfigResolved = path.resolve(appTargetDirResolved, 'node_modules/react-scripts/config/webpack.config.js');
const webpackPatch = { replaceWhat: 'resolve: {', replaceTo: 'resolve: {symlinks: false,'};
const CLI = {
    buildApp: { cmd: 'npm', args: ['run', 'build'] },
    createAppFromTemplate: { cmd: 'npx', args: ['create-react-app', appTargetDir, '--template', `file:${appTemplateDir}`] },
};
const reportPathResolved = path.resolve(uuiRoot, './.reports/collect-bundle-stats.json');
const collectBundleStatsFrom = `${appBuildDirResolved}/static/js/**/*.js`
const uuiCraTemplateAppBundleSizeKey = 'uuiCraTemplateAppBundleSize';
const compareStatsKeys = [uuiCraTemplateAppBundleSizeKey];
const compareStatsMaxSizeLimitBytes = 1024 * 1700;

module.exports = { collectBundleStats, compareBundleStats }


function compareBundleStats(statsFilePathBefore, statsFilePathAfter, throwErrIfLimitExceeds = false) {
    const before = readJsonFileSync(path.resolve(uuiRoot, statsFilePathBefore));
    const after = readJsonFileSync(path.resolve(uuiRoot, statsFilePathAfter));

    let someLimitExceeded = false;
    const diffReport = {};
    compareStatsKeys.forEach(key => {
        const a = after[key];
        const b = before[key];
        const diff = a - b;
        const sign = diff > 0 ? '+' : '';
        const diffLabel = `${sign}${diff} (bytes)`;
        const exceedsLimit = diff > compareStatsMaxSizeLimitBytes;
        diffReport[key] = { before: b, after: a, diff, diffLabel, exceedsLimit, maxLimit: compareStatsMaxSizeLimitBytes };
        if (exceedsLimit) {
            someLimitExceeded = true;
        }
    });
    console.table(diffReport);
    if (throwErrIfLimitExceeds && someLimitExceeded) {
        logger.error(`Max bundle size limit exceeded!`);
        process.exit(1);
    }
}

/**
 * Generate report which contains bundle size.
 * More specifically, it does the following:
 * - Build react app from the local UUI template. All local UUI dependencies will be symlinked to this app.
 * - Build the app to generate bundles.
 * - Use source-map-explorer to collect total size of all js bundles.
 * - Generate report at: ./.reports/collect-bundle-stats.json
 */
async function collectBundleStats() {
    await runSimpleWorkflow([
        checkAllModulesAreBuilt,
        createCraFromUuiTemplate,
        symlinkAppDependencies,
        fixCraConfig,
        buildApp,
        generateBundleSizeReport,
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
            logger.info(``)
            const f = arr[i];
            await logTimeTook(f);
        }
    }
    await logTimeTook(fn, 'main');
}

async function checkAllModulesAreBuilt() {
    const { isBuilt } = isAllLocalDependenciesBuilt();
    if (!isBuilt) {
        runYarnScriptFromRootSync('build-modules-ignore-app');
    }
}

async function createCraFromUuiTemplate() {
    if (fs.existsSync(appTargetDirResolved)) {
        fs.rmdirSync(appTargetDirResolved, { recursive: true });
    }
    runCmdFromRootSync(CLI.createAppFromTemplate.cmd, CLI.createAppFromTemplate.args);
}

async function symlinkAppDependencies() {
    // 1. get list of dependencies which can be symlinked to local folders
    const { dependencies, devDependencies } = readPackageJsonContentSync(appTargetDirResolved);
    const potentiallyLocalDeps = Object.keys({ ...dependencies, ...devDependencies }).filter(n => n.indexOf(epamPrefix) === 0);

    // 2. check whether we have any local dependencies with same names and symlink them if so.
    const allLocalPackages = getAllMonorepoPackages();
    const localDepsToBeSymlinked = potentiallyLocalDeps.reduce((acc, name) => {
        const loc = allLocalPackages[name];
        if (loc) {
            acc.push(loc);
        }
        return acc;
    }, []);

    // 3. create actual symlinks
    localDepsToBeSymlinked.forEach(({ name, moduleRootDir }) => {
        const dirName = path.resolve(moduleRootDir, './build');
        const cmd = 'npm';
        const cwd = appTargetDirResolved;
        runCmdSync({ cmd, cwd, args: ['link', dirName, '--save'] });
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

async function generateBundleSizeReport() {
    const result = await SourceMapExplorer.explore(collectBundleStatsFrom, { output: { format: 'json' } });
    const bytes = result.bundles.reduce((acc, { totalBytes }) => {
        return acc + totalBytes;
    }, 0);
    const report = {
        [uuiCraTemplateAppBundleSizeKey]: bytes,
    };
    console.table(report);
    createFileSync(reportPathResolved, JSON.stringify(report, undefined, 2));
    logger.info(`Report generated at: "${reportPathResolved}".`)
}
