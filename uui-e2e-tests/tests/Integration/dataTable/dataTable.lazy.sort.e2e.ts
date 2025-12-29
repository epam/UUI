import { expect } from '@playwright/test';
import { test } from '../../../framework/fixtures';
import { setupDocExampleTest } from '../testUtils';
import { ColumnFiltersDataTableObject, PinnedRowsDataTableObject } from '../../../framework/pageObjects';

test.describe('DataTable Lazy: Sorting', () => {
    test('Sort by columns.', async ({ pageWrapper }, testInfo) => {
        const { pageObject, expectScreenshot } = await setupDocExampleTest({
            testInfo,
            pageWrapper,
            PageObjectConstructor: ColumnFiltersDataTableObject,
            testUrl: ColumnFiltersDataTableObject.testUrl,
        });

        await pageObject.waitForTableRendered();
        await test.step('Toggle sorting to descending value', async () => {
            await pageObject.clickOnColumnHeader('Name');
            await pageObject.clickOnColumnHeader('Name');

            await pageObject.expectRowNameInViewport('Zachary van Kesteren');
            await expectScreenshot(1, 'toggler-column-sorting');
        });

        await test.step('Toggle sorting from column filter', async () => {
            await pageObject.openFilterModal('Profile Status'); // Move focus to the Descending sort
            await pageObject.applyDescSortingInFilterModal();

            await pageObject.expectRowNameInViewport('Lillie Marchal');
            await expectScreenshot(2, 'toggler-sorting-from-column-filter');
        });
    });

    test('Sort by columns. [Using keyboard]', async ({ pageWrapper }, testInfo) => {
        const { pageObject, expectScreenshot } = await setupDocExampleTest({
            testInfo,
            pageWrapper,
            PageObjectConstructor: ColumnFiltersDataTableObject,
            testUrl: ColumnFiltersDataTableObject.testUrl,
        });

        await pageObject.waitForTableRendered();
        await test.step('Move focus to column sorting', async () => {
            await pageObject.focusFirstElement();
            await pageObject.moveFocusForward();
            await expectScreenshot(1, 'using-keyboard-focus-columns-sorting');
        });

        await test.step('Toggle sorting to descending value', async () => {
            await pageObject.page.keyboard.press('Space'); // toggle to asc
            await pageObject.page.keyboard.press('Space'); // toggle to desc
            await pageObject.expectRowNameInViewport('Zachary van Kesteren');
            await expectScreenshot(2, 'using-keyboard-toggler-column-sorting');
        });

        await test.step('Move focus on next column filter', async () => {
            await pageObject.moveFocusForward();
            await expectScreenshot(3, 'using-keyboard-focus-column-filter');
        });

        await test.step('Open column filter', async () => {
            await pageObject.page.keyboard.press('Enter');
            await expectScreenshot(4, 'using-keyboard-open-column-filter');
        });

        await test.step('Toggle sorting from column filter', async () => {
            await pageObject.moveFocusForward(); // Move focus to the Descending sort
            await pageObject.page.keyboard.press('Enter');
            await pageObject.expectRowNameInViewport('Lillie Marchal');
            await expectScreenshot(5, 'using-keyboard-toggler-sorting-from-column-filter');
        });

        await test.step('Choose Success filter option', async () => {
            await pageObject.moveFocusForward(); // Move focus to the filter list
            await pageObject.page.keyboard.press('ArrowDown');
            await pageObject.page.keyboard.press('Enter');
            await pageObject.expectRowNameInViewport('Joshua Munoz');
            await expectScreenshot(6, 'using-keyboard-choose-Success-filter-option');
        });

        await test.step('Close filter by Esc', async () => {
            await pageObject.page.keyboard.press('Escape');
            await expectScreenshot(7, 'using-keyboard-close-filter');
        });

        await test.step('Open columns config modal', async () => {
            await pageObject.moveFocusForward(5);// Move focus 5 times

            await pageObject.page.keyboard.press('Space'); // Open modal

            await expectScreenshot(8, 'using-keyboard-open-column-config');
        });

        await test.step('Hide salary column from columns config modal', async () => {
            await pageObject.moveFocusForward(10);// Move focus 10 times

            await pageObject.page.keyboard.press('Space'); // Open modal

            await expectScreenshot(9, 'using-keyboard-hide-salary-column');
        });

        await test.step('Close columns config modal', async () => {
            await pageObject.page.keyboard.press('Escape'); // Close modal

            await expectScreenshot(10, 'using-keyboard-close-column-config');
        });

        await test.step('Select first and second row', async () => {
            await pageObject.moveFocusForward();

            await pageObject.page.keyboard.press('Space'); // Select first item
            await pageObject.waitFocusedCheckboxIsChecked();

            await pageObject.moveFocusForward();
            await pageObject.page.keyboard.press('Space'); // Select second item
            await pageObject.waitFocusedCheckboxIsChecked();

            await expectScreenshot(11, 'using-keyboard-select-rows');
        });
    });
});

test.describe('DataTable Lazy Tree: Sorting', () => {
    test('Sort by columns. [Using keyboard]', async ({ pageWrapper }, testInfo) => {
        const { pageObject, expectScreenshot } = await setupDocExampleTest({
            testInfo,
            pageWrapper,
            PageObjectConstructor: PinnedRowsDataTableObject,
            testUrl: PinnedRowsDataTableObject.testUrl,
        });

        await pageObject.waitForTableRendered();
        await test.step('Move focus to column sorting', async () => {
            await pageObject.focusFirstElement();
            await expectScreenshot(1, 'tree-using-keyboard-focus-columns-sorting');
        });

        await test.step('Toggle sorting to descending value', async () => {
            await pageObject.page.keyboard.press('Space'); // toggle to asc
            await pageObject.expectRowNameInViewport('Africa');

            await pageObject.page.keyboard.press('Space'); // toggle to desc
            await pageObject.expectRowNameInViewport('South America');
            await expectScreenshot(2, 'tree-using-keyboard-toggler-column-sorting');
        });

        await test.step('Move focus on next column filter', async () => {
            await pageObject.moveFocusForward();
            await expectScreenshot(3, 'tree-using-keyboard-focus-column-filter');
        });

        await test.step('Toggle sorting to descending value on the country column', async () => {
            await pageObject.page.keyboard.press('Space'); // toggle to asc
            await pageObject.page.keyboard.press('Space'); // toggle to desc
            await pageObject.expectRowNameInViewport('Africa');
            await expectScreenshot(4, 'tree-using-keyboard-toggler-column-sorting-country');

            await pageObject.moveFocusForward();
            await pageObject.moveFocusForward();
            await pageObject.page.keyboard.press('Space');

            const row = pageObject.getTableRows().nth(1);
            await expect(row).toContainText('Zimbabwe');
        });
    });

    test('Sort by columns.', async ({ pageWrapper }, testInfo) => {
        const { pageObject, expectScreenshot } = await setupDocExampleTest({
            testInfo,
            pageWrapper,
            PageObjectConstructor: PinnedRowsDataTableObject,
            testUrl: PinnedRowsDataTableObject.testUrl,
        });

        await pageObject.waitForTableRendered();

        await test.step('Toggle sorting to descending value', async () => {
            await pageObject.clickOnColumnHeader('Name');
            await pageObject.clickOnColumnHeader('Name');

            await pageObject.expectRowNameInViewport('South America');
            await expectScreenshot(1, 'tree-toggler-column-sorting');
        });

        await test.step('Toggle sorting to descending value on the country column', async () => {
            await pageObject.clickOnColumnHeader('Country');
            await pageObject.clickOnColumnHeader('Country');

            await pageObject.expectRowNameInViewport('Africa');
            await expectScreenshot(2, 'tree-toggler-column-sorting-country');
            await pageObject.unfold('Africa');

            const row = pageObject.getTableRows().nth(1);
            await expect(row).toContainText('Zimbabwe');
        });
    });
});
