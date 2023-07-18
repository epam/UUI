module.exports = {
    getIgnoredPatterns,
};

/**
 * Patterns defined in .eslintignore take precedence over the ignorePatterns property of config files (https://eslint.org/docs/latest/use/configure/ignore)
 * We need to maintain it in a file because it's more convenient.
 * But the ".eslintignore" file needs to be renamed, so that it doesn't interfere with this config.
 * @param isCI
 * @param isLintStaged
 * @returns {string[]}
 */
function getIgnoredPatterns({ isCI, isLintStaged }) {
    let list = [
        '!.*.js',
        'build',
        'node_modules',
        'templates',
        'next-app',
        'server/helpers/getFilterPredicate.js',
        'uui-editor', // TODO: it's temporarily ignored, uncomment when work related to editor is finished.
    ];
    if (isCI || isLintStaged) {
        // don't want to fail CI if issues are in legacy modules.
        list = list.concat([
            'uui-db',
            'extra',
            'draft-rte',
        ]);
    }
    return list;
}
