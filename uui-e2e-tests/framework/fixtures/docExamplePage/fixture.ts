import { Page, test as baseTest } from '@playwright/test';
import { mockApi } from '../../mocks/apiMocks';
import { timeoutForFixture } from '../../../playwright.config';
import { TEngine } from '../../types';
import { DocExamplePage } from './docExamplePage';

const test = baseTest.extend<{}, { docExamplePage: DocExamplePage }>({
    docExamplePage: [
        async ({ browser }, use, { project }) => {
            const context = await browser.newContext();
            let page: Page | undefined;
            let docExamplePage: DocExamplePage | undefined;
            try {
                page = await context.newPage();
                await mockApi(page);
                docExamplePage = new DocExamplePage({ page, engine: project.name as TEngine });
                await docExamplePage.goto();
                await page.waitForTimeout(50);
                await use(docExamplePage);
            } finally {
                docExamplePage && await docExamplePage.close();
                await context.close();
            }
        },
        { scope: 'worker', timeout: timeoutForFixture },
    ],
});

export { test };
