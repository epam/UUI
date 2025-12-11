const { whenDev, whenProd } = require('@craco/craco');
const path = require('path');
const {
    changeRuleByTestAttr, makeSlashesPlatformSpecific,
    changePluginByName, removeRuleByTestAttr,
} = require('./utils/configUtils');
const {
    DIRS_FOR_BABEL, CSS_URL_ROOT_PATH, ENTRY_WITH_EXTRACTED_DEPS_CSS,
    LIBS_WITHOUT_SOURCE_MAPS, UUI_VERSION,
} = require('./constants');
const { uuiCustomFormatter } = require('./formatters/issueFormatter');
const { assertAppDepsAreBuilt } = require('./utils/appDepsUtils');

/**
 * There are two major use cases:
 * 1) The "@epam/app" is built using "./build" folder of respective dependencies (I.e. all dependencies must be already built before "app" build is started):
 *  - When "--app-dev" flag is not provided, and it's not a dev server mode.
 * 2) The "@epam/app" and all its dependencies are build together as a single project:
 *  - In dev server mode
 *  - When "--app-dev" flag is provided
 */
function getIsUseBuildFolderOfDeps() {
    let flag = !process.argv.find((a) => a === '--app-dev');
    whenDev(() => { flag = false; });
    return flag;
}

/**
 * NOTE:
 *     isWrapUuiAppInShadowDom=true makes the entire app to be wrapped in Shadow DOM.
 *     It's supposed to be used in local DEV server to reproduce bugs related to Shadow DOM.
 * @type {boolean}
 */
const isWrapUuiAppInShadowDom = process.env.isWrapUuiAppInShadowDom === 'true';
const isUseBuildFolderOfDeps = getIsUseBuildFolderOfDeps();

const headCommitHash = require('../../uui-build/utils/gitUtils').getHeadCommitHash();

/**
 * See https://craco.js.org/
 */
module.exports = function uuiConfig() {
    return {
        eslint: { enable: false },
        webpack: { configure: configureWebpack },
    };
};

function configureWebpack(config, { paths }) {
    isUseBuildFolderOfDeps && assertAppDepsAreBuilt();
    whenDev(() => { config.devtool = 'eval-source-map'; });
    whenProd(() => {
        // splitChunks setting hangs webpack5 dev server due to a bug.
        // (that's why we apply it only to prod)
        // see also the discussion here: https://github.com/facebook/create-react-app/discussions/11278#discussioncomment-1808511
        config.optimization.splitChunks = { chunks: 'all' };
    });

    if (isUseBuildFolderOfDeps) {
        paths.appIndexJs = ENTRY_WITH_EXTRACTED_DEPS_CSS;
        config.entry = ENTRY_WITH_EXTRACTED_DEPS_CSS;
    }

    // reason: no such use case in UUI.
    removeRuleByTestAttr(config, /\.module\.css$/);

    // reason: all .css files are not modules in UUI
    changeRuleByTestAttr(config, /\.css$/, (r) => { delete r.exclude; return r; });

    //
    changeRuleByTestAttr(config, /\.svg$/, (prev) => {
        delete prev.issuer; // deleting the issuer condition because of next bug: https://github.com/webpack/webpack/issues/9309
        const fileLoader = prev.use.find((u) => { return u.loader.indexOf(makeSlashesPlatformSpecific('/file-loader/')) !== -1; });
        fileLoader.options = { emitFile: false };
        return prev;
    });

    if (!isUseBuildFolderOfDeps) {
        /**
         * This is Babel for our source files. We need to include sources of all our modules, not only "app/src".
         */
        changeRuleByTestAttr(config, /\.(js|mjs|jsx|ts|tsx)$/, (r) => {
            const include = [r.include, ...DIRS_FOR_BABEL.DEPS_SOURCES.INCLUDE];
            const exclude = DIRS_FOR_BABEL.DEPS_SOURCES.EXCLUDE;
            return Object.assign(r, { include, exclude });
        });
    }
    // Fix for the issue when some modules have no source maps. see this discussion for details https://github.com/facebook/create-react-app/discussions/11767
    changeRuleByTestAttr(config, /\.(js|mjs|jsx|ts|tsx|css)$/, (r) => Object.assign(r, { exclude: [r.exclude, ...LIBS_WITHOUT_SOURCE_MAPS] }));

    changeRuleByTestAttr(config, /\.(scss|sass)$/, (prev) => {
        normalizeUse(prev);
        addShadowRootSupportToUse(prev);
        if (prev.use) {
            prev.use.forEach((u) => {
                if (u.loader && u.loader.indexOf(makeSlashesPlatformSpecific('/sass-loader/')) !== -1) {
                    u.options = {
                        ...u.options,
                        sassOptions: {
                            ...(u.options && u.options.sassOptions),
                            includePaths: [
                                path.resolve(process.cwd(), 'node_modules'),
                                path.resolve(process.cwd(), '../node_modules'),
                                path.resolve(__dirname, '../../node_modules'),
                                'node_modules',
                            ],
                        },
                    };
                }
            });
        }
        return prev;
    });
    changeRuleByTestAttr(config, /\.css$/, (prev) => {
        normalizeUse(prev);
        addShadowRootSupportToUse(prev);
        return prev;
    });
    // Reason: see below.
    changeRuleByTestAttr(config, /\.module\.(scss|sass)$/, (prev) => {
        if (prev.use) {
            normalizeUse(prev);
            addShadowRootSupportToUse(prev);
            prev.use.forEach((u) => {
                if (u.loader) {
                    if (u.loader.indexOf(makeSlashesPlatformSpecific('/resolve-url-loader/')) !== -1) {
                        // Set css root for "resolve-url-loader". So that url('...') statements in .scss are resolved correctly.
                        u.options.root = CSS_URL_ROOT_PATH;
                    }
                    if (u.loader.indexOf(makeSlashesPlatformSpecific('/css-loader/')) !== -1) {
                        // Need camelCase export to keep existing UUI code working
                        u.options.modules.exportLocalsConvention = 'camelCase';
                    }
                    if (u.loader.indexOf(makeSlashesPlatformSpecific('/sass-loader/')) !== -1) {
                        u.options = {
                            ...u.options,
                            sassOptions: {
                                ...(u.options && u.options.sassOptions),
                                includePaths: [
                                    path.resolve(process.cwd(), 'node_modules'),
                                    path.resolve(process.cwd(), '../node_modules'),
                                    path.resolve(__dirname, '../../node_modules'),
                                    'node_modules',
                                ],
                            },
                        };
                    }
                }
            });
        }
        return prev;
    });

    if (isUseBuildFolderOfDeps) {
        config.resolve.mainFields = [
            'epam:uui:main', 'browser', 'module', 'main',
        ];
    }

    changePluginByName(config, 'DefinePlugin', (plugin) => {
        plugin.definitions.__COMMIT_HASH__ = `"${headCommitHash}"`;
        plugin.definitions.__PACKAGE_VERSION__ = `"${UUI_VERSION}"`; // keep it in sync with rollup config replacements
        plugin.definitions.__DEV__ = process.env.NODE_ENV !== 'production';
    });

    changePluginByName(config, 'HtmlWebpackPlugin', (plugin) => {
        plugin.userOptions.isWrapUuiAppInShadowDom = isWrapUuiAppInShadowDom;
    });
    changePluginByName(config, 'ForkTsCheckerWebpackPlugin', (plugin) => {
        // custom formatter can be removed when next bug is fixed:
        // https://github.com/TypeStrong/fork-ts-checker-webpack-plugin/issues/789
        plugin.options.formatter = uuiCustomFormatter;
        if (!isUseBuildFolderOfDeps) {
            plugin.options.issue.include = plugin.options.issue.include.concat(DIRS_FOR_BABEL.DEPS_SOURCES.INCLUDE);
        }
    });

    return config;
}

function normalizeUse(prev) {
    if (prev.use) {
        prev.use = prev.use.map((u) => {
            if (typeof u === 'string') {
                return { loader: u };
            }
            return u;
        });
    }
}

function addShadowRootSupportToUse(prev) {
    if (isWrapUuiAppInShadowDom && prev.use) {
        prev.use.forEach((u) => {
            if (u.loader) {
                if (u.loader.indexOf(makeSlashesPlatformSpecific('/style-loader/')) !== -1) {
                    u.options = {
                        ...u.options,
                        insert: (linkTag) => {
                            const target = document.querySelector('#root').shadowRoot || document.head;
                            target.appendChild(linkTag);
                        },
                    };
                }
            }
        });
    }
}
