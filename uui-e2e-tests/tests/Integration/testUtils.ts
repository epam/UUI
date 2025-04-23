import type { Page, TestInfo } from '@playwright/test';
import { type IntegrationTestPage } from '../../framework/fixtures/integrationTestPage/IntegrationTestPage';

interface IDocExampleTestSetupWithUrl<TPageObject> {
    testUrl: string;
    testInfo: TestInfo,
    pageWrapper: IntegrationTestPage,
    PageObjectConstructor: new (page: Page) => TPageObject
}

type IDocExampleTestSetup<TPageObject> = IDocExampleTestSetupWithUrl<TPageObject>;

export async function setupDocExampleTest<TPageObject>(params: IDocExampleTestSetup<TPageObject>) {
    const { pageWrapper, testInfo, PageObjectConstructor } = params;
    // The timeout is increased for all doc example tests, because such tests contain many assertions.
    testInfo.setTimeout(testInfo.timeout * 3);
    const [pathname, search] = params.testUrl.split('?');
    await pageWrapper.clientRedirectTo({ pathname, search });

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
