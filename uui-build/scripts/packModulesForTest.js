/**
 * The only purpose of this file is to do some local testing of packaged modules.
 * The output will be located next to the UUI repo root inside "packModulesForTest-output" folder.
 */
const { runCmdSync } = require('../utils/cmdUtils');
const { getAllMonorepoPackages } = require('../utils/monorepoUtils');
const { logger } = require('../utils/loggerUtils');
const { uuiRoot } = require('../utils/constants');
const path = require('path');
const fs = require('fs');

const destRootArg = './../packModulesForTest-output';

const EXCLUDED_PACKAGES = ['@epam/app'];

function getPackDestinationDir() {
    // must be relative to root.
    const destRoot = path.resolve(uuiRoot, destRootArg);
    if (fs.existsSync(destRoot)) {
        fs.rmdirSync(destRoot, { recursive: true });
    }
    fs.mkdirSync(destRoot);
    const ts = new Date().getTime(); // use timestamp for folder name to avoid issues with npm caching.
    const dest = path.resolve(destRoot, `./${ts}`);
    fs.mkdirSync(dest);
    return dest;
}

function getPkgArchiveFileName(pkg) {
    const { version, name } = pkg;
    return `${name.replace('/', '-').replace('@', '')}-${version}.tgz`;
}

/**
 * @param moduleRootDir
 * @param packDestination
 * @returns full path to the tgz archive.
 */
async function npmPackSingleModule({ pkg, packDestination }) {
    const { moduleRootDir } = pkg;
    const cwd = path.resolve(moduleRootDir, './build');
    await runCmdSync({ cmd: 'npm pack ', cwd, args: [`--pack-destination=${packDestination}`] });
    return path.resolve(packDestination, getPkgArchiveFileName(pkg));
}

async function main() {
    const packDestination = getPackDestinationDir();
    const allPackages = Object.values(getAllMonorepoPackages()).filter((d) => !EXCLUDED_PACKAGES.find((e) => e === d.name));

    const packageJsonDeps = {};
    const promises = allPackages.map(async (pkg) => {
        try {
            packageJsonDeps[pkg.name] = await npmPackSingleModule({ pkg, packDestination });
        } catch (err) {
            packageJsonDeps[pkg.name] = 'err!';
            logger.error(`pack error. "${pkg.name}".`);
            logger.error(err);
        }
    });
    await Promise.all(promises);
    const deps = JSON.stringify(packageJsonDeps, undefined, 2);
    console.info(["You can copy the dependencies to your app's package.json for testing.", deps].join('\n'));
}

main();
