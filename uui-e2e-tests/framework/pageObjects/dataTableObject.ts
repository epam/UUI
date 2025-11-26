import { Locator, Page, expect } from '@playwright/test';

export class DataTableObject {
    public readonly locators: {
        table: Locator;
    };

    constructor(public page: Page) {
        this.locators = {
            table: page.locator('div[role="table"]'),
        };
    }

    async expectRowNameInViewport(text: string) {
        const firstDataRow = this.locators.table.locator('[role="row"]:not(.uui-table-header-row)').first();
        const nameCell = firstDataRow.locator('[role="cell"]').first();

        await expect(nameCell).toContainText(text, { useInnerText: true });
    }

    async focusFirstElement() {
        await this.page.press('body', 'Tab');
        await this.page.press('body', 'Tab');
    }

    async moveFocusForward(count: number = 1) {
        for (let i = 0; i < count; i++) {
            await this.page.press('body', 'Tab');
        }
    }

    async waitFocusedCheckboxIsChecked() {
        const focusedLocator = this.page.locator(':focus');
        await expect(focusedLocator).toHaveAttribute('aria-checked', 'true');
    }

    async waitFocusedCheckboxIsNotChecked() {
        const focusedLocator = this.page.locator(':focus');
        await expect(focusedLocator).toHaveAttribute('aria-checked', 'false');
    }
}
