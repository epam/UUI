const fs = require('fs');
const path = require('path');

module.exports = { getExternalDeps };

/**
 * This is specific for UUI monorepo.
 * @type {string[]}
 */
const DEPS_ALWAYS_BUNDLED_UUI = ['@epam/assets'];

/**
 * This is specific for UUI monorepo.
 *
 * @param externalSubFolderImport
 * @returns {boolean}
 */
const getIsExternalSubFolderBundledUUI = (externalSubFolderImport) => {
    /**
     * Sub-folders of "external" package are also external.
     * Exception:
     *      When module imports from "@epam/<module-name>/assets/" folder.
     *      We need to bundle this dependency in such case.
     */
    const epamModuleAssetsRegex = new RegExp('@epam/[^/]+/assets/.+');
    return epamModuleAssetsRegex.test(externalSubFolderImport);
};

/**
 * Returns a callback which tells Rollup whether specific import should be included into bundle or not.
 *
 * @param params
 * @param params.moduleRootDir
 * @param params.depsAlwaysBundled - array of module names (names which are specified in package.json)
 * @param params.getIsExternalSubFolderBundled - callback which tells whether sub-folder of external dependency must be included into the bundle.
 *
 * @returns callback, which returns: "true" - to exclude from bundle, or "false" - to include to bundle.
 */
function getExternalDeps(params) {
    const { moduleRootDir, depsAlwaysBundled = DEPS_ALWAYS_BUNDLED_UUI, getIsExternalSubFolderBundled = getIsExternalSubFolderBundledUUI } = params;
    const keysExternal = getExternalModuleDependencies({ moduleRootDir, depsAlwaysBundled });
    return (importId) => {
        return keysExternal.some((keyExternal) => {
            return keyExternal === importId || (importId.indexOf(`${keyExternal}/`) === 0 && !getIsExternalSubFolderBundled(importId));
        });
    };
}

function getExternalModuleDependencies({ moduleRootDir, depsAlwaysBundled }) {
    const packageJsonPath = path.resolve(moduleRootDir, 'package.json');
    const pkg = fs.readFileSync(packageJsonPath).toString();
    const json = JSON.parse(pkg);
    // json.devDependencies is not added here, because it cannot be specified as external one.
    const allKeys = Object.keys({ ...json.dependencies, ...json.peerDependencies });
    return allKeys.filter((key) => {
        return !depsAlwaysBundled || !depsAlwaysBundled.find((sb) => sb === key);
    });
}
