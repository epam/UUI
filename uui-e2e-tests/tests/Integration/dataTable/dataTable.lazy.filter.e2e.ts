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
            await expectScreenshot(1, 'job-title-filters-filled');

            await pageObject.closeFilterModal();

            await pageObject.expectRowNameInViewport('Aaron Vogt');

            await expectScreenshot(1, 'job-title-filters-applied');
        });

        await test.step('Filter by Job Title [exclude]', async () => {
            await pageObject.openFilterModal('Title');
            await pageObject.expectMultiPickerFilterModalToBeOpened();
            await pageObject.applyIsNotFilter();
            await expectScreenshot(1, 'job-title-filters-exclude-filled');

            await pageObject.closeFilterModal();

            await pageObject.expectRowNameInViewport('Aaron Benoît');

            await expectScreenshot(2, 'job-title-filters-exclude-applied');
        });

        await test.step('Filter by Job Title using search', async () => {
            await pageObject.openFilterModal('Title');
            await pageObject.expectMultiPickerFilterModalToBeOpened();

            await pageObject.searchInFilterModal('Production Technician - WC30');
            await pageObject.checkFilterOptionsInMultiPickerFilterModal(['Production Technician - WC30']);
            await expectScreenshot(1, 'job-title-filters-search-in-filter-filled');

            await pageObject.closeFilterModal();

            await pageObject.expectRowNameInViewport('Aaron Bravo');
            await expectScreenshot(3, 'job-title-filters-search-in-filter-applied');
        });

        await test.step('Filter by Salary', async () => {
            await pageObject.openFilterModal('Salary');
            await expectScreenshot(4, 'numberic-range-picker-filter-modal-opened');

            await pageObject.clickOnGteInFilterModal();
            await pageObject.fillNumericFilterInput('1500');
            await pageObject.closeFilterModal();

            await pageObject.expectRowNameInViewport('Anthony Gautier');
            await expectScreenshot(5, 'salary-filter-applied');
        });
    });
});
