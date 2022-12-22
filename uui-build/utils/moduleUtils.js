const fs = require("fs");
const path = require("path");

module.exports = { getModuleNameFromModuleRootDir, assertRunFromModule, getWorkspaceFoldersNames }

function getModuleNameFromModuleRootDir(moduleRootDir) {
    const rootTokens = moduleRootDir.split(/[\\/]/);
    return rootTokens[rootTokens.length - 1]
}

function assertRunFromModule(expectedModuleName) {
    const moduleName = getModuleNameFromModuleRootDir(process.cwd());
    if (moduleName !== expectedModuleName) {
        throw new Error(`This script is designed to be run from the "${expectedModuleName}" module.`)
    }
}

let _readPackagesCache;
function getWorkspaceFoldersNames({ uuiRoot }) {
    if (!_readPackagesCache) {
        const s = fs.readFileSync(path.resolve(uuiRoot, `package.json`)).toString('utf-8')
        const sParsed = JSON.parse(s)
        _readPackagesCache = sParsed.workspaces.packages;
    }
    return _readPackagesCache
}
