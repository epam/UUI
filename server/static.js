const express = require('express');
const { isDevServer } = require('./utils/envUtils');
const path = require('path');

const router = express.Router();

const serveStatic = (staticPath) => {
    return express.static(staticPath, {
        setHeaders: (res) => {
            !isDevServer() && res.set('Cache-Control', 'public,max-age=2592000,immutable');
        },
    });
};
router.use('/static', serveStatic(path.join(__dirname, '../app/build/static')));

router.use('/favicon.ico', serveStatic('../app/build/favicon.ico'));
router.use('/favicon-32x32.png', serveStatic('../app/build/favicon-32x32.png'));
router.use('/favicon-16x16.png', serveStatic('../app/build/favicon-16x16.png'));
router.use('/safari-pinned-tab.svg', serveStatic('../app/build/safari-pinned-tab.svg'));
router.use('/apple-touch-icon.png', serveStatic('../app/build/apple-touch-icon.png'));
router.use('/android-chrome-192x192.png', serveStatic('../app/build/android-chrome-192x192.png'));
router.use('/android-chrome-512x512.png', serveStatic('../app/build/android-chrome-512x512.png'));
router.use('/mstile-150x150.png', serveStatic('../app/build/mstile-150x150.png'));
router.use('/browserconfig.xml', serveStatic('../app/build/browserconfig.xml'));
router.use('/robots.txt', serveStatic('../app/build/robots.txt'));

router.use('/static/uploads', serveStatic(path.resolve(__dirname, '../public/uploads')));

router.use('/manifest.json', express.static('../app/build/manifest.json'));

module.exports = router;
