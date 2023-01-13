const typescript = require("@rollup/plugin-typescript");
const svgr = require("@svgr/rollup");
const commonjs = require("@rollup/plugin-commonjs");
const nodeResolve = require("@rollup/plugin-node-resolve");
const { visualizer } = require("rollup-plugin-visualizer");
const postCssDynamicImport = import("rollup-plugin-postcss-modules");
const path = require('path')
const cssSourcemapPathTransformPlugin = require('./plugins/cssSourceMapTransform');
//
const { getExternalDeps, getTsConfigFile } = require("./rollupConfigUtils");
const { readPackageJsonContent } = require("../utils/monorepoUtils");

module.exports = { getConfig };

async function getConfig({ moduleRootDir, moduleIndexFile }) {
    const { default: postcss } = await postCssDynamicImport;
    const tsconfig = getTsConfigFile(moduleRootDir);
    const external = getExternalDeps(moduleRootDir);
    const { name: moduleName } = readPackageJsonContent(moduleRootDir);
    const moduleFolderName = path.basename(moduleRootDir);
    const outDir = `${moduleRootDir}/build`;
    const extractedCssFileName = 'styles.css';

    function getSourceMapTransform(isCss) {
        return function sourcemapPathTransform(relativeSourcePath) {
            /**
             * It's needed to fix sources location path in "build/index.js.map" and "build/styles.css.map".
             * So that source maps are grouped correctly in browser dev tools.
             * Before:
             * "sources":["../../src/Test.tsx",...]
             * After:
             * "sources":["rollup://<moduleName>/./src/Test.tsx",...]
             */
            if (isCss) {
                return `rollup://${moduleName}/./`+relativeSourcePath;
            }
            return `rollup://${moduleName}/./`+path.join(`${moduleFolderName}/build`, relativeSourcePath);
        }
    }


    /** @type {import('rollup').RollupOptions} */
    const config = {
        input: moduleIndexFile,
        output: [{
            file: `${outDir}/index.js`, format: "esm", interop: "auto",
            sourcemap: true, sourcemapPathTransform: getSourceMapTransform(false),
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
                tsconfig,
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
                extract: path.resolve(outDir, extractedCssFileName), to: extractedCssFileName }
            ),
            cssSourcemapPathTransformPlugin({outDir, extractedCssFileName, transform: getSourceMapTransform(true) }),
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

function onwarn(message) {
    switch (message?.code) {
        case 'CIRCULAR_DEPENDENCY': {
            // skip for now, uncomment to see how many we have.
            // console.warn(message.message)
            break;
        }
        default: {
            console.warn(message.message)
            break;
        }
    }
}
