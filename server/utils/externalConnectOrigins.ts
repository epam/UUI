/**
 * Shared CSP `connect-src` host sources and CORS allowlist for cross-origin API access
 * (e.g. CodeSandbox previews calling https://uui.epam.com/api/*).
 * CORS cannot use mid-host wildcards in headers; use {@link isCorsAllowedOrigin} for pattern matching.
 */
export const EXTERNAL_API_CORS_CONNECT_SOURCES = [
    'https://*.epam.com',
    'https://*.codesandbox.io',
    'https://*.csb.app',
] as const;

/** Apex host used by CodeSandbox; `*.codesandbox.io` does not match this in CSP. */
export const CODESANDBOX_APEX_ORIGIN = 'https://codesandbox.io';

/**
 * Mirrors {@link EXTERNAL_API_CORS_CONNECT_SOURCES} (CSP `*.host` semantics) for the `Origin` header.
 * Allows requests with no `Origin` (non-browser, same-origin, some navigations).
 */
export function isCorsAllowedOrigin(origin: string | undefined): boolean {
    if (origin == null || origin === '') {
        return true;
    }
    if (origin === CODESANDBOX_APEX_ORIGIN) {
        return true;
    }
    // https://*.epam.com — one or more subdomains of epam.com
    if (/^https:\/\/(?:[a-z0-9-]+\.)+epam\.com$/i.test(origin)) {
        return true;
    }
    // https://*.codesandbox.io — single-label subdomain (e.g. api.codesandbox.io)
    if (/^https:\/\/[a-z0-9-]+\.codesandbox\.io$/i.test(origin)) {
        return true;
    }
    // https://*.csb.app — preview hosts (e.g. jzjwfh.csb.app)
    if (/^https:\/\/[a-z0-9-]+\.csb\.app$/i.test(origin)) {
        return true;
    }
    return false;
}
