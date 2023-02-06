/**
 * Creates shared rollup config with default settings.
 */
const { createRollupConfigForModule } = require('../rollup/rollup.config');

module.exports = {
    default: async () => {
        return await createRollupConfigForModule({ indexFileRelativePath: "index.tsx" });
    }
}
