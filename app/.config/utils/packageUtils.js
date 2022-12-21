const fs = require("fs");
const path = require("path");
const escapeForRegex = require("escape-string-regexp");

let _readPackagesCache;
function readPackages({ uuiRoot }) {
    if (!_readPackagesCache) {
        const s = fs.readFileSync(path.resolve(uuiRoot, `.${path.sep}package.json`)).toString('utf-8')
        const sParsed = JSON.parse(s)
        _readPackagesCache = sParsed.workspaces.packages;
    }
    return _readPackagesCache
}
/**
 * Returns array of relative regexes for each folder in each package.
 * @returns array
 */
function getPkgFoldersRegexMatcher({ uuiRoot, folders }) {
    const pkgs = readPackages({ uuiRoot });
    return pkgs.reduce((acc, pkg) => {
        return acc.concat(getSinglePkgFolderRegexMatcher({ pkg, folders }))
    }, [])
}

function getSinglePkgFolderRegexMatcher({ pkg, folders }) {
    const acc = [];
    folders(pkg).forEach(f => {
        const e = escapeForRegex(path.join(path.sep, pkg, f))
        acc.push(new RegExp(e))
    })
    return acc;
}
function getBabelProcessedFolders({ uuiRoot, isIncluded }) {
    /**
     * Folders which babel should include from each module
     */
    const PKG_FOLDERS_BABEL_INCLUDED = ['']
    const PKG_FOLDERS_BABEL_INCLUDED_BUILD = ['build', 'assets']
    /**
     * Folders which babel should exclude from each module
     */
    const PKG_FOLDERS_BABEL_EXCLUDED = ['build', 'node_modules']
    const PKG_FOLDERS_BABEL_EXCLUDED_BUILD = ['node_modules']

    const getFoldersFn = isUseBuildFolderOfDeps => pkg => {
        if (isIncluded) {
            if (isUseBuildFolderOfDeps) {
                if (['app', 'epam-assets'].indexOf(pkg) !== -1) {
                    return PKG_FOLDERS_BABEL_INCLUDED
                }
                return PKG_FOLDERS_BABEL_INCLUDED_BUILD
            }
            return PKG_FOLDERS_BABEL_INCLUDED;
        }
        if (isUseBuildFolderOfDeps) {
            return PKG_FOLDERS_BABEL_EXCLUDED_BUILD;
        }
        return PKG_FOLDERS_BABEL_EXCLUDED;
    }
    const DEFAULT = getPkgFoldersRegexMatcher({ uuiRoot,  folders: getFoldersFn(false) });
    const BUILD_FOLDERS = getPkgFoldersRegexMatcher({ uuiRoot,  folders: getFoldersFn(true) });
    return { DEFAULT, BUILD_FOLDERS }
}

module.exports = {
    getBabelProcessedFolders,
}
