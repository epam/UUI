import { Locator, Page, expect } from '@playwright/test';

// see all key codes here: https://playwright.dev/docs/api/class-keyboard#keyboard-press
type TKeyboardKey = 'ArrowDown' | 'Backspace' | 'Enter' | 'Escape' | 'Shift' | 'Tab' | 'Shift+Tab';

export class PickerInputObject {
    private readonly locators: {
        input: Locator;
        dropdown: {
            root: Locator;
            option: (params: { focused?: boolean, checked?: boolean, text?: string, has?: string }) => Locator;
            blocker: Locator;
            search: Locator;
            noRecords: Locator;
        }
    };

    constructor(private page: Page) {
        const input = page.locator('.uui-input-box.uui-picker_toggler');
        const dropdown = page.locator('div[role="dialog"] .uui-dropdown-body');
        this.locators = {
            input,
            dropdown: {
                root: dropdown,
                search: dropdown.locator('input[type="search"]'),
                noRecords: dropdown.locator('.uui-flex-row > div > .uui-text').getByText('No records found'),
                option: (params) => {
                    let sel = 'div[role="option"]';
                    if (params.focused) {
                        sel += '.uui-focus';
                    }
                    if (params.checked) {
                        sel += '[aria-checked="true"]';
                    }
                    if (typeof params.has === 'string') {
                        sel += `:has(${params.has})`;
                    }
                    const loc = dropdown.locator(sel);
                    if (typeof params.text === 'string') {
                        return loc.getByText(params.text);
                    }
                    return loc;
                },
                blocker: dropdown.locator('.uui-blocker'),
            },
        };
    }

    async focusInput() {
        await this.locators.input.first().focus();
    }

    async focusDropdownSearchInput() {
        await this.locators.dropdown.search.first().focus();
    }

    /**
     * Reset mouse pos to avoid unintentional hover effects
     */
    async resetMousePos() {
        await this.page.mouse.move(0, 0);
    }

    async clickDropdown() {
        await this.locators.input.first().click();
        await this.resetMousePos();
    }

    async clickOption(text: string) {
        await this.locators.dropdown.option({ text }).click();
        await this.resetMousePos();
    }

    async waitDropdownLoaderAppearsAndDisappears() {
        await this.locators.dropdown.blocker.waitFor({ state: 'visible' });
        await this.locators.dropdown.blocker.waitFor({ state: 'hidden' });
    }

    async waitForNoRecordsFoundMsg() {
        await this.locators.dropdown.noRecords.waitFor({ state: 'visible' });
    }

    async waitDropdownDisappears() {
        await this.locators.dropdown.root.waitFor({ state: 'hidden' });
    }

    async keyboardPress(key: TKeyboardKey, times: number = 1) {
        for (let i = 0; i < times; i++) {
            await this.page.keyboard.press(key);
            await this.page.waitForTimeout(100);
        }
    }

    async keyboardType(text: string) {
        await this.page.keyboard.type(text);
    }

    async expectOptionInViewport(text: string) {
        await expect(this.locators.dropdown.option({ text })).toBeInViewport({ ratio: 0.95 });
    }

    async waitDropdownOptionChecked(text: string) {
        await this.locators.dropdown.option({ text, focused: true, checked: true }).waitFor({ state: 'visible' });
    }

    async waitDropdownOptionUnchecked(text: string) {
        await this.locators.dropdown.option({ text, focused: true, checked: false }).waitFor({ state: 'attached' });
    }

    async waitDropdownOptionCheckedMixed(text: string) {
        await this.locators.dropdown.option({ text, has: 'input[type="checkbox"][aria-checked="mixed"]' }).waitFor({ state: 'attached' });
    }
}
