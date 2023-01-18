const typescript = require("@rollup/plugin-typescript");
const svgr = require("@svgr/rollup");
const commonjs = require("@rollup/plugin-commonjs");
const nodeResolve = require("@rollup/plugin-node-resolve");
const { visualizer } = require("rollup-plugin-visualizer");
const postCssDynamicImport = import("rollup-plugin-postcss-modules");
const path = require('path')
const cssSourcemapPathTransformPlugin = require('./plugins/cssSourceMapTransform');
//
const { onwarn } = require("./utils/rollupLoggerUtils");
const { getSourceMapTransform } = require("./utils/moduleSourceMapsUtils");
const { getExternalDeps } = require("./utils/moduleExtDependenciesUtils");
const { readPackageJsonContent } = require("../utils/monorepoUtils");

module.exports = { getConfig };

async function getConfig({ moduleRootDir, moduleIndexFile, tsconfigFile }) {
    const { default: postcss } = await postCssDynamicImport;
    const external = getExternalDeps(moduleRootDir);
    const { name: moduleName } = readPackageJsonContent(moduleRootDir);
    const moduleFolderName = path.basename(moduleRootDir);
    const outDir = `${moduleRootDir}/build`;
    const extractedCssFileName = 'styles.css';
    const jsSourceMapTransform = getSourceMapTransform({ type: 'js', moduleFolderName, moduleName})
    const cssSourceMapTransform = getSourceMapTransform({ type: 'css', moduleFolderName, moduleName})

    /** @type {import('rollup').RollupOptions} */
    const config = {
        input: moduleIndexFile,
        output: [{
            file: `${outDir}/index.js`, format: "cjs", interop: "auto",
            sourcemap: true, sourcemapPathTransform: jsSourceMapTransform,
        }],
        external,
        plugins: [
            nodeResolve({
                // https://www.npmjs.com/package/@rollup/plugin-node-resolve
                jail: path.resolve(moduleRootDir, '..'),
                preferBuiltins: false,
                mainFields: ['epam:uui:main', 'browser', 'module', 'main']
            }),
            commonjs(),// it's needed to import commonjs-only modules without "default" export (the only known example: "draft-js")
            typescript({
                tsconfig: tsconfigFile,
                outDir,
                baseUrl: moduleRootDir,
                rootDir: moduleRootDir,
                declaration: true,
                declarationMap: true,
                inlineSources: true,
            }),
            svgr({
                ref: true, exportType: "named", jsxRuntime: "classic",
                // list of plugins in "preset-default": https://github.com/svg/svgo/blob/cb1569b2215dda19b0d4b046842344218fd31f06/plugins/preset-default.js
                svgoConfig: { plugins: [{ name: 'preset-default', params: { overrides: { removeViewBox: false } } }] },
            }),
            postcss({
                sourceMap: true, modules: { hashPrefix: moduleName },
                extract: path.resolve(outDir, extractedCssFileName), to: `${outDir}/${extractedCssFileName}`
            }),
            cssSourcemapPathTransformPlugin({outDir, extractedCssFileName, transform: cssSourceMapTransform }),
            visualizer({
                // visualizer - must be the last in the list.
                projectRoot: moduleRootDir,
                template: "treemap",
                filename: "./build/stats.html",
                gzipSize: true,
                sourcemap: true,
            }),
        ],
        onwarn,
    };
    return [config];
}
