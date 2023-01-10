/**
 * The only purpose of this file is to do some local testing of packaged modules.
 * The output will be located next to the UUI repo root inside "packModulesForTest-output" folder.
 */
const {runCliCommand} = require("../utils/cmdUtils");
const {getWorkspaceFoldersNames} = require("../utils/monorepoUtils");
const {logger} = require("../utils/loggerUtils");
const path = require('path');
const fs = require('fs');

const destRootArg = './../packModulesForTest-output';
const uuiRoot = path.resolve('./../..');

const EXCLUDE_DIRS = ['app', 'uui-build'];

function getPackDestinationDir() {
    // must be relative to root.
    const destRoot = path.resolve(uuiRoot, destRootArg);
    if (fs.existsSync(destRoot)) {
        fs.rmdirSync(destRoot, { recursive: true })
    }
    fs.mkdirSync(destRoot);
    const ts = new Date().getTime(); // use timestamp for folder name to avoid issues with npm caching.
    const dest = path.resolve(destRoot, `./${ts}`);
    fs.mkdirSync(dest);
    return dest;
}

function getPkgArchiveFileName(pj) {
    const { version, name } = pj;
    return `${name.replace('/', '-').replace('@', '')}-${version}.tgz`
}

async function main() {
    const dest = getPackDestinationDir();
    const dirs = getWorkspaceFoldersNames({ uuiRoot });
    const dirsFiltered = dirs.filter(d => !EXCLUDE_DIRS.find(e => e === d));

    const packageJsonDeps = {};
    const promises = dirsFiltered.map(d => {
        const cwd = path.resolve(uuiRoot, d, './build');
        const pj = JSON.parse(fs.readFileSync(path.resolve(cwd, 'package.json')));
        const { name } = pj;
        return runCliCommand(cwd, `npm pack --pack-destination=${dest}`).then(() => {
            logger.success(`npm pack success. "${cwd}".`);
            packageJsonDeps[name] = path.resolve(dest, getPkgArchiveFileName(pj))
        }).catch((err) => {
            packageJsonDeps[name] = 'err!'
            logger.error(`npm pack error. "${cwd}".`)
            logger.error(err)
        });
    });
    await Promise.all(promises);
    const deps = JSON.stringify(packageJsonDeps, undefined, 2)
    console.info(['You can copy the dependencies to your app\'s package.json for testing.', deps].join('\n'));
}

main();
