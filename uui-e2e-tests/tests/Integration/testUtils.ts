import type { Page, TestInfo } from '@playwright/test';
import { type DocExamplePage } from '../../framework/fixtures/docExamplePage/docExamplePage';

export enum DocExamplePath {
    'pickerInput/LazyTreeInput' = 'pickerInput/LazyTreeInput',
    'Dropdown / Scrolling behavior' = '/preview?theme=loveship&isSkin=true&componentId=dropdown&previewId=json%3A%7B"id"%3A""%2C"context"%3A"Default"%2C"matrix"%3A%7B%7D%7D',
    'Dropdown / Boundary mode' = '/preview?theme=loveship&isSkin=true&componentId=dropdown&previewId=json%3A%7B%22id%22%3A%22%22%2C%22context%22%3A%22Default%22%2C%22matrix%22%3A%7B%22openOnHover%22%3A%7B%22examples%22%3A%5B%22true%22%5D%7D%2C%22closeOnMouseLeave%22%3A%7B%22examples%22%3A%5B%22boundary%22%5D%7D%7D%7D'
}

interface IDocExampleTestSetupBase<TPageObject> {
    testInfo: TestInfo,
    pageWrapper: DocExamplePage,
    PageObjectConstructor: new (page: Page) => TPageObject
}

interface IDocExampleTestSetupWithUrl<TPageObject> extends IDocExampleTestSetupBase<TPageObject> {
    testUrl: string;
}

interface IDocExampleTestSetupWithPath<TPageObject> extends IDocExampleTestSetupBase<TPageObject> {
    examplePath: DocExamplePath;
}

type IDocExampleTestSetup<TPageObject> = IDocExampleTestSetupWithUrl<TPageObject> | IDocExampleTestSetupWithPath<TPageObject>;

export async function setupDocExampleTest<TPageObject>(params: IDocExampleTestSetup<TPageObject>) {
    const { pageWrapper, testInfo, PageObjectConstructor } = params;
    // The timeout is increased for all doc example tests, because such tests contain many assertions.
    testInfo.setTimeout(testInfo.timeout * 3);
    if ('testUrl' in params) {
        await pageWrapper.clientRedirectTo(params.testUrl);
    } else {
        await pageWrapper.clientRedirectToExample({ examplePath: params.examplePath });
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
