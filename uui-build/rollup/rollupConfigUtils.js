const fs = require("fs");
const path = require("path");
const DEPS_ALWAYS_BUNDLED = ["@epam/assets"]

module.exports = { getExternalDeps, getTsConfigFile }

function getModuleDepsProd(moduleRootDir) {
    const packageJsonPath = path.resolve(moduleRootDir, "package.json");
    const pkg = fs.readFileSync(packageJsonPath).toString();
    const json = JSON.parse(pkg);
    // json.devDependencies is not added here, because it cannot be specified as external one.
    return Object.keys({ ...json.dependencies, ...json.peerDependencies });
}

function getExternalDeps(moduleRootDir) {
    const allKeys = getModuleDepsProd(moduleRootDir)
    const keys = allKeys.filter(key => {
        return !DEPS_ALWAYS_BUNDLED.find(sb => sb === key);
    });
    return id => {
        return keys.some(k => {
            // subfolders of external package are also external.
            return k === id || id.indexOf(`${k}/`) === 0
        })
    }
}

function getTsConfigFile(moduleRootDir) {
   ensureModuleHasTsConfig(moduleRootDir);
   return path.resolve(moduleRootDir, './.tsconfig.json')
}

function ensureModuleHasTsConfig(moduleRootDir) {
    const tsconfig = path.resolve(moduleRootDir, "./.tsconfig.json");
    fs.writeFileSync(
        tsconfig,
        JSON.stringify({
            extends: "../tsconfig.json",
            exclude: [
                "**/__tests__",
                "./build",
                "./node_modules",
            ],
        },undefined,2),
    );
}
