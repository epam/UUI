const path = require('path');
const escapeForRegex = require('escape-string-regexp');
const { getAllLocalDependenciesInfo, isAllLocalDependenciesBuilt } = require('../../../uui-build/utils/monorepoUtils');
const { logger } = require('../../../uui-build/utils/loggerUtils');

const APP_NAME = '@epam/app';

module.exports = { getBabelProcessedFolders, assertAppDepsAreBuilt };

function absoluteDirPathToRelativeRegex({ uuiRoot, dirPath }) {
    const basePath = path.resolve(uuiRoot, '..');
    const relative = dirPath.substring(basePath.length);
    const escaped = escapeForRegex(relative);
    return new RegExp(escaped);
}

function absoluteDirPathsToRelativeRegexes({ uuiRoot, dirPathArr }) {
    return dirPathArr.map((dirPath) => absoluteDirPathToRelativeRegex({ uuiRoot, dirPath }));
}

function getRelativeRegexesForNestedDirs({ uuiRoot, dirPathArr, nestedDirsArr }) {
    return dirPathArr.reduce((acc, d) => {
        nestedDirsArr.forEach((nested) => {
            const dirPath = path.resolve(d, nested);
            const re = absoluteDirPathToRelativeRegex({ uuiRoot, dirPath });
            acc.push(re);
        });
        return acc;
    }, []);
}

function getBabelProcessedFolders({ uuiRoot }) {
    const depsRootDirs = getAllLocalDependenciesInfo(APP_NAME).map((i) => i.moduleRootDir);

    return {
        // It for the use case when sources of each "@epam/*" packages is used.
        // I.e.: all sources of all dependencies are build together with "@epam/app" as a single app.
        // Here, we include everything except for a couple of folders.
        DEPS_SOURCES: {
            INCLUDE: absoluteDirPathsToRelativeRegexes(
                { uuiRoot, dirPathArr: depsRootDirs },
            ),
            EXCLUDE: getRelativeRegexesForNestedDirs(
                { uuiRoot, dirPathArr: depsRootDirs, nestedDirsArr: ['build', 'node_modules'] },
            ),
        },
    };
}

function assertAppDepsAreBuilt() {
    const { isBuilt, modulesNotBuilt } = isAllLocalDependenciesBuilt(APP_NAME);
    if (!isBuilt) {
        logger.error(`It's necessary to build next modules before starting build of "${APP_NAME}": \n${modulesNotBuilt.join('\n')}`);
        throw new Error('Some dependencies are not built.');
    }
}
