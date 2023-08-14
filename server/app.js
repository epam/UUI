const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const api = require('./api');
const fileUploadApi = require('./api/fileUpload');
const { isDevServer } = require('./utils/envUtils');
const actuator = require('express-actuator');

const app = express();

!isDevServer() && app.use(logger('dev'));

app.use(express.json({ limit: '200mb' }));
app.use(express.urlencoded({ limit: '200mb', extended: true }));
app.use(fileUpload());
app.use(cookieParser());
app.use(cors({
    credentials: false,
}));

app.use((req, res, next) => {
    res.set('X-XSS-Protection', '1; mode=block');
    res.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains');
    !isDevServer() && res.set('Cache-Control', 'public,max-age=2592000,immutable');
    res.set('x-frame-options', 'SAMEORIGIN');
    res.set('X-Content-Type-Options', 'nosniff');
    res.set(
        'Content-Security-Policy',
        "default-src 'self' https://*.epam.com;"
        + "style-src 'self' 'unsafe-inline' https://*.epam.com https://cdnjs.cloudflare.com/; "
        + "font-src 'self' https://*.epam.com https://fonts.gstatic.com/; "
        + "connect-src 'self' https://*.epam.com https://api.amplitude.com/ wss://menu.epam.com/*' https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com; "
        + 'frame-src *; '
        + 'img-src * data: ; '
        + `script-src 'self' ${isDevServer() ? "'unsafe-eval' 'unsafe-inline'" : ''} https://*.epam.com https://www.googletagmanager.com/ https://www.google-analytics.com/;`,
    );

    next();
});

app.use(actuator({ basePath: '/actuator' }));

app.use('/static', express.static(path.join(__dirname, '../app/build/static')));

app.use('/manifest.json', express.static('../app/build/manifest.json'));
app.use('/favicon.ico', express.static('../app/build/favicon.ico'));
app.use('/favicon-32x32.png', express.static('../app/build/favicon-32x32.png'));
app.use('/favicon-16x16.png', express.static('../app/build/favicon-16x16.png'));
app.use('/safari-pinned-tab.svg', express.static('../app/build/safari-pinned-tab.svg'));
app.use('/apple-touch-icon.png', express.static('../app/build/apple-touch-icon.png'));
app.use('/android-chrome-192x192.png', express.static('../app/build/android-chrome-192x192.png'));
app.use('/android-chrome-512x512.png', express.static('../app/build/android-chrome-512x512.png'));
app.use('/mstile-150x150.png', express.static('../app/build/mstile-150x150.png'));
app.use('/browserconfig.xml', express.static('../app/build/browserconfig.xml'));

app.use('/static/uploads', express.static(path.resolve(__dirname, '../public/uploads')));

app.use('/', fileUploadApi);
app.use('/api', api);

if (!isDevServer()) {
    app.get('*', function response(req, res) {
        res.set('Cache-Control', 'no-cache');
        res.sendFile(path.join(__dirname, '../app/build/', 'index.html'));
    });

    app.listen(5000, function () {
        console.log('Example app listening on port 5000!');
    });
}

module.exports = app;
