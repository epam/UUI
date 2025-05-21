const server = require('../../server/build/app.js');

module.exports = function (app) {
    try {
        app.use(server.app);
    } catch (e) {
        console.error(e);
    }
};
