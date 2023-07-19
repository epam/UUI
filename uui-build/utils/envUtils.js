module.exports = {
    isCI,
    isDevServer,
    isLintScript,
    isLintStaged,
};

function isCI() {
    return !!process.env['CI'];
}

function isLintScript() {
    return !!process.env['LINT_SCRIPT'];
}

function isDevServer() {
    // https://github.com/webpack/webpack-dev-server/pull/3000
    return !!process.env['WEBPACK_SERVE'];
}

function isLintStaged() {
    return process.env['LINT_STAGED'] === 'true';
}
