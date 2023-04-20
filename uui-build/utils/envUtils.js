module.exports = {
    isCI,
    isDevServer,
    isLintStaged,
};

function isCI() {
    // https://github.com/webpack/webpack-dev-server/pull/3000
    return !!process.env['CI'];
}

function isDevServer() {
    // https://github.com/webpack/webpack-dev-server/pull/3000
    return !!process.env['WEBPACK_SERVE'];
}

function isLintStaged() {
    return process.env['LINT_STAGED'] === 'true';
}
