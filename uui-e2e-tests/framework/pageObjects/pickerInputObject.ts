import { Locator, Page } from '@playwright/test';

export class PickerInputObject {
    constructor(private page: Page, private root: Locator) {
    }

    // getByPlaceholder('Please select locations').click();
    async openDropdown() {
        await this.root.first().click();
    }

    // E.g.: ['parent-1', 'parent-2', 'item-to-select']
    async selectItemFromTree(hierarchy: string[]) {
        for (let i = 0; i < hierarchy.length; i++) {
            const text = hierarchy[i];
            const isLast = i === hierarchy.length - 1;
            if (isLast) {
                await this.page.getByText(text).click();
            } else {
                await this.page.getByRole('cell', { name: text }).getByLabel('Unfold').click();
            }
        }
    }

    async arrowDownNTimesAndSelect(times: number = 1) {
        const elem = this.page.locator('*:focus');
        for (let i = 0; i < times + 1; i++) {
            await elem.press('ArrowDown');
            await this.page.waitForTimeout(50);
        }
        await elem.press('Enter');
        await this.page.waitForTimeout(50);
    }
}
