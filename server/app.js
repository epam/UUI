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
const staticMiddleware = require('./static');

const app = express();

!isDevServer() && app.use(logger('dev'));

app.use(express.json({ limit: '200mb' }));
app.use(express.urlencoded({ limit: '200mb', extended: true }));
app.use(fileUpload());
app.use(cookieParser());
app.use(cors({ credentials: false }));

app.use((req, res, next) => {
    res.set('X-XSS-Protection', '1; mode=block');
    res.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains');
    res.set('x-frame-options', 'SAMEORIGIN');
    res.set('X-Content-Type-Options', 'nosniff');
    res.set(
        'Content-Security-Policy',
        "default-src 'self' https://*.epam.com;"
        + "style-src 'self' 'unsafe-inline' https://*.epam.com https://cdnjs.cloudflare.com/ https://fonts.googleapis.com/; "
        + "font-src 'self' https://*.epam.com https://fonts.gstatic.com/; "
        + "connect-src 'self' https://*.epam.com https://api.amplitude.com/ wss://menu.epam.com/*' https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com; "
        + 'frame-src *; '
        + 'img-src * data: ; '
        + `script-src 'self' ${isDevServer() ? "'unsafe-eval' 'unsafe-inline'" : ''} https://*.epam.com https://www.googletagmanager.com/ https://www.google-analytics.com/;`,
    );

    next();
});

app.use(actuator({ basePath: '/actuator' }));

app.use('/upload', fileUploadApi);
app.use('/api', api);

app.use(staticMiddleware);

if (!isDevServer()) {
    app.get('*', function response(req, res) {
        res.set('Cache-Control', 'no-cache');
        res.sendFile(path.join(__dirname, '../app/build/', 'index.html'));
    });

    app.listen(5500, () => {
        // eslint-disable-next-line no-console
        console.log('Example app listening on port 5500!');
    });
}

module.exports = app;
