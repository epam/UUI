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
        const firstDataRow = this.locators.table.locator('[role="row"]:not(.uui-table-header-row)').first();
        const nameCell = firstDataRow.locator('[role="cell"]').first();

        await expect(nameCell).toContainText(text, { useInnerText: true });
    }

    async focusFirstElement() {
        await this.waitForTableRendered();
        await this.pressTab(2);
    }

    getSelectAllCheckbox() {
        const table = this.locators.table;
        return table.getByLabel('Select All');
    }

    async clickSelectAllCheckbox() {
        const selectAllCheckbox = this.getSelectAllCheckbox();
        await expect(selectAllCheckbox).toBeInViewport();
        await selectAllCheckbox.click();
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
