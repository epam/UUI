const {runCliCommand} = require("../utils/cmdUtils");
const {getWorkspaceFoldersNames} = require("../utils/moduleUtils");
const path = require('path');
const fs = require('fs');

const uuiRoot = path.resolve('../../.');

const EXCLUDE_DIRS = ['app', 'uui-build'];
const PACK_DESTINATION = path.resolve(uuiRoot, '../uui_packaged_modules/modules');

function getPackDestinationDir() {
    const destRoot = path.resolve(uuiRoot, '../uui_packaged_modules');
    if (fs.existsSync(destRoot)) {
        fs.rmdirSync(destRoot, { recursive: true })
    }
    fs.mkdirSync(destRoot);
    const ts = new Date().getTime()
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
            console.info(`npm pack success. "${cwd}".`);
            packageJsonDeps[name] = path.resolve(dest, getPkgArchiveFileName(pj))
        }).catch((err) => {
            console.error(`npm pack error. "${cwd}".`)
            console.error(err)
        });
    });
    await Promise.all(promises);
    console.log(JSON.stringify(packageJsonDeps, undefined, 2));
}

main();
