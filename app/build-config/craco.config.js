const {removeRuleByTestAttr, replaceRuleByTestAttr, changeRuleByTestAttr, normSlashes, addRule} = require("./utils/configUtils");
const { DIRS_FOR_BABEL, CSS_URL_ROOT_PATH,
    LIBS_WITHOUT_SOURCE_MAPS, VFILE_SPECIAL_CASE_REGEX,
} = require("./constants");
const SVGRLoader = require.resolve("@svgr/webpack");
const FileLoader = require.resolve("file-loader");
const { uuiCustomFormatter } = require("./utils/issueFormatter");

const isUseBuildFolderOfDeps = !!process.argv.find(a => a === '--use-build-folder-of-deps');

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
     * Known svg with namespace tags (e.g.: sodipodi:namedview, inkscape:connector-curvature, etc.):
     * epam-assets/icons/templates/generic-24.svg
     * epam-assets/icons/templates/generic-30.svg
     * epam-assets/icons/templates/generic.svg
     * epam-assets/icons/templates/tall.svg
     * epam-promo/icons/checkbox_tick.svg
     * epam-promo/icons/menu_input_cancel.svg
     * loveship/components/icons/checkbox_tick.svg
     * loveship/components/icons/menu_input_cancel.svg
     * public/static/images/customer-short-logo.svg
     * public/static/images/customer-wide-logo.svg
     * public/static/images/grid-overlay.svg
     * public/static/images/h-ruler.svg
     * public/static/images/lens.svg
     * public/static/images/v-ruler.svg
     * uui/icons/checkbox_tick.svg
     * uui/icons/menu_input_cancel.svg
     */
    addRule(config, {
        test: VFILE_SPECIAL_CASE_REGEX,
        use: [{ loader: require.resolve("imports-loader"), options: { type: "commonjs", imports: ["single process/browser process"] } }],
    });
    /**
     * Fix: remove <metadata> tag.
     *
     * Use older version of @svgr/webpack as a workaround for https://github.com/facebook/create-react-app/issues/11770
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
        if (isUseBuildFolderOfDeps) {
            return r;
        }
        const include = DIRS_FOR_BABEL.DEV.INCLUDE;
        include.push(r.include);
        const exclude = DIRS_FOR_BABEL.DEV.EXCLUDE;
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

    /** Reason: 'path' is used in some components: react-markdown
     * we need to get rid of it in the future.
     **/
    config.resolve.alias.path = "path-browserify";
    if (isUseBuildFolderOfDeps) {
        config.resolve.mainFields = ["epam:uui:main", "browser", "module", "main"];
    }

    config.plugins.forEach(p => {
        if (p.constructor.name === 'ForkTsCheckerWebpackPlugin') {
            p.options.formatter = uuiCustomFormatter;
            const include = isUseBuildFolderOfDeps ? DIRS_FOR_BABEL.BUILD.INCLUDE : DIRS_FOR_BABEL.DEV.INCLUDE;
            p.options.issue.include = p.options.issue.include.concat(include);
        }
    })

    return config;
}
