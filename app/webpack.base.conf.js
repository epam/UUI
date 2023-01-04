/**
 * It's not used on runtime in any way.
 * It's a temporary workaround to make IDE autocompletion features recognize imports with "~" in "scss".
 * E.g.: "@use '~@epam/promo/...'"
 * The "~" is deprecated, so we need to remove it (see https://webpack.js.org/loaders/sass-loader/#resolving-import-at-rules)
 * Once it's removed, this config file can be deleted as well.
 */
module.exports = { resolve: { modules: ['node_modules'] } };
