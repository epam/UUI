const fs = require('fs');
const path = require('path');

module.exports = { getTsConfigFile };

const MODULE_TSCONFIG_PATH = './tsconfig.json';

function getTsConfigFile(moduleRootDir) {
    function ensureModuleHasTsConfig() {
        const tsconfig = path.resolve(moduleRootDir, MODULE_TSCONFIG_PATH);
        if (!fs.existsSync(tsconfig)) {
            throw new Error(`Unable to find tsconfig: ${tsconfig}.`);
        }
    }
    ensureModuleHasTsConfig();
    return path.resolve(moduleRootDir, MODULE_TSCONFIG_PATH);
}
