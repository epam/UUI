const path = require("path");
const { getBabelProcessedFolders } = require("./utils/packageUtils");
const { normSlashes } = require("./utils/configUtils");
const { assertRunFromModule } = require("../../uui-build/utils/moduleUtils");

const makeAbsolute = pathStr => path.resolve(UUI_ROOT, pathStr)

/** Assumption: the cwd is ./app/ folder. */
assertRunFromModule('app');

const UUI_ROOT = path.resolve(normSlashes('../'));

const BABEL_INCLUDED_REGEXP = getBabelProcessedFolders({ uuiRoot: UUI_ROOT, isIncluded: true });
const BABEL_EXCLUDED_REGEXP = getBabelProcessedFolders({ uuiRoot: UUI_ROOT, isIncluded: false });

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
