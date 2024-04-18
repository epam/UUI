module.exports = {
    getIgnoredPatterns,
};

/**
 * Patterns defined in .eslintignore take precedence over the ignorePatterns property of config files (https://eslint.org/docs/latest/use/configure/ignore)
 * We need to maintain it in a file because it's more convenient.
 * But the ".eslintignore" file needs to be renamed, so that it doesn't interfere with this config.
 * @param isCI
 * @param isLintStaged
 * @param isLintScript
 * @returns {string[]}
 */
function getIgnoredPatterns({ isCI, isLintStaged, isLintScript }) {
    let ignored = [
        '!.*.js',
        'build',
        'node_modules',
        'templates',
        'next-app',
        'server/helpers/getFilterPredicate.js',
    ];
    if (isCI || isLintStaged) {
        // ignore in CI
        // still show any errors in IDE & in local running eslint script
    }
    if (isCI || isLintStaged || isLintScript) {
        // ignore in CI & for local running eslint script
        // still show any errors in IDE
        ignored = ignored.concat([
            'uui-db',
            'extra',
            'draft-rte',
            'uui-timeline',
        ]);
    }
    return ignored;
}
