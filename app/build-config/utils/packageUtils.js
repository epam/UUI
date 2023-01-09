const path = require("path");
const escapeForRegex = require("escape-string-regexp");
const { getMonorepoPackagesDirs, readPackageJsonContent } = require("../../../uui-build/utils/moduleUtils");

module.exports = { getBabelProcessedFolders };

function getMonorepoDepsDirs({ uuiRoot }) {
    // 1. read app's package.json and take all deps
    const pkg = readPackageJsonContent(path.resolve(uuiRoot, './app'));
    const depsMap = pkg.dependencies;
    // 2. resolve root dir for every dep from previous step.
    const dirsMap = getMonorepoPackagesDirs({ uuiRoot });
    // Get only those deps which are part of our monorepo.
    const monorepoDepsNames = Object.keys(dirsMap).filter(n => !!depsMap[n]);
    return monorepoDepsNames.reduce((acc, n) => {
        acc[n] = dirsMap[n];
        return acc;
    }, {});
}

function absoluteDirPathToRelativeRegex({ uuiRoot, dirPath }) {
    const basePath = path.resolve(uuiRoot, '..');
    const relative = dirPath.substring(basePath.length);
    const escaped = escapeForRegex(relative);
    return new RegExp(escaped);
}

function absoluteDirPathsToRelativeRegexes({ uuiRoot, dirPathArr }) {
    return dirPathArr.map(dirPath => absoluteDirPathToRelativeRegex({ uuiRoot, dirPath }));
}

function getRelativeRegexesForNestedDirs({ uuiRoot, dirPathArr, nestedDirsArr }) {
    return dirPathArr.reduce((acc, d) => {
        nestedDirsArr.forEach(nested => {
            const dirPath = path.resolve(d, nested);
            const re = absoluteDirPathToRelativeRegex({ uuiRoot, dirPath })
            acc.push(re);
        })
        return acc;
    }, [])
}

function getBabelProcessedFolders({ uuiRoot }) {
    const depsRootDirs = Object.values(getMonorepoDepsDirs({ uuiRoot }));
    const result = {
        // DEV: when sources of each "@epam/*" packages is used.
        // This is when we built all sources of all dependencies as a single app.
        // Here, we include everything except a couple of folders.
        DEV: {
            INCLUDE: absoluteDirPathsToRelativeRegexes(
                { uuiRoot, dirPathArr: depsRootDirs }),
            EXCLUDE: getRelativeRegexesForNestedDirs(
                { uuiRoot, dirPathArr: depsRootDirs, nestedDirsArr: ['build', 'node_modules'] }),
        },
        // BUILD: When only "build" and "assets" folders of each "@epam/*" packages is used.
        // Here, we only include a couple of specific folders from each dep.
        BUILD: {
            INCLUDE: getRelativeRegexesForNestedDirs(
                { uuiRoot, dirPathArr: depsRootDirs, nestedDirsArr: ['build', 'assets'] }),
            EXCLUDE: [],
        }
    };

    return result;
}
