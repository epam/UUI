const { getCspHeaderValue } = require('../cspUtil');

describe('cspUtil', () => {
    describe('getCspHeaderValue', () => {
        it('should create CSP for PROD', () => {
            const headerValue = getCspHeaderValue(false);
            expect(headerValue).toEqual("default-src 'self' https://*.epam.com; style-src 'self' 'unsafe-inline' https://*.pages.dev https://*.epam.com https://cdnjs.cloudflare.com/ https://fonts.googleapis.com/; font-src 'self' https://*.pages.dev https://*.epam.com https://fonts.gstatic.com/; connect-src 'self' https://*.pages.dev https://*.epam.com https://api.amplitude.com/ wss://menu.epam.com/ https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com; frame-src *; img-src * data: ; script-src 'self' https://*.epam.com https://www.googletagmanager.com/ https://www.google-analytics.com/;");
        });
        it('should create CSP for DEV', () => {
            const headerValue = getCspHeaderValue(true);
            expect(headerValue).toEqual("default-src 'self' https://*.epam.com; style-src 'self' 'unsafe-inline' http://localhost:* https://*.pages.dev https://*.epam.com https://cdnjs.cloudflare.com/ https://fonts.googleapis.com/; font-src 'self' http://localhost:* https://*.pages.dev https://*.epam.com https://fonts.gstatic.com/; connect-src 'self' http://localhost:* https://*.pages.dev https://*.epam.com https://api.amplitude.com/ wss://menu.epam.com/ https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com; frame-src *; img-src * data: ; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://*.epam.com https://www.googletagmanager.com/ https://www.google-analytics.com/;");
        });
    });
});
