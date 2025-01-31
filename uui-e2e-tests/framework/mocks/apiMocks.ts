import { Page } from '@playwright/test';

const ORIGINS_TO_ABORT = [
    'https://www.googletagmanager.com',
    'https://api.amplitude.com',
    'https://apm-sandbox.cloudapp.epam.com',
    'https://menu.epam.com',
    'https://cookie-cdn.cookiepro.com',
];

const PATH_TO_ABORT = [
    '/ajax/libs/prism/1.20.0/themes/prism-coy.min.css',
];

export async function mockApi(page: Page) {
    await page.route(
        (url: URL) => (ORIGINS_TO_ABORT.indexOf(url.origin) !== -1 || PATH_TO_ABORT.indexOf(url.pathname) !== -1),
        async (route) => await route.abort(),
    );
}
