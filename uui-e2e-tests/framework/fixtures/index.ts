import { Page, test as baseTest } from '@playwright/test';
import { mockApi } from '../mocks/apiMocks';
import { PreviewPage } from '../pages/previewPage';
import { stylePath, timeoutForFixture } from '../../playwright.config';
import { TEngine } from '../types';

const test = baseTest.extend<{}, { previewPage: PreviewPage }>({
    previewPage: [
        async ({ browser }, use, { project }) => {
            const context = await browser.newContext();
            let page: Page | undefined;
            let previewPage: PreviewPage | undefined;
            try {
                page = await context.newPage();
                await mockApi(page);
                previewPage = new PreviewPage({ page, engine: project.name as TEngine });
                await previewPage.goto();
                await page.addStyleTag({ path: stylePath });
                await page.waitForTimeout(50);
                await use(previewPage);
            } finally {
                previewPage && await previewPage.close();
                await context.close();
            }
        },
        { scope: 'worker', timeout: timeoutForFixture },
    ],
});

export { test };
