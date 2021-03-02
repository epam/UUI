var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const fileUpload = require('express-fileupload');
const api = require('./api');
const fileUploadApi = require('./api/fileUpload');

var app = express();

!process.env['WEBPACK_DEV_SERVER'] && app.use(logger("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(fileUpload());
app.use(cookieParser());

app.use((req, res, next) => {
    res.set('X-XSS-Protection', '1; mode=block');
    res.set('Strict-Transport-Security', 'max-age=63072000;');
    res.set('x-frame-options', 'SAMEORIGIN');
    next();
});

app.use("/static", express.static(path.join(__dirname, "../app/build/static")));

app.use("/manifest.json", express.static("../app/build/manifest.json"));
app.use("/favicon.ico", express.static("../app/build/favicon.ico"));
app.use("/favicon-32x32.png", express.static("../app/build/favicon-32x32.png"));
app.use("/favicon-16x16.png", express.static("../app/build/favicon-16x16.png"));
app.use("/safari-pinned-tab.svg", express.static("../app/build/safari-pinned-tab.svg"));
app.use("/apple-touch-icon.png", express.static("../app/build/apple-touch-icon.png"));
app.use("/android-chrome-192x192.png", express.static("../app/build/android-chrome-192x192.png"));
app.use("/android-chrome-512x512.png", express.static("../app/build/android-chrome-512x512.png"));
app.use("/mstile-150x150.png", express.static("../app/build/mstile-150x150.png"));
app.use("/browserconfig.xml", express.static("../app/build/browserconfig.xml"));

const uploadsPath = path.resolve(__dirname, "../public/uploads");
app.use("/static/uploads", express.static(uploadsPath));

app.use('/', fileUploadApi)
app.use('/api', api);

if(!process.env['WEBPACK_DEV_SERVER']) {
    app.get("*", function response(req, res) {
        res.sendFile(path.join(__dirname, "../app/build/", "index.html"));
    });

    app.listen(5000, function() {
        console.log("Example app listening on port 5000!");
    });
}

module.exports = app;
