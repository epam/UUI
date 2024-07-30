import type { Page, TestInfo } from '@playwright/test';
import { type DocExamplePage } from '../../framework/fixtures/docExamplePage/docExamplePage';

export enum DocExamplePath {
    'pickerInput/LazyTreeInput' = 'pickerInput/LazyTreeInput'
}

interface IDocExampleTestSetup<TPageObject> {
    testInfo: TestInfo,
    examplePath: DocExamplePath,
    pageWrapper: DocExamplePage,
    PageObjectConstructor: new (page: Page) => TPageObject
}

export async function setupDocExampleTest<TPageObject>(params: IDocExampleTestSetup<TPageObject>) {
    const { pageWrapper, testInfo, examplePath, PageObjectConstructor } = params;
    await pageWrapper.clientRedirect({ examplePath });
    const pageObject = new PageObjectConstructor(pageWrapper.page);
    const expectScreenshot = async (stepName: string) => {
        const screenshotName = `${testInfo.title}_${stepName}.png`;
        await pageWrapper.expectScreenshot(screenshotName);
    };
    return { pageObject, expectScreenshot };
}
