import { test as baseTest } from '@playwright/test';
import { mockApi } from '../../mocks/apiMocks';
import { TEngine } from '../../types';
import { type AbsPage, type IPageParams } from './absPage';

interface IFixtureBuilderParams<TPageWrapper> {
    initialUrl: string;
    PageWrapperConstructor: { new (params: IPageParams): TPageWrapper; };
    extraStyles?: string;
}

export function buildFixture<TPageWrapper extends AbsPage>(builderParams: IFixtureBuilderParams<TPageWrapper>) {
    const { initialUrl, PageWrapperConstructor, extraStyles } = builderParams;
    return baseTest.extend<{ pageWrapper: TPageWrapper }>({
        pageWrapper: async ({ page }, use, { project }) => {
            const engine = project.name as TEngine;
            await mockApi(page);
            const pageWrapper = new PageWrapperConstructor({ page, engine, initialUrl, extraStyles });
            await pageWrapper!.openInitialPage();
            await use(pageWrapper!);
        },
        bypassCSP: true,
    });
}
