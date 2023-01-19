const fs = require("fs");
const path = require("path");

module.exports = { getTsConfigFile, cleanupTsConfigFile }

const MODULE_TSCONFIG_PATH = './.tsconfig.json';

function getTsConfigFile(moduleRootDir) {
    function ensureModuleHasTsConfig(moduleRootDir) {
        const tsconfig = path.resolve(moduleRootDir, MODULE_TSCONFIG_PATH);
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
    ensureModuleHasTsConfig(moduleRootDir);
    return path.resolve(moduleRootDir, MODULE_TSCONFIG_PATH)
}

function cleanupTsConfigFile(moduleRootDir) {
    const tsconfig = path.resolve(moduleRootDir, MODULE_TSCONFIG_PATH);
    if (fs.existsSync(tsconfig)) {
        fs.rmSync(tsconfig)
    }
}
