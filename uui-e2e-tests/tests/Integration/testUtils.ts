import type { Page, TestInfo } from '@playwright/test';
import { type DocExamplePage } from '../../framework/fixtures/docExamplePage/docExamplePage';

export enum DocExamplePath {
    'pickerInput/LazyTreeInput' = 'pickerInput/LazyTreeInput'
}

interface IDocExampleTestSetup<TPageObject> {
    testInfo: TestInfo,
    examplePath?: DocExamplePath,
    pageWrapper: DocExamplePage,
    testUrl?: string;
    PageObjectConstructor: new (page: Page) => TPageObject
}

export async function setupDocExampleTest<TPageObject>(params: IDocExampleTestSetup<TPageObject>) {
    const { pageWrapper, testInfo, examplePath, testUrl, PageObjectConstructor } = params;
    // The timeout is increased for all doc example tests, because such tests contain many assertions.
    testInfo.setTimeout(testInfo.timeout * 3);
    if (params.testUrl) {
        await pageWrapper.clientRedirectTo(testUrl!);
    } else {
        await pageWrapper.clientRedirectToExample({ examplePath: examplePath! });
    }
    const expectScreenshot = async (stepNumber: number, stepName: string) => {
        const stepNumberPadded = numberWithLeadingZeros(stepNumber, 2);
        const screenshotName = `${testInfo.title}_step-${stepNumberPadded}-${stepName}.png`;
        await pageWrapper.expectScreenshot(screenshotName);
    };
    const pageObject = new PageObjectConstructor(pageWrapper.page);
    return { pageObject, expectScreenshot };
}

function numberWithLeadingZeros(number: number, minimumLength: number) {
    const paddingSize = minimumLength - String(number).length;
    const padding = paddingSize > 0 ? Array(paddingSize).fill('0').join('') : '';
    return `${padding}${number}`;
}
