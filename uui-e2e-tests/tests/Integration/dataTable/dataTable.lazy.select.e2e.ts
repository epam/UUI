import { test } from '../../../framework/fixtures/integrationTestPage/fixture';
import { setupDocExampleTest } from '../testUtils';
import { DataTableObject } from '../../../framework/pageObjects/dataTableObject';

test('DataTable Lazy: Select All/Unselect All.', async ({ pageWrapper }, testInfo) => {
    const { pageObject, expectScreenshot } = await setupDocExampleTest({
        testInfo,
        pageWrapper,
        PageObjectConstructor: DataTableObject,
        testUrl: '/docExample?theme=loveship&examplePath=tables%2FColumnFiltersTable',
    });

    await pageObject.waitForTableRendered();
    await test.step('Select all items', async () => {
        await pageObject.clickSelectAllCheckbox();
        await pageObject.waitSelectAllCheckboxToBeChecked();
        await expectScreenshot(1, 'select-all-items');
    });

    await test.step('Unselect all items', async () => {
        await pageObject.clickSelectAllCheckbox();
        await pageObject.waitSelectAllCheckboxToBeNotChecked();
        await expectScreenshot(2, 'unselect-all-items');
    });
});

test('DataTable Lazy: Select All/Unselect All. [Using keyboard]', async ({ pageWrapper }, testInfo) => {
    const { pageObject, expectScreenshot } = await setupDocExampleTest({
        testInfo,
        pageWrapper,
        PageObjectConstructor: DataTableObject,
        testUrl: '/docExample?theme=loveship&examplePath=tables%2FColumnFiltersTable',
    });

    await pageObject.waitForTableRendered();
    await test.step('Put focus on selectAll checkbox', async () => {
        await pageObject.focusFirstElement();
        await expectScreenshot(1, 'first-element-focus');
    });

    await test.step('Select all items', async () => {
        await pageObject.page.keyboard.press('Space');
        await pageObject.waitFocusedCheckboxIsChecked();
        await expectScreenshot(2, 'select-all-items');
    });

    await test.step('Unselect all items', async () => {
        await pageObject.page.keyboard.press('Space');
        await pageObject.waitFocusedCheckboxIsNotChecked();
        await expectScreenshot(3, 'unselect-all-items');
    });
});
