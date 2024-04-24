module.exports = { getCspHeaderValue };

const EXTRA_ASSETS_FOR_DEV = [
    'http://localhost:*',
].join(' ');

/**
 * @param isDevServer {boolean}
 * @returns {string}
 */
function getCspHeaderValue(isDevServer) {
    return join(
        "default-src 'self' https://*.epam.com; ",
        dir(
            "style-src 'self' 'unsafe-inline'",
            isDevServer && EXTRA_ASSETS_FOR_DEV,
            'https://*.pages.dev',
            'https://*.epam.com https://cdnjs.cloudflare.com/ https://fonts.googleapis.com/',
        ),
        dir(
            "font-src 'self'",
            isDevServer && EXTRA_ASSETS_FOR_DEV,
            'https://*.pages.dev',
            'https://*.epam.com https://fonts.gstatic.com/',
        ),
        dir(
            "connect-src 'self'",
            isDevServer && EXTRA_ASSETS_FOR_DEV,
            'https://*.pages.dev',
            'https://*.epam.com https://api.amplitude.com/ wss://menu.epam.com/* https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com',
        ),
        'frame-src *; ',
        'img-src * data: ; ',
        dir(
            "script-src 'self'",
            isDevServer && "'unsafe-eval' 'unsafe-inline'",
            'https://*.epam.com https://www.googletagmanager.com/ https://www.google-analytics.com/',
        ),
    );
}

function dir(...args) {
    return args.filter((i) => typeof i === 'string' && i.trim() !== '').join(' ') + '; ';
}

function join(...args) {
    return args.join('').trim();
}
