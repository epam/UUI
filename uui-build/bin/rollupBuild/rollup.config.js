/**
 * Creates shared rollup config with default settings.
 */
const { createRollupConfigForModule } = require('../../rollup/rollup.config');

module.exports = {
    default: async () => {
        const indexFileRelativePath = 'index.tsx';
        const packageJsonTransform = content => {
            content.main = './index.js';
            if (content.exports?.['.']) {
                content.exports['.'] = './index.js';
            }
            if (content.exports?.['./styles.css']) {
                content.exports['./styles.css'] = './styles.css';
            }
        };
        return await createRollupConfigForModule({ indexFileRelativePath, packageJsonTransform });
    }
}
