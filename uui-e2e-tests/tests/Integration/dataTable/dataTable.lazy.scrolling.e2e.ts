import { DataTableObject } from '../../../framework/pageObjects';
import { test } from '../../../framework/fixtures';
import { setupDocExampleTest } from '../testUtils';

test.describe('DataTable Lazy: Scrolling', () => {
    test('Load extra data with scroll', async ({ pageWrapper }, testInfo) => {
        const { pageObject, expectScreenshot } = await setupDocExampleTest({
            testInfo,
            pageWrapper,
            PageObjectConstructor: DataTableObject,
            testUrl: '/docExample?theme=loveship&examplePath=tables%2FColumnFiltersTable',
        });

        await pageObject.waitForTableRendered();
        await test.step('Scroll', async () => {
            await pageObject.scrollScreen();
            await pageObject.expectRowNameInViewport('Abbie Matsui', false);

            await expectScreenshot(1, 'loaded data');
        });
    });
});
