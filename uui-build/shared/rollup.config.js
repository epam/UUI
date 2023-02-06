/**
 * Creates shared rollup config with default settings.
 */
const { createRollupConfigForModule } = require('../rollup/rollup.config');
const { beforeRollupBuild } = require("../utils/moduleBuildUtils");

module.exports = {
    default: async () => {
        const moduleRootDir = process.cwd();
        const packageJsonTransform = content => {
            content.main = 'index.js';
        };
        await beforeRollupBuild({ moduleRootDir, packageJsonTransform });
        return await createRollupConfigForModule({ moduleRootDir, indexFileRelativePath: "index.tsx" });
    }
}
