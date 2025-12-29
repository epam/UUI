import { test } from '../../../framework/fixtures';
import { setupDocExampleTest } from '../testUtils';
import { PinnedRowsDataTableObject } from '../../../framework/pageObjects';

test('DataTable: Pinned rows.', async ({ pageWrapper }, testInfo) => {
    const { pageObject, expectScreenshot } = await setupDocExampleTest({
        testInfo,
        pageWrapper,
        PageObjectConstructor: PinnedRowsDataTableObject,
        testUrl: PinnedRowsDataTableObject.testUrl,
    });

    await pageObject.waitForTableRendered();
    await test.step('Unfold parent row', async () => {
        await pageObject.unfold('Africa');
        await pageObject.unfold('Angola');
        await expectScreenshot(1, 'unfold-africa-and-angola');
    });

    await test.step('Scroll', async () => {
        await pageObject.scrollScreen(500);
        await pageObject.expectRowNameInViewport('Namibe', false);
        await expectScreenshot(2, 'pinned-rows-africa-angola');
    });
});
