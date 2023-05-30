const path = require('path');

const EXCLUDE_DIRS = [
    'templates',
];

// https://github.com/okonet/lint-staged#example-ignore-files-from-match
module.exports = {
    '*.{js,ts,tsx}': (files) => {
        return runCmdExcludeIgnoredDirs({ cmd: 'eslint --fix', files, ignoredDirs: EXCLUDE_DIRS });
    },
    '*.{less,scss}': (files) => {
        return runCmdExcludeIgnoredDirs({ cmd: 'stylelint --fix', files, ignoredDirs: EXCLUDE_DIRS });
    },
};

function runCmdExcludeIgnoredDirs({ cmd, files, ignoredDirs }) {
    const filesToCheck = excludeIgnoredDirs(files, ignoredDirs);
    if (filesToCheck.length > 0) {
        return `${cmd} ${filesToCheck.join(' ')}`;
    }
    return [];
}

function excludeIgnoredDirs(files, ignoredDirs) {
    function normalizePath(f) {
        const uuiRoot = path.resolve(__dirname, './');
        return path.relative(uuiRoot, f).replaceAll('\\', '/');
    }
    function isAllowed(n) {
        return ignoredDirs.every((d) => n.indexOf(`${d}/`) !== 0);
    }
    return files.reduce((acc, f) => {
        const n = normalizePath(f);
        if (isAllowed(n)) {
            acc.push(n);
        }
        return acc;
    }, []);
}
