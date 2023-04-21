const { whenDev, whenProd } = require('@craco/craco');
const {
    removeRuleByTestAttr, changeRuleByTestAttr, makeSlashesPlatformSpecific,
    changePluginByName,
} = require('./utils/configUtils');
const {
    DIRS_FOR_BABEL, CSS_URL_ROOT_PATH, ENTRY_WITH_EXTRACTED_DEPS_CSS,
    LIBS_WITHOUT_SOURCE_MAPS, UUI_ROOT,
} = require('./constants');
const { uuiCustomFormatter } = require('./formatters/issueFormatter');
const { assertAppDepsAreBuilt } = require('./utils/appDepsUtils');
const StyleLintPlugin = require('stylelint-webpack-plugin');

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
const isUseBuildFolderOfDeps = getIsUseBuildFolderOfDeps();
const isEnableEslint = whenDev(() => false, false);
const isEnableStylelint = whenDev(() => false, false);

/**
 * See https://craco.js.org/
 */
module.exports = function uuiConfig() {
    return {
        eslint: isEnableEslint ? {
            enable: true,
            mode: 'file',
        } : { enable: false },
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
    // reason: .sass files are always modules in UUI
    removeRuleByTestAttr(config, /\.(scss|sass)$/);
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

    // Reason: see below.
    changeRuleByTestAttr(config, /\.module\.(scss|sass)$/, (prev) => {
        // replace "test". Reason: .sass files are always modules in UUI
        prev.test = /\.scss$/;
        prev.use && prev.use.forEach((u) => {
            if (u.loader && u.loader.indexOf(makeSlashesPlatformSpecific('/resolve-url-loader/')) !== -1) {
                // Set css root for "resolve-url-loader". So that url('...') statements in .scss are resolved correctly.
                u.options.root = CSS_URL_ROOT_PATH;
            }
            if (u.loader && u.loader.indexOf(makeSlashesPlatformSpecific('/css-loader/')) !== -1) {
                // Need camelCase export to keep existing UUI code working
                u.options.modules.exportLocalsConvention = 'camelCase';
            }
        });
        return prev;
    });

    if (isUseBuildFolderOfDeps) {
        config.resolve.mainFields = [
            'epam:uui:main',
            'browser',
            'module',
            'main',
        ];
    }

    changePluginByName(config, 'ForkTsCheckerWebpackPlugin', (plugin) => {
        // custom formatter can be removed when next bug is fixed:
        // https://github.com/TypeStrong/fork-ts-checker-webpack-plugin/issues/789
        plugin.options.formatter = uuiCustomFormatter;
        if (!isUseBuildFolderOfDeps) {
            plugin.options.issue.include = plugin.options.issue.include.concat(DIRS_FOR_BABEL.DEPS_SOURCES.INCLUDE);
        }
    });
    isEnableEslint && changePluginByName(config, 'ESLintWebpackPlugin', (plugin) => {
        Object.assign(plugin.options, {
            formatter: 'unix',
            outputReport: false,
            emitWarning: false,
            context: UUI_ROOT,
        });
        return plugin;
    });

    isEnableStylelint && config.plugins.push(new StyleLintPlugin({
        formatter: 'unix',
        configBasedir: UUI_ROOT,
        context: UUI_ROOT,
        exclude: [
            // StyleLintPlugin ignores ".stylelintignore", so we have to explicitly repeat excluded patterns here
            'templates/', '**/build/',
        ],
        files: ['**/*.scss', '**/*.less'],
    }));

    return config;
}
