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
    return pkgs.reduce((acc, p) => {
        folders.forEach(f => {
            const e = escapeForRegex(path.join(path.sep, p, f))
            acc.push(new RegExp(e))
        })
        return acc
    }, [])
}


module.exports = {
    getPkgFoldersRegexMatcher,
}
