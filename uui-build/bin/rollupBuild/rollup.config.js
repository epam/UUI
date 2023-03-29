/**
 * Creates shared rollup config with default settings.
 */
const { createRollupConfigForModule } = require('../../rollup/rollup.config.js');

module.exports = {
    default: async () => {
        const indexFileRelativePath = 'index.tsx';
        const packageJsonTransform = (content) => {
            content.main = './index.js';
            content.module = './index.esm.js';
            if (content.exports) {
                // our build doesn't support "exports" in resulting package.json
                delete content.exports;
            }
            return content;
        };
        return await createRollupConfigForModule({ indexFileRelativePath, packageJsonTransform });
    },
};
