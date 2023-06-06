module.exports = {
    isDevServer,
};

function isDevServer() {
    // https://github.com/webpack/webpack-dev-server/pull/3000
    return process.env['WEBPACK_SERVE'];
}
