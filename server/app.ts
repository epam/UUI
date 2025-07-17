import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import api from './api';
import fileUploadApi from './api/fileUpload';
import { isDevServer } from './utils/envUtils';
import actuator from 'express-actuator';
import staticMiddleware from './static';
import { getCspHeaderValue } from './utils/cspUtil';

export const app = express();

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
    res.set('Content-Security-Policy', getCspHeaderValue(isDevServer()));
    res.removeHeader('X-Powered-By');

    next();
});

app.use(actuator({ basePath: '/actuator' }));

app.use('/upload', fileUploadApi);
app.use('/api', api);

app.use(staticMiddleware);

if (!isDevServer()) {
    app.get('*', function response(req, res) {
        const indexPath = path.resolve(__dirname, '../../app/build/index.html');
        res.set('Cache-Control', 'no-cache');
        res.sendFile(indexPath);
    });
    app.listen(5000, () => {
        // eslint-disable-next-line no-console
        console.log('Example app listening on port 5000!');
    });
}
