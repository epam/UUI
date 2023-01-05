const typescript = require("@rollup/plugin-typescript");
const svgr = require("@svgr/rollup");
const commonjs = require("@rollup/plugin-commonjs");
const nodeResolve = require("@rollup/plugin-node-resolve");
const { visualizer } = require("rollup-plugin-visualizer");
const postCssDynamicImport = import("rollup-plugin-postcss-modules");
const path = require('path')
//
const { getExternalDeps, getTsConfigFile } = require("./rollupConfigUtils");
const { readPackageJsonContent } = require("./../utils/moduleUtils");

module.exports = { getConfig };

async function getConfig({ moduleRootDir, moduleIndexFile }) {
    const { default: postcss } = await postCssDynamicImport;
    const tsconfig = getTsConfigFile(moduleRootDir);
    const external = getExternalDeps(moduleRootDir);
    const { name: moduleName } = readPackageJsonContent(moduleRootDir);
    const moduleFolderName = path.basename(moduleRootDir);
    const outDir = `${moduleRootDir}/build`;

    /** @type {import('rollup').RollupOptions} */
    const config = {
        input: moduleIndexFile,
        output: [{ file: `${outDir}/index.js`, format: "esm", interop: "auto", sourcemap: true,
            sourcemapPathTransform: (relativeSourcePath, sourcemapPath) => {
                /**
                 * It's needed to fix sources location path in "build/index.js.map".
                 * So that source maps are grouped correctly in browser dev tools.
                 * Before:
                 * "sources":["../../src/Test.tsx",...]
                 * After:
                 * "sources":["rollup://<moduleName>/./src/Test.tsx",...]
                 */
                return `rollup://${moduleName}/./`+path.join(`${moduleFolderName}/build`, relativeSourcePath);
            }
        }],
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
                outDir,
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
