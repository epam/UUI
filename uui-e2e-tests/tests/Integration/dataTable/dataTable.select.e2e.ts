import { expect } from '@playwright/test';
import { test } from '../../../framework/fixtures';
import { setupDocExampleTest } from '../testUtils';
import { ColumnFiltersDataTableObject, LazyDataTableObject, LocationsDataTableObject } from '../../../framework/pageObjects';

test.describe('DataTable: Select', () => {
    test('Select All/Unselect All.', async ({ pageWrapper }, testInfo) => {
        const { pageObject, expectScreenshot } = await setupDocExampleTest({
            testInfo,
            pageWrapper,
            PageObjectConstructor: ColumnFiltersDataTableObject,
            testUrl: ColumnFiltersDataTableObject.testUrl,
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

    test('Select All/Unselect All. [Using keyboard]', async ({ pageWrapper }, testInfo) => {
        const { pageObject, expectScreenshot } = await setupDocExampleTest({
            testInfo,
            pageWrapper,
            PageObjectConstructor: ColumnFiltersDataTableObject,
            testUrl: ColumnFiltersDataTableObject.testUrl,
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

    test('Tree: Select All/Unselect All', async ({ pageWrapper }, testInfo) => {
        const { pageObject, expectScreenshot } = await setupDocExampleTest({
            testInfo,
            pageWrapper,
            PageObjectConstructor: LocationsDataTableObject,
            testUrl: LocationsDataTableObject.testUrl,
        });

        await pageObject.waitForTableRendered();
        await test.step('Select all items', async () => {
            await pageObject.clickSelectAllCheckbox();
            await pageObject.waitSelectAllCheckboxToBeChecked();
            await expectScreenshot(1, 'tree-select-all-items');
        });

        await test.step('Unfold first row', async () => {
            await pageObject.unfold('Africa');

            await expectScreenshot(1, 'tree-unfolded-select-all-items');
        });

        await test.step('Unselect all items', async () => {
            await pageObject.clickSelectAllCheckbox();
            await pageObject.waitSelectAllCheckboxToBeNotChecked();
            await expectScreenshot(2, 'tree-unselect-all-items');
        });
    });

    test('Tree: Select All/Unselect All. [Using keyboard]', async ({ pageWrapper }, testInfo) => {
        const { pageObject, expectScreenshot } = await setupDocExampleTest({
            testInfo,
            pageWrapper,
            PageObjectConstructor: LocationsDataTableObject,
            testUrl: LocationsDataTableObject.testUrl,
        });

        await pageObject.waitForTableRendered();
        await test.step('Put focus on selectAll checkbox', async () => {
            await pageObject.focusFirstElement();
            await expectScreenshot(1, 'tree-keyboard-first-element-focus');
        });

        await test.step('Select all items', async () => {
            await pageObject.page.keyboard.press('Space');
            await pageObject.waitFocusedCheckboxIsChecked();
            await expectScreenshot(2, 'tree-keyboard-select-all-items');
            await pageObject.moveFocusForward(7);
            await pageObject.page.keyboard.press('Space');

            const row = pageObject.getTableRows().nth(1);
            await expect(row).toContainText('Algeria');
        });

        await test.step('Unselect all items', async () => {
            await pageObject.moveFocusBackward(6);

            await pageObject.page.keyboard.press('Space');
            await pageObject.waitFocusedCheckboxIsNotChecked();
            await expectScreenshot(3, 'tree-keyboard-unselect-all-items');
        });
    });

    test('Tree: Cascade selection', async ({ pageWrapper }, testInfo) => {
        const { pageObject, expectScreenshot } = await setupDocExampleTest({
            testInfo,
            pageWrapper,
            PageObjectConstructor: LocationsDataTableObject,
            testUrl: LocationsDataTableObject.testUrl,
        });

        await pageObject.waitForTableRendered();
        await test.step('Select item', async () => {
            await pageObject.clickOnCheckbox('Africa');
            await pageObject.waitForCheckboxToBeChecked('Africa');

            await expectScreenshot(1, 'tree-check');
        });

        await test.step('Unfold first row', async () => {
            await pageObject.unfold('Africa');

            await expectScreenshot(2, 'tree-unfolded-africa');
        });

        await test.step('Unselect child row', async () => {
            await pageObject.clickOnCheckbox('Algeria');
            await pageObject.waitForCheckboxToBeUnchecked('Algeria');
            await pageObject.waitForCheckboxToBeMixed('Africa');
            await expectScreenshot(3, 'tree-africa-parially-checked');
        });
    });

    test('Selection with disabled rows', async ({ pageWrapper }, testInfo) => {
        const { pageObject, expectScreenshot } = await setupDocExampleTest({
            testInfo,
            pageWrapper,
            PageObjectConstructor: LazyDataTableObject,
            testUrl: LazyDataTableObject.testUrl,
        });

        await pageObject.waitForTableRendered();
        await test.step('Select first item', async () => {
            await pageObject.clickOnCheckbox('225284');
            await pageObject.waitForCheckboxToBeChecked('225284');

            await expectScreenshot(1, 'lazy-check-single-row');
        });

        await test.step('Try to select disabled item', async () => {
            await pageObject.waitForCheckboxToBeDisabled('2625070');

            await expectScreenshot(2, 'lazy-disabled-row-try-to-check');
        });
    });

    test('Selection with disabled rows [Using keyboard]', async ({ pageWrapper }, testInfo) => {
        const { pageObject, expectScreenshot } = await setupDocExampleTest({
            testInfo,
            pageWrapper,
            PageObjectConstructor: LazyDataTableObject,
            testUrl: LazyDataTableObject.testUrl,
        });

        await pageObject.waitForTableRendered();
        await test.step('Select first item', async () => {
            await pageObject.focusFirstElement();
            await pageObject.moveFocusForward(5);
            await pageObject.page.keyboard.press('Space');

            await pageObject.waitForCheckboxToBeChecked('225284');

            await expectScreenshot(1, 'keyboard-lazy-check-single-row');
        });

        await test.step('Move focus forward with keyboard to skip disabled checkbox', async () => {
            await pageObject.moveFocusForward();
            await pageObject.page.keyboard.press('Space');

            await pageObject.waitForCheckboxToBeChecked('2747351');

            await expectScreenshot(2, 'keyboard-skip-disabled-checkbox-with-focus');
        });
    });
});
