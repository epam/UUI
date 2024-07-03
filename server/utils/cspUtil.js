module.exports = { getCspHeaderValue };

// Origins where custom themes are hosted
const CUSTOM_THEME_ASSETS = {
    // On localhost
    LOCAL: 'http://localhost:*',
    // On external server. TODO: probably we should limit to specific pages deployed to CF, not entire CF
    CLOUDFLARE_PAGES: 'https://*.pages.dev',
};

/**
 * @param isDevServer {boolean}
 * @returns {string}
 */
function getCspHeaderValue(isDevServer) {
    return join(
        "default-src 'self' https://*.epam.com; ",
        dir(
            "style-src 'self' 'unsafe-inline'",
            isDevServer && CUSTOM_THEME_ASSETS.LOCAL,
            CUSTOM_THEME_ASSETS.CLOUDFLARE_PAGES,
            'https://*.epam.com https://cdnjs.cloudflare.com/ https://fonts.googleapis.com/',
        ),
        dir(
            "font-src 'self'",
            isDevServer && CUSTOM_THEME_ASSETS.LOCAL,
            CUSTOM_THEME_ASSETS.CLOUDFLARE_PAGES,
            'https://*.epam.com https://fonts.gstatic.com/',
        ),
        dir(
            "connect-src 'self'",
            isDevServer && CUSTOM_THEME_ASSETS.LOCAL,
            CUSTOM_THEME_ASSETS.CLOUDFLARE_PAGES,
            'https://*.epam.com https://*.amplitude.com/ wss://menu.epam.com/ https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com',
        ),
        'frame-src *; ',
        'img-src * data: ; ',
        dir(
            "script-src 'self'",
            "'unsafe-inline'",
            isDevServer && "'unsafe-eval'",
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
