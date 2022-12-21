const {removeRuleByTestAttr, replaceRuleByTestAttr, changeRuleByTestAttr, normSlashes, addRule} = require("./utils/configUtils");
const { BABEL_INCLUDED_REGEXP, BABEL_EXCLUDED_REGEXP, CSS_URL_ROOT_PATH,
    LIBS_WITHOUT_SOURCE_MAPS, VFILE_SPECIAL_CASE_REGEX,
} = require("./constants");
const SVGRLoader = require.resolve("@svgr/webpack");
const FileLoader = require.resolve("file-loader");

/**
 * See https://craco.js.org/
 */
module.exports = function uuiConfig() {
    return {
        eslint: { enable: false }, // EsLint is disabled as of now, but it would be enabled in the future.
        webpack: { configure: configureWebpack },
        devServer: config => {
            return config;
        },
    };
};

function configureWebpack(config, { paths }) {
    // reason: no such use case in UUI.
    removeRuleByTestAttr(config, /\.module\.css$/);
    // reason: .sass files are always modules in UUI
    removeRuleByTestAttr(config, /\.(scss|sass)$/);
    // reason: all .css files are not modules in UUI
    changeRuleByTestAttr(config, /\.css$/, r => { delete r.exclude; return r; });

    /**
     * Reason: bug in vfile package which only reproduced in webpack 5.
     * https://github.com/remarkjs/react-markdown/issues/339#issuecomment-683199835
     * https://github.com/vfile/vfile/issues/38
     * vfile is a transitive dependency which is here because we use ReactMarkdown.
     * Latest version of ReactMarkdown doesn't have this issue, i.e. we need to migrate to it and remove this customization.
     */
    addRule(config, {
        test: VFILE_SPECIAL_CASE_REGEX,
        use: [{ loader: require.resolve("imports-loader"), options: { type: "commonjs", imports: ["single process/browser process"] } }],
    });
    /** Use older version of @svgr/webpack as a workaround for https://github.com/facebook/create-react-app/issues/11770
     * Use older version of file-loader as a workaround for https://github.com/gregberge/svgr/issues/367
     * related bug: https://github.com/gregberge/svgr/issues/727
     * e.g.: uui-timeline/arrowRight.svg
     * */
    replaceRuleByTestAttr(config, /\.svg$/, {
        test: /\.svg$/,
        use: [
            { loader: SVGRLoader, options: { svgoConfig: { plugins: { removeViewBox: false } }, ref: true }},
            { loader: FileLoader, options: { emitFile: false } },
        ],
    });

    /**
     * This is Babel for our source files. We need to include sources of all our modules, not only "app/src".
     */
    changeRuleByTestAttr(config, /\.(js|mjs|jsx|ts|tsx)$/, r => {
        const include = isUseBuildFolderOfDeps() ? BABEL_INCLUDED_REGEXP.BUILD_FOLDERS : BABEL_INCLUDED_REGEXP.DEFAULT;
        const exclude = isUseBuildFolderOfDeps() ? BABEL_EXCLUDED_REGEXP.BUILD_FOLDERS : BABEL_EXCLUDED_REGEXP.DEFAULT;
        return Object.assign(r, { include, exclude });
    });

    // Fix for the issue when some modules have no source maps. see this discussion for details https://github.com/facebook/create-react-app/discussions/11767
    changeRuleByTestAttr(config, /\.(js|mjs|jsx|ts|tsx|css)$/, r =>
        Object.assign(r, { exclude: [ r.exclude, VFILE_SPECIAL_CASE_REGEX, ...LIBS_WITHOUT_SOURCE_MAPS ] }));

    // Reason: see below.
    changeRuleByTestAttr(config, /\.module\.(scss|sass)$/, prev => {
        // replace "test". Reason: .sass files are always modules in UUI
        prev.test = /\.scss$/;
        prev.use && prev.use.forEach(u => {
            if (u.loader && u.loader.indexOf(normSlashes("/resolve-url-loader/")) !== -1) {
                // Set css root for "resolve-url-loader". So that url('...') statements in .scss are resolved correctly.
                u.options.root = CSS_URL_ROOT_PATH;
            }
            if (u.loader && u.loader.indexOf(normSlashes("/css-loader/")) !== -1) {
                // Need camelCase export to keep existing UUI code working
                u.options.modules.exportLocalsConvention = "camelCase";
            }
        });
        return prev;
    });

    /** Reason: 'path' is used in a couple of our components:
     * app/src/data/codesandbox/service.ts
     * app/src/common/docs/BaseDocsBlock.tsx
     * we need to get rid of it in the future.
     * */
    config.resolve.alias.path = "path-browserify";
    if (isUseBuildFolderOfDeps()) {
        config.resolve.mainFields = ["epam:uui:main", "browser", "module", "main"];
    }
    return config;
}

function isUseBuildFolderOfDeps() {
    /**
     * TODO: need to change the approach to process "docs". I.e. get rid of "require.context" and use explicit imports instead.
     * Known places:
     * app/src/common/docs/ComponentEditor.tsx
     * app/src/common/docs/DocExample.tsx
     * epam-assets/icons/index.ts
     * epam-assets/icons/legacy/index.ts
     * epam-assets/icons/loaders/index.ts
     * epam-promo/index.docs.ts
     * loveship/index.docs.ts
     * uui/index.docs.ts
     *
     * @type {boolean}
     */
    //return !!process.argv.find(a => a === '--use-build-folder-of-deps');
    return false;
}
