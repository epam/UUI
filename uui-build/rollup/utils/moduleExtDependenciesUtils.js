const fs = require("fs");
const path = require("path");

module.exports = { getExternalDeps };

const DEPS_ALWAYS_BUNDLED = ["@epam/assets"]

function isImportFromEpamModuleAssets(importId) {
    const epamModuleAssetsRegex = new RegExp('@epam/[^/]+/assets/.+');
    return epamModuleAssetsRegex.test(importId)
}

function getExternalDeps(moduleRootDir) {
    const allKeys = getModuleDepsProd(moduleRootDir)
    const keysExternal = allKeys.filter(key => {
        return !DEPS_ALWAYS_BUNDLED.find(sb => sb === key);
    });
    return importId => {
        return keysExternal.some(keyExternal => {
            /**
             * Sub-folders of "external" package are also external.
             * Exception:
             *      When module imports from "@epam/<module-name>/assets/" folder.
             *      We need to bundle this dependency in such case.
             */
            return keyExternal === importId ||
                (importId.indexOf(`${keyExternal}/`) === 0 && !isImportFromEpamModuleAssets(importId));
        })
    }
}

function getModuleDepsProd(moduleRootDir) {
    const packageJsonPath = path.resolve(moduleRootDir, "package.json");
    const pkg = fs.readFileSync(packageJsonPath).toString();
    const json = JSON.parse(pkg);
    // json.devDependencies is not added here, because it cannot be specified as external one.
    return Object.keys({ ...json.dependencies, ...json.peerDependencies });
}
