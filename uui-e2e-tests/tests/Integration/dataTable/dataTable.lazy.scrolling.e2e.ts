import { ColumnFiltersDataTableObject } from '../../../framework/pageObjects';
import { test } from '../../../framework/fixtures';
import { setupDocExampleTest } from '../testUtils';

test.describe('DataTable Lazy: Scrolling', () => {
    test('Load extra data with scroll', async ({ pageWrapper }, testInfo) => {
        const { pageObject, expectScreenshot } = await setupDocExampleTest({
            testInfo,
            pageWrapper,
            PageObjectConstructor: ColumnFiltersDataTableObject,
            testUrl: ColumnFiltersDataTableObject.testUrl,
        });

        await pageObject.waitForTableRendered();
        await test.step('Scroll', async () => {
            await pageObject.scrollScreen(2);
            await pageObject.expectRowNameInViewport('Abbie Matsui', false);

            await expectScreenshot(1, 'loaded data');
        });
    });
});
