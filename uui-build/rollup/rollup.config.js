const path = require('path');
const typescript = require('@rollup/plugin-typescript');
const svgr = require('@svgr/rollup');
const commonjs = require('@rollup/plugin-commonjs');
const nodeResolve = require('@rollup/plugin-node-resolve');
const replace = require('@rollup/plugin-replace');
const { visualizer } = require('rollup-plugin-visualizer');

const postCssDynamicImport = import('rollup-plugin-postcss');
//
const { getExternalDeps } = require('./utils/moduleExtDependenciesUtils');
const { getTsConfigFile } = require('./utils/moduleTsConfigUtils');
const cssSourcemapPathTransformPlugin = require('./plugins/cssSourceMapTransform');
const annotatePureFunctionCallsPlugin = require('./plugins/annotatePureFunctionCallsPlugin');
const { onwarn } = require('./utils/rollupLoggerUtils');
const { getSourceMapTransform } = require('./utils/moduleSourceMapsUtils');
const { beforeRollupBuild } = require('./utils/beforeRollupBuild');
const { readPackageJsonContentSync } = require('../utils/packageJsonUtils');

const EXTRACTED_CSS_FILE_NAME = 'styles.css';
const BUILD_OUTPUT_DIR = 'build';

function genUniqueId() {
    return [new Date().getTime(), Math.random()].reduce((acc, n) => (acc + n.toString(36).substring(2)), '');
}
const svgPrefix = {
    toString: () => `${genUniqueId()}_`,
};

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
    const isWatchDefault = !!process.argv.find((a) => a === '--watch');
    const moduleRootDirDefault = process.cwd();
    //
    const {
        moduleRootDir = moduleRootDirDefault, indexFileRelativePath, external, isWatch = isWatchDefault, packageJsonTransform, copyAsIs,
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

    const getOutputParams = ({ file, format }) => {
        return {
            file,
            format,
            interop: 'auto',
            sourcemap: true,
            sourcemapPathTransform: jsSourceMapTransform,
        };
    };

    /** @type {import('rollup').RollupOptions} */
    const config = {
        input: indexFileRelativePath,
        output: [getOutputParams({ file: `${outDir}/index.js`, format: 'cjs' }), getOutputParams({ file: `${outDir}/index.esm.js`, format: 'esm' })],
        external: externalEffective,
        plugins: [
            replace({
                __PACKAGE_VERSION__: `"${version}"`,
                __DEV__: 'process.env.NODE_ENV !== "production"',
                preventAssignment: true,
            }),
            nodeResolve({
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
                newLine: 'LF',
            }),
            svgr({
                ref: true,
                exportType: 'named',
                jsxRuntime: 'classic',
                // list of plugins in "preset-default": https://github.com/svg/svgo/blob/cb1569b2215dda19b0d4b046842344218fd31f06/plugins/preset-default.js
                svgoConfig: {
                    plugins: [
                        {
                            name: 'preset-default',
                            params: {
                                overrides: {
                                    removeViewBox: false,
                                    cleanupIDs: {
                                        remove: true,
                                        minify: true,
                                        prefix: svgPrefix,
                                    },
                                },
                            },
                        },
                    ],
                },
            }),
            postcss({
                sourceMap: true,
                modules: {
                    hashPrefix: `${moduleName}_${version}_`,
                    /*
                     * Hash is calculated from a string which looks like this: '<uuiModuleName>_<uuiVersion>_<relativePathToScss><selectorName>'
                     * See the logic behind this pattern here:
                     * https://github.com/css-modules/generic-names/blob/master/index.js
                     * https://github.com/webpack/loader-utils/blob/master/lib/getHashDigest.js
                     */
                    generateScopedName: '[hash:base64:6]',
                },
                autoModules: true,
                extract: path.resolve(outDir, EXTRACTED_CSS_FILE_NAME),
                to: `${outDir}/${EXTRACTED_CSS_FILE_NAME}`,
            }),
            annotatePureFunctionCallsPlugin({
                sourcemap: true,
                pureFunctions: [
                    /* React.forwardRef */
                    'forwardRef',
                    'React.forwardRef',

                    /* React.memo */
                    'React.memo',

                    /* React.createContext */
                    'React.createContext',
                    'createContext',

                    /* UUI-specific */
                    'withMods',
                    'uuiCore.withMods',
                    'createSkinComponent',
                    'TREE_SHAKEABLE_INIT',
                ],
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
