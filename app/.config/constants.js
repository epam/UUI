const path = require("path");
const { getPkgFoldersRegexMatcher } = require("./utils/packageUtils");
const { normSlashes } = require("./utils/configUtils");
const escapeForRegex = require("escape-string-regexp");

const makeAbsolute = pathStr => path.resolve(UUI_ROOT, pathStr)

/** Assumption: the cwd is ./app/ folder. */
const UUI_ROOT = path.resolve(normSlashes('../'));

/**
 * Folders which babel should include from each module
 * @type {string[]}
 */
const PKG_FOLDERS_BABEL_INCLUDED = ['']
/**
 * Folders which babel should exclude from each module
 * @type {string[]}
 */
const PKG_FOLDERS_BABEL_EXCLUDED = ['build', 'node_modules']
//
const BABEL_INCLUDED_REGEXP = getPkgFoldersRegexMatcher({ uuiRoot: UUI_ROOT,  folders: PKG_FOLDERS_BABEL_INCLUDED })
const BABEL_EXCLUDED_REGEXP = getPkgFoldersRegexMatcher({ uuiRoot: UUI_ROOT,  folders: PKG_FOLDERS_BABEL_EXCLUDED })
const CSS_URL_ROOT_PATH = makeAbsolute(normSlashes('app/public'));

// ignore all node_modules unless their names start with "@epam"
const DEV_SERVER_WATCHER_IGNORED_REGEXP = /[\\\/]node_modules[\\\/](?!@epam[\\\/]).+/
//
// see this discussion for details https://github.com/facebook/create-react-app/discussions/11767
const LIBS_WITHOUT_SOURCE_MAPS = [
    /node_modules[\\\/]codesandbox/g,
    /node_modules[\\\/]@mercuriya/g,
]
const VFILE_SPECIAL_CASE_REGEX = /[\\\/]node_modules[\\\/]vfile[\\\/]core\.js/;

module.exports = {
    BABEL_INCLUDED_REGEXP,
    BABEL_EXCLUDED_REGEXP,
    CSS_URL_ROOT_PATH,
    DEV_SERVER_WATCHER_IGNORED_REGEXP,
    LIBS_WITHOUT_SOURCE_MAPS,
    VFILE_SPECIAL_CASE_REGEX,
};
