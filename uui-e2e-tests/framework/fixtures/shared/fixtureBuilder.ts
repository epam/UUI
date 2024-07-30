import { test as baseTest } from '@playwright/test';
import { mockApi } from '../../mocks/apiMocks';
import { TEngine } from '../../types';
import { timeoutForFixture } from '../../../playwright.config';
import { type AbsPage, type IPageParams } from './absPage';

export function buildFixture<TPageWrapper extends AbsPage>(
    initialUrl: string,
    PageWrapperConstructor: { new (params: IPageParams): TPageWrapper; },
) {
    return baseTest.extend<{}, { pageWrapper: TPageWrapper }>({
        pageWrapper: [
            async ({ browser }, use, { project }) => {
                const engine = project.name as TEngine;
                const context = await browser.newContext();
                let pageWrapper: TPageWrapper | undefined;
                try {
                    const page = await context.newPage();
                    await mockApi(page);
                    pageWrapper = new PageWrapperConstructor({ page, engine, initialUrl });
                    await pageWrapper!.openInitialPage();
                    await page.waitForTimeout(50);
                    await use(pageWrapper!);
                } finally {
                    pageWrapper && await pageWrapper.close();
                    await context.close();
                }
            },
            { scope: 'worker', timeout: timeoutForFixture },
        ],
    });
}
