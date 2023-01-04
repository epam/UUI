const { getConfig } = require('./rollup.config')
const rollup = require('rollup')

module.exports = { buildUsingRollup };

async function buildUsingRollup({ moduleRootDir, moduleIndexFile }) {
    const cfg = await getConfig({ moduleRootDir, moduleIndexFile });
    const { output: outputConfig, ...inputConfig } = cfg[0];
    let bundle;
    try {
        bundle = await rollup.rollup({ ...inputConfig });
        await Promise.all(outputConfig.map(bundle.write));
    } catch (error) {
        console.error(error);
        process.exit(1);
    } finally {
        bundle && await bundle.close();
    }
}
