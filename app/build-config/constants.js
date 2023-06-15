const path = require('path');
const { getBabelProcessedFolders } = require('./utils/appDepsUtils');
const { makeSlashesPlatformSpecific } = require('./utils/configUtils');
const { assertRunFromModule } = require('../../uui-build/utils/monorepoUtils');
const { uuiRoot } = require('../../uui-build/utils/constants');
const { getUuiVersion } = require('../../uui-build/utils/monorepoUtils');

const makeAbsolute = (pathStr) => path.resolve(uuiRoot, pathStr);

/** Assumption: the cwd is ./app/ folder. */
assertRunFromModule('app');

const DIRS_FOR_BABEL = getBabelProcessedFolders({ uuiRoot });
const ENTRY_WITH_EXTRACTED_DEPS_CSS = path.resolve(uuiRoot, 'app/src/index.build.tsx');

const CSS_URL_ROOT_PATH = makeAbsolute(makeSlashesPlatformSpecific('app/public'));

// ignore all node_modules unless their names start with "@epam"
const DEV_SERVER_WATCHER_IGNORED_REGEXP = /[\\/]node_modules[\\/](?!@epam[\\/]).+/;
//
// see this discussion for details https://github.com/facebook/create-react-app/discussions/11767
const LIBS_WITHOUT_SOURCE_MAPS = [/node_modules[\\/]codesandbox/g, /node_modules[\\/]@mercuriya/g];

const UUI_VERSION = getUuiVersion();

module.exports = {
    UUI_VERSION,
    ENTRY_WITH_EXTRACTED_DEPS_CSS,
    DIRS_FOR_BABEL,
    CSS_URL_ROOT_PATH,
    DEV_SERVER_WATCHER_IGNORED_REGEXP,
    LIBS_WITHOUT_SOURCE_MAPS,
};
