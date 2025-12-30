import { Locator, Page, expect } from '@playwright/test';

export abstract class DataTableObject {
    public readonly locators: {
        pageContent: Locator;
        table: Locator;
    };

    protected abstract getDefaultFirstRowText(): string;
    public static testUrl: string;

    constructor(public page: Page) {
        this.locators = {
            pageContent: page.locator('[aria-label="Page Content"]'),
            table: page.locator('div[role="table"]'),
        };
    }

    async expectRowNameInViewport(text: string, first: boolean = true) {
        const dataRow = first ? this.getTableRows().first() : this.getTableRows();
        const nameCell = dataRow.filter({ has: this.page.getByRole('cell', { name: text }) });

        await expect(nameCell).toContainText(text, { useInnerText: true });
    }

    async focusFirstElement() {
        await this.waitForTableRendered();
        await this.pressTab(2);
    }

    async scrollScreen(screens: number = 1) {
        for (let i = 0; i <= screens - 1; i++) {
            await this.locators.table.evaluate((e) => e.scrollBy(0, 1000));
        }
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
        return this.page.getByRole('dialog').locator('[aria-modal="true"]').first();
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

    getColumnTooltip(title: string) {
        return this.page.getByRole('dialog').filter({ hasText: title });
    }

    async openFilterModal(column: string) {
        await this.clickOnColumnHeader(column);

        const filterModal = this.getFilterModal();
        await expect(filterModal).toBeInViewport();
    }

    async clickOnColumnHeader(column: string) {
        const columnHeaderCell = this.getColumnHeaderCell(column);
        await expect(columnHeaderCell).toBeInViewport();
        const title = columnHeaderCell.getByText(column);
        await title.hover();

        const tooltip = this.getColumnTooltip(column);
        await expect(tooltip).toBeInViewport();

        await columnHeaderCell.click();
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

            await optionLocator.click();

            await expect(optionLocator).toHaveAttribute('aria-checked', 'true');
        }
    }

    async applyDescSortingInFilterModal() {
        const filterModal = this.getFilterModal();

        const descButton = filterModal
            .getByRole('menuitem', { name: 'Sort Descending' });

        await expect(descButton).toBeVisible();

        await descButton.click();
    }

    getColumnsConfigModal() {
        return this.page.getByRole('dialog').filter({ hasText: 'Configure columns' });
    }

    async openColumnsConfigModal() {
        const table = this.locators.table;
        const columnsConfigButton = table.getByLabel('Configure columns');
        await expect(columnsConfigButton).toBeVisible();

        await columnsConfigButton.click();

        const columnsConfigModal = this.getColumnsConfigModal();
        await expect(columnsConfigModal).toBeVisible();
    }

    async hideColumn(column: string) {
        const columnsConfigModal = this.getColumnsConfigModal();

        const columnOption = columnsConfigModal.locator('label').filter({ hasText: column });
        await expect(columnOption).toBeVisible();

        await columnOption.click();
    }

    async expectOptionInMultiPickerFilterModal(option: string) {
        const locator = this.getFilterModalMultiPickerOptionsLocator();
        const optionLocator = locator.filter({ hasText: option });
        await expect(optionLocator).toBeVisible();
    }

    async fillWithKeyboard(search: string) {
        await this.locators.pageContent.pressSequentially(search);
    }

    async searchInFilterModal(search: string) {
        await this.expectMultiPickerFilterModalToBeOpened();
        const filterModal = this.getFilterModal();
        const searchInput = filterModal.getByPlaceholder('search');

        await expect(searchInput).toBeVisible();

        await searchInput.fill(search);
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

    async moveFocusBackward(count: number = 1) {
        await this.pressShiftTab(count);
    }

    async pressEnter() {
        await this.locators.pageContent.press('Enter');
    }

    async pressArrowDown() {
        await this.locators.pageContent.press('ArrowDown');
    }

    async pressEsc() {
        await this.locators.pageContent.press('Escape');
    }

    async waitFocusedCheckboxIsChecked() {
        const focusedLocator = this.page.locator(':focus');
        await expect(focusedLocator).toHaveAttribute('aria-checked', 'true');
    }

    async waitFocusedCheckboxIsNotChecked() {
        const focusedLocator = this.page.locator(':focus');
        await expect(focusedLocator).toHaveAttribute('aria-checked', 'false');
    }

    async applyIsNotFilter() {
        await this.expectMultiPickerFilterModalToBeOpened();
        const filterModal = this.getFilterModal();
        const isNotButton = filterModal.getByRole('tablist').getByRole('tab', { name: 'is not' });

        await isNotButton.click();
    }

    async clickOnGteInFilterModal() {
        const filterModal = this.getFilterModal();
        const gteButton = filterModal.getByRole('tablist').getByRole('tab', { name: '≥' });
        await expect(gteButton).toBeInViewport();

        await gteButton.click();
    }

    async unfold(rowName: string) {
        const row = this.getTableRows().filter({ hasText: rowName });
        const unfoldArrow = row.getByLabel('Unfold', { exact: true });

        await expect(unfoldArrow).toBeVisible();

        await unfoldArrow.click();
        const foldArrow = row.getByLabel('Fold', { exact: true });
        await expect(foldArrow).toBeVisible();
    }

    async clickOnCheckbox(rowName: string) {
        const checkbox = this.getRowCheckbox(rowName);

        await checkbox.click();
    }

    async waitForCheckboxToBeChecked(rowName: string) {
        const checkbox = this.getRowCheckbox(rowName).getByRole('checkbox');

        await expect(checkbox).toHaveAttribute('aria-checked', 'true');
    }

    async waitForSelectAllCheckboxToBeMixed() {
        const selectAllCheckbox = this.getSelectAllCheckbox().getByRole('checkbox');

        await expect(selectAllCheckbox).toHaveAttribute('aria-checked', 'mixed');
    }

    async waitForSelectAllCheckboxToBeChecked() {
        const selectAllCheckbox = this.getSelectAllCheckbox().getByRole('checkbox');

        await expect(selectAllCheckbox).toHaveAttribute('aria-checked', 'true');
    }

    async waitForSelectAllCheckboxToBeUnchecked() {
        const selectAllCheckbox = this.getSelectAllCheckbox().getByRole('checkbox');

        await expect(selectAllCheckbox).toHaveAttribute('aria-checked', 'false');
    }

    async waitForCheckboxToBeDisabled(rowName: string) {
        const checkbox = this.getRowCheckbox(rowName).getByRole('checkbox');

        await expect(checkbox).toHaveAttribute('aria-disabled', 'true');
    }

    async waitForCheckboxToBeUnchecked(rowName: string) {
        const checkbox = this.getRowCheckbox(rowName).getByRole('checkbox');

        await expect(checkbox).toHaveAttribute('aria-checked', 'false');
    }

    async waitForCheckboxToBeMixed(rowName: string) {
        const checkbox = this.getRowCheckbox(rowName).getByRole('checkbox');

        await expect(checkbox).toHaveAttribute('aria-checked', 'mixed');
    }

    getRowCheckbox(rowName: string) {
        const row = this.getTableRows().filter({ hasText: new RegExp(`^${rowName}`, 'gi') });
        return row.getByLabel('Select', { exact: true });
    }

    async fillNumericFilterInput(input: string) {
        const filterModal = this.getFilterModal();
        const numericInput = filterModal.getByPlaceholder('Enter a number');
        await expect(numericInput).toBeInViewport();

        await numericInput.fill(input);
    }

    async waitForTableRendered() {
        const firstDataRow = this.locators.table.locator('[role="row"]:not(.uui-table-header-row)').first();
        const firstCell = firstDataRow.locator('[role="cell"]').first();

        await expect(this.locators.table).toBeVisible();
        await expect(firstDataRow).toBeVisible();
        await expect(firstCell).toContainText(this.getDefaultFirstRowText(), { useInnerText: true });
    }

    private async pressTab(times: number) {
        for (let i = 0; i < times; i++) {
            await this.locators.pageContent.press('Tab');
        }
    }

    private async pressShiftTab(times: number) {
        for (let i = 0; i < times; i++) {
            await this.locators.pageContent.press('Shift+Tab');
        }
    }
}
