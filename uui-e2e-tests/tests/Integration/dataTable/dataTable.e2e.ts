import { test } from '../../../framework/fixtures/integrationTestPage/fixture';
import { setupDocExampleTest } from '../testUtils';
import { DataTableObject } from '../../../framework/pageObjects/dataTableObject';

test('DataTable/TableWithFilters', async ({ pageWrapper }, testInfo) => {
    const { pageObject, expectScreenshot } = await setupDocExampleTest({
        testInfo,
        pageWrapper,
        PageObjectConstructor: DataTableObject,
        testUrl: '/docExample?theme=loveship&examplePath=tables%2FColumnFiltersTable',
    });

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

    await test.step('Move focus to column sorting', async () => {
        await pageObject.moveFocusForward();
        await expectScreenshot(4, 'focus-columns-sorting');
    });

    await test.step('Toggle sorting to descending value', async () => {
        await pageObject.page.keyboard.press('Space'); // toggle to asc
        await pageObject.page.keyboard.press('Space'); // toggle to desc
        await pageObject.expectRowNameInViewport('Zachary van Kesteren');
        await expectScreenshot(5, 'toggler-column-sorting');
    });

    await test.step('Move focus on next column filter', async () => {
        await pageObject.moveFocusForward();
        await expectScreenshot(6, 'focus-column-filter');
    });

    await test.step('Open column filter', async () => {
        await pageObject.page.keyboard.press('Enter');
        await expectScreenshot(7, 'open-column-filter');
    });

    await test.step('Toggle sorting from column filter', async () => {
        await pageObject.moveFocusForward(); // Move focus to the Descending sort
        await pageObject.page.keyboard.press('Enter');
        await pageObject.expectRowNameInViewport('Lillie Marchal');
        await expectScreenshot(8, 'toggler-sorting-from-column-filter');
    });

    await test.step('Choose Success filter option', async () => {
        await pageObject.moveFocusForward(); // Move focus to the filter list
        await pageObject.page.keyboard.press('ArrowDown');
        await pageObject.page.keyboard.press('Enter');
        await pageObject.expectRowNameInViewport('Joshua Munoz');
        await expectScreenshot(9, 'choose-Success-filter-option');
    });

    await test.step('Close filter by Esc', async () => {
        await pageObject.page.keyboard.press('Escape');
        await expectScreenshot(10, 'close-filter');
    });

    await test.step('Open columns config modal', async () => {
        await pageObject.moveFocusForward(5);// Move focus 5 times

        await pageObject.page.keyboard.press('Space'); // Open modal

        await expectScreenshot(11, 'open-column-config');
    });

    await test.step('Hide salary column from columns config modal', async () => {
        await pageObject.moveFocusForward(10);// Move focus 10 times

        await pageObject.page.keyboard.press('Space'); // Open modal

        await expectScreenshot(12, 'hide-salary-column');
    });

    await test.step('Close columns config modal', async () => {
        await pageObject.page.keyboard.press('Escape'); // Close modal

        await expectScreenshot(13, 'close-column-config');
    });

    await test.step('Select first and second row', async () => {
        await pageObject.moveFocusForward();

        await pageObject.page.keyboard.press('Space'); // Select first item
        await pageObject.waitFocusedCheckboxIsChecked();

        await pageObject.moveFocusForward();
        await pageObject.page.keyboard.press('Space'); // Select second item
        await pageObject.waitFocusedCheckboxIsChecked();

        await expectScreenshot(14, 'select-rows');
    });
});
