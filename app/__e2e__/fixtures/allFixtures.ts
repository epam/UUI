import { Page, test as baseTest } from '@playwright/test';
import { PropEditor } from './propEditor';
import { TTheme } from './types';

const ORIGINS_TO_ABORT = [
    'https://www.googletagmanager.com',
    'https://api.amplitude.com',
    'https://apm-sandbox.cloudapp.epam.com',
    'https://menu.epam.com',
];

const PATH_TO_ABORT = [
    '/ajax/libs/prism/1.20.0/themes/prism-coy.min.css',
];

async function mockApi(page: Page) {
    await page.route(
        (url: URL) => (ORIGINS_TO_ABORT.indexOf(url.origin) !== -1 || PATH_TO_ABORT.indexOf(url.pathname) !== -1),
        async (route) => await route.abort(),
    );
}

const test = baseTest.extend<{}, { propEditor: PropEditor }>({
    propEditor: [
        async ({ browser }, use) => {
            const context = await browser.newContext();
            const page = await context.newPage();
            try {
                await mockApi(page);
                const pePage = new PropEditor(page);
                // We open any component at the very beginning. No matter whether it supports preview or not.
                await pePage.goto({
                    theme: TTheme.promo,
                    isSkin: false,
                });
                await use(pePage);
            } finally {
                await context.close();
            }
        },
        { scope: 'worker' },
    ],
});

export { test };
