import { Locator, Page, expect } from '@playwright/test';

export class DataTableObject {
    public readonly locators: {
        pageContent: Locator;
        table: Locator;
    };

    constructor(public page: Page) {
        this.locators = {
            pageContent: page.locator('[aria-label="Page Content"]'),
            table: page.locator('div[role="table"]'),
        };
    }

    async expectRowNameInViewport(text: string) {
        const firstDataRow = this.getTableRows().first();
        const nameCell = this.getTableRowCell(firstDataRow).first();

        await expect(nameCell).toContainText(text, { useInnerText: true });
    }

    async focusFirstElement() {
        await this.waitForTableRendered();
        await this.pressTab(2);
    }

    getTableRows() {
        return this.locators.table.locator('[role="row"]:not(.uui-table-header-row)');
    }
    
    getTableRowCell(tableRow: Locator) {
        return tableRow.locator('[role="cell"]');
    }

    getSelectAllCheckbox() {
        const table = this.locators.table;
        return table.getByLabel('Select All');
    }

    getColumnHeaderCell(columnName: string) {
        const table = this.locators.table;
        return table.getByRole('columnheader', { name: columnName });
    }

    getFilterModal() {
        return this.page.getByRole('dialog');
    }

    getFilterModalMultiPickerList() {
        const filterModal = this.getFilterModal();
        
        return filterModal.locator('[aria-multiselectable="true"]');
    }

    getFilterModalMultiPickerOptionsLocator() {
        const list = this.getFilterModalMultiPickerList();
        return list.getByRole('option');
    }

    async closeFilterModal() {
        await this.locators.pageContent.click({ position: { x: 10, y: 5 } });
    }

    async clickSelectAllCheckbox() {
        const selectAllCheckbox = this.getSelectAllCheckbox();
        await expect(selectAllCheckbox).toBeInViewport();
        await selectAllCheckbox.click();
    }

    async openFilterModal(column: string) {
        const columnHeaderCell = this.getColumnHeaderCell(column);
        await expect(columnHeaderCell).toBeInViewport();

        await columnHeaderCell.click();

        const filterModal = this.getFilterModal();
        await expect(filterModal).toBeVisible();
    }

    async expectMultiPickerFilterModalToBeOpened() {
        const list = this.getFilterModalMultiPickerList();
        await expect(list).toBeVisible();
    }
    
    async checkFilterOptionsInMultiPickerFilterModal(options: string[]) {
        const locator = this.getFilterModalMultiPickerOptionsLocator();
        for (const option of options) {
            const optionLocator = locator.filter({ hasText: option });
            await expect(optionLocator).toBeVisible();
            
            optionLocator.click();
            
            await expect(optionLocator).toHaveAttribute('aria-checked', 'true');
        }
    }

    async waitSelectAllCheckboxToBeChecked() {
        const selectAllCheckbox = this.getSelectAllCheckbox().getByRole('checkbox');
        await expect(selectAllCheckbox).toHaveAttribute('aria-checked', 'true');
    }

    async waitSelectAllCheckboxToBeNotChecked() {
        const selectAllCheckbox = this.getSelectAllCheckbox().getByRole('checkbox');
        await expect(selectAllCheckbox).toHaveAttribute('aria-checked', 'false');
    }

    async moveFocusForward(count: number = 1) {
        await this.pressTab(count);
    }

    async waitFocusedCheckboxIsChecked() {
        const focusedLocator = this.page.locator(':focus');
        await expect(focusedLocator).toHaveAttribute('aria-checked', 'true');
    }

    async waitFocusedCheckboxIsNotChecked() {
        const focusedLocator = this.page.locator(':focus');
        await expect(focusedLocator).toHaveAttribute('aria-checked', 'false');
    }

    async waitForTableRendered() {
        const firstDataRow = this.locators.table.locator('[role="row"]:not(.uui-table-header-row)').first();
        const firstCell = firstDataRow.locator('[role="cell"]').first();

        await expect(this.locators.table).toBeVisible();
        await expect(firstDataRow).toBeVisible();
        await expect(firstCell).toContainText('Aaron Benoît', { useInnerText: true });
    }

    private async pressTab(times: number) {
        for (let i = 0; i < times; i++) {
            await this.locators.pageContent.press('Tab');
        }
    }
}
