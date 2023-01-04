const typescript = require("@rollup/plugin-typescript");
const svgr = require("@svgr/rollup");
const commonjs = require("@rollup/plugin-commonjs");
const nodeResolve = require("@rollup/plugin-node-resolve");
const { visualizer } = require("rollup-plugin-visualizer");
const postCssDynamicImport = import("rollup-plugin-postcss-modules");
const path = require('path')
//
const { getExternalDeps, getTsConfigFile } = require("./rollupConfigUtils");
const { getModuleNameFromModuleRootDir } = require("./../utils/moduleUtils");

module.exports = { getConfig };

async function getConfig({ moduleRootDir, moduleIndexFile }) {
    const { default: postcss } = await postCssDynamicImport;
    const tsconfig = getTsConfigFile(moduleRootDir);
    const external = getExternalDeps(moduleRootDir);
    const moduleName = getModuleNameFromModuleRootDir(moduleRootDir)

    /** @type {import('rollup').RollupOptions} */
    const config = {
        input: moduleIndexFile,
        output: [{ file: `${moduleRootDir}/build/index.js`, format: "esm", interop: "auto", sourcemap: true }],
        external,
        plugins: [
            nodeResolve({
                // https://www.npmjs.com/package/@rollup/plugin-node-resolve
                jail: path.resolve(moduleRootDir, '..'),
                preferBuiltins: false,
                mainFields: ['epam:uui:main', 'browser', 'module', 'main']
            }),
            typescript({
                tsconfig,
                outDir: `${moduleRootDir}/build`,
                baseUrl: moduleRootDir,
                rootDir: moduleRootDir,
                declaration: true,
                declarationMap: true,
                inlineSources: true,
            }),
            commonjs(),// needed to import commonjs-only modules without "default" export (known examples: draft-js)
            svgr({ ref: true, exportType: "named", jsxRuntime: "classic" }),
            postcss({ sourceMap: true, modules: { hashPrefix: moduleName }, extract: "styles.css" }),
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
