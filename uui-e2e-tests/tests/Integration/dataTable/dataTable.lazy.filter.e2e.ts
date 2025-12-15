import { DataTableObject } from '../../../framework/pageObjects';
import { test } from '../../../framework/fixtures';
import { setupDocExampleTest } from '../testUtils';

test.describe('DataTable Lazy: Filters', () => {
    test('Apply multiPicker filters', async ({ pageWrapper }, testInfo) => {
        const { pageObject, expectScreenshot } = await setupDocExampleTest({
            testInfo,
            pageWrapper,
            PageObjectConstructor: DataTableObject,
            testUrl: '/docExample?theme=loveship&examplePath=tables%2FColumnFiltersTable',
        });

        await pageObject.waitForTableRendered();
        await test.step('Filter by Job Title', async () => {
            await pageObject.openFilterModal('Title');

            await pageObject.expectMultiPickerFilterModalToBeOpened();
            await pageObject.checkFilterOptionsInMultiPickerFilterModal(['Accountant', 'Accounts Manager']);
            await pageObject.closeFilterModal();

            await pageObject.expectRowNameInViewport('Aaron Vogt');

            await expectScreenshot(1, 'job-title-filters-applied');
        });

        // await test.step('Filter by Job Title [exclude]', async () => {
        //     await pageObject.clickSelectAllCheckbox();
        //     await pageObject.waitSelectAllCheckboxToBeNotChecked();
        //     await expectScreenshot(2, 'unselect-all-items');
        // });

        // await test.step('Filter by Job Title using search', async () => {
        //     await pageObject.clickSelectAllCheckbox();
        //     await pageObject.waitSelectAllCheckboxToBeNotChecked();
        //     await expectScreenshot(2, 'unselect-all-items');
        // });
    });
});
