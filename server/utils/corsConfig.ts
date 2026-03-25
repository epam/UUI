import cors from 'cors';
import { isCorsAllowedOrigin } from './externalConnectOrigins';

/**
 * Public API and static assets must be callable from third-party origins (e.g. CodeSandbox previews)
 * that load examples against https://uui.epam.com. CSP connect-src applies to our own HTML documents,
 * not to fetches initiated inside an external sandbox; those rely on CORS.
 *
 * Allowed origins match `EXTERNAL_API_CORS_CONNECT_SOURCES` in `externalConnectOrigins.ts` (CSP `connect-src`).
 */
export const corsMiddleware = cors({
    credentials: false,
    origin: (origin, callback) => {
        callback(null, isCorsAllowedOrigin(origin));
    },
    methods: ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    maxAge: 86400,
});
