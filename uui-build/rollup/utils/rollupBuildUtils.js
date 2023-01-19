const { getConfig } = require('../rollup.config')
const rollup = require('rollup');
const { cleanupTsConfigFile, getTsConfigFile } = require("./moduleTsConfigUtils");

module.exports = { buildUsingRollup };

async function buildUsingRollup({ moduleRootDir, moduleIndexFile }) {
    const tsconfigFile = getTsConfigFile(moduleRootDir);
    const cfg = await getConfig({ moduleRootDir, moduleIndexFile, tsconfigFile });
    const { output: outputConfig, ...inputConfig } = cfg[0];
    let bundle;
    const cleanup = async () => {
        bundle && await bundle.close();
        cleanupTsConfigFile(moduleRootDir);
    };
    try {
        bundle = await rollup.rollup({ ...inputConfig });
        await Promise.all(outputConfig.map(bundle.write));
    } catch (error) {
        console.error(error);
        process.exit(1);
    } finally {
        await cleanup();
    }
}
