module.exports = {
    isCI,
    isDevServer,
};

function isCI() {
    // https://github.com/webpack/webpack-dev-server/pull/3000
    return !!process.env['CI'];
}

function isDevServer() {
    // https://github.com/webpack/webpack-dev-server/pull/3000
    return !!process.env['WEBPACK_SERVE'];
}
