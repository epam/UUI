import { PreviewPage } from './previewPage';
import { PREVIEW_URL } from '../../constants';
import path from 'node:path';

import { test as baseTest } from '@playwright/test';
import { mockApi } from '../../mocks/apiMocks';
import { TEngine } from '../../types';
import { timeoutForFixture } from '../../../playwright.config';
import { AbsPage, IPageParams } from '../shared/absPage';

interface IFixtureBuilderParams<TPageWrapper> {
    initialUrl: string;
    PageWrapperConstructor: { new (params: IPageParams): TPageWrapper; };
    extraStyles?: string;
}

function buildFixture<TPageWrapper extends AbsPage>(builderParams: IFixtureBuilderParams<TPageWrapper>) {
    const { initialUrl, PageWrapperConstructor, extraStyles } = builderParams;
    return baseTest.extend<{}, { pageWrapper: TPageWrapper }>({
        pageWrapper: [
            async ({ browser }, use, { project }) => {
                const engine = project.name as TEngine;
                const context = await browser.newContext({ bypassCSP: true });
                let pageWrapper: TPageWrapper | undefined;
                try {
                    const page = await context.newPage();
                    await mockApi(page);
                    pageWrapper = new PageWrapperConstructor({ page, engine, initialUrl, extraStyles });
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

export const test = buildFixture({
    PageWrapperConstructor: PreviewPage,
    initialUrl: PREVIEW_URL,
    extraStyles: path.join(__dirname, 'screenshot.css'),
});
