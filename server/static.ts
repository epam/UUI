import express from 'express';
import { isDevServer } from './utils/envUtils';
import path from 'path';

const router = express.Router();

const serveStatic = (staticPath) => {
    return express.static(staticPath, {
        setHeaders: (res) => {
            !isDevServer() && res.set('Cache-Control', 'public,max-age=2592000,immutable');
        },
    });
};
router.use('/static', serveStatic(path.join(__dirname, '../../app/build/static')));

router.use('/favicon.ico', serveStatic(path.join(__dirname, '../../app/build/favicon.ico')));
router.use('/favicon-32x32.png', serveStatic(path.join(__dirname, '../../app/build/favicon-32x32.png')));
router.use('/favicon-16x16.png', serveStatic(path.join(__dirname, '../../app/build/favicon-16x16.png')));
router.use('/safari-pinned-tab.svg', serveStatic(path.join(__dirname, '../../app/build/safari-pinned-tab.svg')));
router.use('/apple-touch-icon.png', serveStatic(path.join(__dirname, '../../app/build/apple-touch-icon.png')));
router.use('/android-chrome-192x192.png', serveStatic(path.join(__dirname, '../../app/build/android-chrome-192x192.png')));
router.use('/android-chrome-512x512.png', serveStatic(path.join(__dirname, '../../app/build/android-chrome-512x512.png')));
router.use('/mstile-150x150.png', serveStatic(path.join(__dirname, '../../app/build/mstile-150x150.png')));
router.use('/browserconfig.xml', serveStatic(path.join(__dirname, '../../app/build/browserconfig.xml')));
router.use('/robots.txt', serveStatic(path.join(__dirname, '../../app/build/robots.txt')));

router.use('/static/uploads', serveStatic(path.join(__dirname, '../../public/uploads')));

router.use('/manifest.json', express.static(path.join(__dirname, '../../app/build/manifest.json')));

export default router;
