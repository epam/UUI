const server = require("../server/app");

module.exports = function(app) {
    app.use(server);
};
