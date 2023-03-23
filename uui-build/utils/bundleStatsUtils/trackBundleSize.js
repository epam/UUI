/**
 * This script is used for bundle size tracking to prevent accidental bundle size regression.
 * The generated reports can be compared with each other in order to detect any regression in bundle size.
 */
const { logger } = require('../loggerUtils.js');
const { createFileSync, readJsonFileSync } = require('../fileUtils.js');
const { isAllLocalDependenciesBuilt,
    getAllMonorepoPackages
} = require('../monorepoUtils');
const path = require('path');
const fs = require('fs');
const SourceMapExplorer = require('source-map-explorer');
const { readPackageJsonContentSync } = require('../packageJsonUtils');
const { runYarnScriptFromRootSync,
    runCmdFromRootSync,
    runCmdSync
} = require('../cmdUtils.js');
const { uuiRoot } = require('../constants.js');
const {
    APP_TARGET_DIR,
    BASE_LINE_PATH,
    COLLECT_SIZE_GLOB,
    APP_TEMPLATE_DIR,
    TEMPLATE_APP_TARGET_DIR,
    COMPARISON_THRESHOLD_PERCENTAGE,
    TRACK_BUNDLE_SIZE_REPORT_MD,
} = require('./bundleStatsConstants.js');
const {isRollupModule} = require("../moduleBuildUtils");


const epamPrefix = '@epam/';
const appTargetDirResolved = path.resolve(uuiRoot, TEMPLATE_APP_TARGET_DIR);
const webpackConfigResolved = path.resolve(appTargetDirResolved, 'node_modules/react-scripts/config/webpack.config.js');
const webpackPatch = { replaceWhat: 'resolve: {', replaceTo: 'resolve: {symlinks: false,'};
const CLI = {
    buildApp: { cmd: 'npm', args: ['run', 'build'] },
    createAppFromTemplate: { cmd: 'npx', args: ['create-react-app', TEMPLATE_APP_TARGET_DIR, '--template', `file:${APP_TEMPLATE_DIR}`] },
};


module.exports = { trackBundleSize }

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
        runYarnScriptFromRootSync('build-modules');
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


function normalizeSizeNumber(num) {
    return Number(Number(num).toFixed(2));
}
async function measureBundleSizeKBytes(globPattern) {
    const result = await SourceMapExplorer.explore(globPattern, { output: { format: 'json' }, noBorderChecks: true });
    const bytes = result.bundles.reduce((acc, { totalBytes }) => {
        return acc + totalBytes;
    }, 0);
    return normalizeSizeNumber(bytes / 1024);
}

async function compareWithBaseLine(params) {
    const { overrideBaseline } = params || {};
    const app = await measureBundleSizeKBytes(`${path.resolve(uuiRoot, APP_TARGET_DIR)}/${COLLECT_SIZE_GLOB.APP}`);
    const templateApp = await measureBundleSizeKBytes(`${path.resolve(uuiRoot, TEMPLATE_APP_TARGET_DIR)}/${COLLECT_SIZE_GLOB.APP}`);
    const allLocalPackages = getAllMonorepoPackages();

    const moduleBundleSizesPromises = Object.keys(allLocalPackages)
        .filter((name) => {
            return isRollupModule(allLocalPackages[name].moduleRootDir)
        })
        .map(name => {
            return measureBundleSizeKBytes(`${allLocalPackages[name].moduleRootDir}/${COLLECT_SIZE_GLOB.MODULE}`)
                .then(size => {
                    return { name, size };
                }).catch(console.error);
        });

    const moduleBundleSizes = await Promise.all(moduleBundleSizesPromises);
    const moduleBundleSizesMap = moduleBundleSizes.reduce((acc, { name, size }) => {
        acc[name] = size;
        return acc;
    }, {});

    const timestamp = new Date().toISOString();
    const nextBaseline = {
        description: 'Size is specified in Kb',
        timestamp,
        baseline: {
            templateApp,
            ['@epam/app']: app,
            ...moduleBundleSizesMap,
        },
    };
    console.table(nextBaseline.baseline);
    const pathResolved = path.resolve(uuiRoot, BASE_LINE_PATH);
    if (overrideBaseline) {
        createFileSync(pathResolved, JSON.stringify(nextBaseline, undefined, 2));
        logger.info(`New baseline generated at: "${pathResolved}".`)
    } else {
        const prevBaseline = readJsonFileSync(pathResolved);
        const comparisonResult = Object.keys(nextBaseline.baseline).reduce((acc, name) => {
            const prevSize = prevBaseline.baseline[name];
            const newSize = nextBaseline.baseline[name];
            const pcNorm = COMPARISON_THRESHOLD_PERCENTAGE/100;
            const threshold = [normalizeSizeNumber(prevSize * (1 - pcNorm)), normalizeSizeNumber(prevSize * (1 + pcNorm))];
            const thresholdLabel = `${threshold[0]} - ${threshold[1]}`;
            const diff = newSize - prevSize;
            const sign = diff > 0 ? '+' : '';
            const diffLabel = `${sign}${diff} (Kb)`;
            const exceedsThreshold = newSize > threshold[1] || newSize < threshold[0];
            acc[name] = {
                prevSize,
                newSize,
                diffLabel,
                exceedsThreshold,
                thresholdLabel,
                threshold,
            };
            return acc;
        }, {});
        const comparisonResultMd = formatMdTable(
            comparisonResult,
            ['prevSize', 'newSize', 'diffLabel', 'exceedsThreshold', 'thresholdLabel'],
            (h) => {
                if (h === 'diffLabel') {
                    return 'diff';
                }
                if (h === 'thresholdLabel') {
                    return `threshold (min - max)`;
                }
                return h;
            },
            (h, v) => {
                if (h === 'exceedsThreshold') {
                    return v ? ':heavy_exclamation_mark: yes :heavy_exclamation_mark:' : 'no';
                }
                return v;
            },
        );
        console.table(comparisonResult);
        const crPathResolved = path.resolve(uuiRoot, TRACK_BUNDLE_SIZE_REPORT_MD);
        createFileSync(crPathResolved, comparisonResultMd);
        logger.info(`Comparison result generated at: "${crPathResolved}".`);
    }
}


function formatMdTable(obj, attrs, formatHeader = (h) => h, formatValue = (h, v) => v) {
    const header = '|' + attrs.map(formatHeader).join('|') + '|';
    const headerSep = '|' + attrs.map(() => ':-----:').join('|') + '|';
    const rows = Object.keys(obj).reduce((acc, rowId) => {
        const rowContent = attrs.map(a => {
            return formatValue(a, obj[rowId][a]);
        }).join('|');
        acc.push(`|${rowContent}|`);
        return acc;
    }, []);
    return `${header}\n${headerSep}\n${rows.join('\n')}`;
}
