const path = require("path");
const typescript = require("@rollup/plugin-typescript");
const svgr = require("@svgr/rollup");
const commonjs = require("@rollup/plugin-commonjs");
const nodeResolve = require("@rollup/plugin-node-resolve");
const replace = require('@rollup/plugin-replace')
const { visualizer } = require("rollup-plugin-visualizer");
const postCssDynamicImport = import("rollup-plugin-postcss-modules");
//
const {getExternalDeps} = require("./utils/moduleExtDependenciesUtils");
const {getTsConfigFile} = require("./utils/moduleTsConfigUtils");
const cssSourcemapPathTransformPlugin = require("./plugins/cssSourceMapTransform");
const { onwarn } = require("./utils/rollupLoggerUtils");
const { getSourceMapTransform } = require("./utils/moduleSourceMapsUtils");
const { readPackageJsonContentSync } = require("../utils/packageJsonUtils");

const EXTRACTED_CSS_FILE_NAME = "styles.css";
const BUILD_OUTPUT_DIR = "build";

module.exports = { createRollupConfigForModule };

/**
 * Creates rollup config for the module.
 *
 * @param {Object} options
 * @param {string} options.moduleRootDir absolute path to module root dir
 * @param {string} options.indexFileRelativePath relative path to module index file
 * @param {any} options.external pass a callback if you need to override default behavior
 * @param {boolean} [options.isWatch] pass true if it's used in watch mode
 * @returns {Promise<import('rollup').RollupOptions[]>}
 */
async function createRollupConfigForModule(options) {
    const { moduleRootDir, indexFileRelativePath, external, isWatch } = options;
    const externalEffective = external ? external({ moduleRootDir }) : getExternalDeps({ moduleRootDir });
    const tsconfigFile = getTsConfigFile(moduleRootDir);
    const { default: postcss } = await postCssDynamicImport;
    const { name: moduleName, version } = readPackageJsonContentSync(moduleRootDir);
    const moduleFolderName = path.basename(moduleRootDir);
    const outDir = `${moduleRootDir}/${BUILD_OUTPUT_DIR}`;
    const jsSourceMapTransform = getSourceMapTransform({ type: "js", moduleFolderName, moduleName});
    const cssSourceMapTransform = getSourceMapTransform({ type: "css", moduleFolderName, moduleName});

    /** @type {import('rollup').RollupOptions} */
    const config = {
        input: indexFileRelativePath,
        output: [{
            file: `${outDir}/index.js`, format: "cjs", interop: "auto",
            sourcemap: true, sourcemapPathTransform: jsSourceMapTransform,
        }],
        external: externalEffective,
        plugins: [
            replace({
                UUI_VERSION_VARIABLE: version,
                preventAssignment: true,
            }),
            nodeResolve({
                // https://www.npmjs.com/package/@rollup/plugin-node-resolve
                jail: path.resolve(moduleRootDir, ".."),
                preferBuiltins: false,
            }),
            commonjs(), // it's needed to import commonjs-only modules without "default" export (the only known example: "draft-js")
            typescript({
                tsconfig: tsconfigFile,
                outDir,
                baseUrl: moduleRootDir,
                rootDir: moduleRootDir,
                declaration: true,
                declarationMap: true,
                inlineSources: true,
                noEmitOnError: !isWatch,
            }),
            svgr({
                ref: true, exportType: "named", jsxRuntime: "classic",
                // list of plugins in "preset-default": https://github.com/svg/svgo/blob/cb1569b2215dda19b0d4b046842344218fd31f06/plugins/preset-default.js
                svgoConfig: { plugins: [{ name: "preset-default", params: { overrides: { removeViewBox: false } } }] },
            }),
            postcss({
                sourceMap: true, modules: { hashPrefix: moduleName },
                extract: path.resolve(outDir, EXTRACTED_CSS_FILE_NAME), to: `${outDir}/${EXTRACTED_CSS_FILE_NAME}`,
            }),
            cssSourcemapPathTransformPlugin({outDir, extractedCssFileName: EXTRACTED_CSS_FILE_NAME, transform: cssSourceMapTransform }),
            visualizer({
                // visualizer - must be the last in the list.
                projectRoot: moduleRootDir,
                template: "treemap",
                filename: `./${BUILD_OUTPUT_DIR}/stats.html`,
                gzipSize: true,
                sourcemap: true,
            }),
        ],
        onwarn,
    };
    return [config];
}
