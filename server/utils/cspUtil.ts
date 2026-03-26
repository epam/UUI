import { CODESANDBOX_APEX_ORIGIN, EXTERNAL_API_CORS_CONNECT_SOURCES } from './externalConnectOrigins';

// Origins where custom themes are hosted
const CUSTOM_THEME_ASSETS = {
    // On localhost
    LOCAL: 'http://localhost:*',
    // On external server. TODO: probably we should limit to specific pages deployed to CF, not entire CF
    CLOUDFLARE_PAGES: 'https://*.pages.dev',
};

const SCRIPT_ORIGINS = [
    "'self'",
    'https://*.epam.com',
    'https://www.googletagmanager.com/',
    'https://www.google-analytics.com/',
    'https://*.amplitude.com',
    'https://cookie-cdn.cookiepro.com',
].join(' ');

const CONNECT_ORIGINS = [
    "'self'",
    ...EXTERNAL_API_CORS_CONNECT_SOURCES,
    CODESANDBOX_APEX_ORIGIN,
    'https://*.amplitude.com/',
    'wss://menu.epam.com/',
    'https://*.google-analytics.com',
    'https://*.analytics.google.com',
    'https://*.googletagmanager.com',
    'https://cookie-cdn.cookiepro.com',
    'https://geolocation.onetrust.com/',
    'https://privacyportal.cookiepro.com/',
    'https://cdnjs.cloudflare.com/ajax/libs/prism/1.20.0/themes/prism-coy.min.css.map',
].join(' ');

/**
 * Builds a secure Content-Security-Policy header value.
 * Uses nonce for inline scripts to avoid 'unsafe-inline' (XSS protection).
 * Note: style-src keeps 'unsafe-inline' - React uses inline style attributes extensively.
 * Removing it would require refactoring all style={} to CSS classes.
 *
 * @param isDevServer - Whether running in development mode
 * @param nonce - Optional nonce for inline scripts (required to pass CSP security tests in production)
 */
export function getCspHeaderValue(isDevServer: boolean, nonce?: string) {
    const scriptNonce = nonce ? `'nonce-${nonce}'` : '';

    const styleSrc = [
        "'self'",
        // Note: nonce is NOT used for style-src - it would disable 'unsafe-inline',
        // but inline styles via style={} or element.style.xxx cannot use nonce
        isDevServer && CUSTOM_THEME_ASSETS.LOCAL,
        CUSTOM_THEME_ASSETS.CLOUDFLARE_PAGES,
        'https://*.epam.com',
        'https://cdnjs.cloudflare.com/',
        'https://fonts.googleapis.com/',
        // React style={} and many libs use inline styles
        "'unsafe-inline'",
    ].filter(Boolean).join(' ');

    const scriptSrc = [
        "'self'",
        scriptNonce,
        isDevServer && "'unsafe-eval'",
        isDevServer && !nonce && "'unsafe-inline'",
        SCRIPT_ORIGINS,
    ].filter(Boolean).join(' ');

    const fontSrc = [
        "'self'",
        isDevServer && CUSTOM_THEME_ASSETS.LOCAL,
        CUSTOM_THEME_ASSETS.CLOUDFLARE_PAGES,
        'https://*.epam.com',
        'https://fonts.gstatic.com/',
    ].filter(Boolean).join(' ');

    const connectSrc = [
        "'self'",
        isDevServer && CUSTOM_THEME_ASSETS.LOCAL,
        CUSTOM_THEME_ASSETS.CLOUDFLARE_PAGES,
        CONNECT_ORIGINS,
    ].filter(Boolean).join(' ');

    return [
        "default-src 'none'",
        "base-uri 'self'",
        "form-action 'self' https://codesandbox.io",
        "frame-ancestors 'self'",
        "object-src 'none'",
        `script-src ${scriptSrc}`,
        `style-src ${styleSrc}`,
        `font-src ${fontSrc}`,
        `connect-src ${connectSrc}`,
        // RTE iframePlugin embeds arbitrary URLs; CookiePro/GTM use iframes
        "frame-src 'self' https:",
        "img-src 'self' data: https: blob:",
        "media-src 'self' https:",
        "manifest-src 'self'",
    ].join('; ');
}
