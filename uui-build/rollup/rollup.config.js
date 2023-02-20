const path = require('path');
const typescript = require('@rollup/plugin-typescript');
const svgr = require('@svgr/rollup');
const commonjs = require('@rollup/plugin-commonjs');
const nodeResolve = require('@rollup/plugin-node-resolve');
const replace = require('@rollup/plugin-replace');
const { visualizer } = require('rollup-plugin-visualizer');
const postCssDynamicImport = import('rollup-plugin-postcss-modules');
//
const { getExternalDeps } = require('./utils/moduleExtDependenciesUtils');
const { getTsConfigFile } = require('./utils/moduleTsConfigUtils');
const cssSourcemapPathTransformPlugin = require('./plugins/cssSourceMapTransform');
const { onwarn } = require('./utils/rollupLoggerUtils');
const { getSourceMapTransform } = require('./utils/moduleSourceMapsUtils');
const { beforeRollupBuild } = require('./utils/beforeRollupBuild');
const { readPackageJsonContentSync } = require('../utils/packageJsonUtils');

const EXTRACTED_CSS_FILE_NAME = 'styles.css';
const BUILD_OUTPUT_DIR = 'build';

module.exports = { createRollupConfigForModule };

/**
 * Creates rollup config for the module.
 *
 * @param {Object} options
 * @param {string} [options.moduleRootDir] absolute path to module root dir. it uses process.cwd() if nothing is provided
 * @param {string} options.indexFileRelativePath relative path to module index file
 * @param {any} options.external pass a callback if you need to override default behavior
 * @param {boolean} [options.isWatch] pass true if it's used in watch mode. it checks --watch command line argument if nothing is provided
 * @param {any} [options.packageJsonTransform] (it's applied before build is started). callback to adjust content of package.json when it's copied to the "build" folder.
 * @param {string[]} [options.copyAsIs] (it's applied before build is started). files to copy as is to the "build" folder.
 * @returns {Promise<import('rollup').RollupOptions[]>}
 */
async function createRollupConfigForModule(options) {
    const isWatchDefault = !!process.argv.find(a => a === '--watch');
    const moduleRootDirDefault = process.cwd();
    //
    const {
        moduleRootDir = moduleRootDirDefault,
        indexFileRelativePath,
        external,
        isWatch = isWatchDefault,
        packageJsonTransform,
        copyAsIs,
    } = options;
    const externalEffective = external ? external({ moduleRootDir }) : getExternalDeps({ moduleRootDir });
    const tsconfigFile = getTsConfigFile(moduleRootDir);
    const { default: postcss } = await postCssDynamicImport;
    const { name: moduleName, version } = readPackageJsonContentSync(moduleRootDir);
    const moduleFolderName = path.basename(moduleRootDir);
    const outDir = `${moduleRootDir}/${BUILD_OUTPUT_DIR}`;
    const jsSourceMapTransform = getSourceMapTransform({ type: 'js', moduleFolderName, moduleName });
    const cssSourceMapTransform = getSourceMapTransform({ type: 'css', moduleFolderName, moduleName });

    // TODO: maybe we need to move it to plugin.
    await beforeRollupBuild({ moduleRootDir, packageJsonTransform, copyAsIs });

    /** @type {import('rollup').RollupOptions} */
    const config = {
        input: indexFileRelativePath,
        output: [
            {
                file: `${outDir}/index.js`,
                format: 'cjs',
                interop: 'auto',
                sourcemap: true,
                sourcemapPathTransform: jsSourceMapTransform,
            },
        ],
        external: externalEffective,
        plugins: [
            replace({
                PACKAGE_VERSION: version,
                preventAssignment: true,
            }),
            nodeResolve({
                // https://www.npmjs.com/package/@rollup/plugin-node-resolve
                jail: path.resolve(moduleRootDir, '..'),
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
                ref: true,
                exportType: 'named',
                jsxRuntime: 'classic',
                // list of plugins in "preset-default": https://github.com/svg/svgo/blob/cb1569b2215dda19b0d4b046842344218fd31f06/plugins/preset-default.js
                svgoConfig: { plugins: [{ name: 'preset-default', params: { overrides: { removeViewBox: false } } }] },
            }),
            postcss({
                sourceMap: true,
                modules: { hashPrefix: moduleName },
                extract: path.resolve(outDir, EXTRACTED_CSS_FILE_NAME),
                to: `${outDir}/${EXTRACTED_CSS_FILE_NAME}`,
            }),
            cssSourcemapPathTransformPlugin({ outDir, extractedCssFileName: EXTRACTED_CSS_FILE_NAME, transform: cssSourceMapTransform }),
            visualizer({
                // visualizer - must be the last in the list.
                projectRoot: moduleRootDir,
                template: 'treemap',
                filename: `./${BUILD_OUTPUT_DIR}/stats.html`,
                gzipSize: true,
                sourcemap: true,
            }),
        ],
        onwarn,
    };
    return [config];
}
