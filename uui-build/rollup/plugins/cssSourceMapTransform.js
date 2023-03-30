const path = require('path');
const fs = require('fs');

module.exports = cssSourcemapPathTransformPlugin;

/**
 * Custom Rollup plugin to transform "sources" path inside "*.css.map" file.
 *
 * @param config
 * @param config.outDir
 * @param config.extractedCssFileName
 * @param config.transform
 * @returns {{writeBundle(*, *): void, name: string}}
 */
function cssSourcemapPathTransformPlugin(config) {
    return {
        name: 'cssSourcemapPathTransformPlugin',
        writeBundle(opts, bundleInfo) {
            // See docs: https://rollupjs.org/guide/en/#writebundle
            const { outDir, extractedCssFileName, transform } = config;
            const shouldTransform = opts.sourcemap && bundleInfo[extractedCssFileName];
            if (shouldTransform) {
                const cssSourceMapName = `${extractedCssFileName}.map`;
                if (bundleInfo[cssSourceMapName]) {
                    const content = JSON.parse(bundleInfo[cssSourceMapName].source);
                    content.sources = content.sources.map((relativeSourcePath) => transform(relativeSourcePath));
                    const cssSourceMapPath = path.resolve(outDir, cssSourceMapName);
                    fs.writeFileSync(cssSourceMapPath, JSON.stringify(content), 'utf8');
                } else {
                    console.error(`Unable to find css source map to transform: ${cssSourceMapName}.`);
                }
            }
        },
    };
}
