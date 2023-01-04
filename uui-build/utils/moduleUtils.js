const fs = require("fs");
const path = require("path");

module.exports = { getModuleNameFromModuleRootDir, assertRunFromModule, getWorkspaceFoldersNames, getMonorepoPackagesDirs, readPackageJsonContent }

function readPackageJsonContent(dir) {
    const s = fs.readFileSync(path.resolve(dir, 'package.json')).toString('utf-8');
    return JSON.parse(s)
}

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
        const { workspaces: { packages } } = readPackageJsonContent(uuiRoot)
        _readPackagesCache = packages;
    }
    return _readPackagesCache
}

/**
 * Returns map of package name to its root dir.
 */
function getMonorepoPackagesDirs({ uuiRoot }) {
    const pkgDirs = getWorkspaceFoldersNames({ uuiRoot });
    return pkgDirs.reduce((acc, dirName) => {
        const dirPath = path.resolve(uuiRoot, dirName);
        const { name } = readPackageJsonContent(dirPath);
        acc[name] = dirPath;
        return acc;
    }, {});
}
