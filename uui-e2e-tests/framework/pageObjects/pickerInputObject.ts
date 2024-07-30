import { Locator, Page, expect } from '@playwright/test';

export class PickerInputObject {
    private readonly locators: {
        input: Locator;
        dropdown: {
            root: Locator;
            option: (params: { focused?: boolean, checked?: boolean, text?: string, has?: string }) => Locator;
            blocker: Locator;
        }
    };

    constructor(private page: Page) {
        const input = page.locator('.uui-input-box.uui-picker_toggler');
        const dropdown = page.locator('div[role="dialog"] .uui-dropdown-body');
        this.locators = {
            input,
            dropdown: {
                root: dropdown,
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

    async openDropdown() {
        await this.locators.input.first().click();
    }

    async waitDropdownLoaderAppearsAndDisappears() {
        await expect(this.locators.dropdown.blocker).toBeVisible();
        await expect(this.locators.dropdown.blocker).toBeHidden();
    }

    async waitDropdownDisappears() {
        await expect(this.locators.dropdown.root).toBeHidden();
    }

    // see key codes here: https://playwright.dev/docs/api/class-keyboard#keyboard-press
    async keyboardPress(key: 'ArrowDown' | 'Backspace' | 'Enter' | 'Escape', times: number = 1) {
        for (let i = 0; i < times; i++) {
            await this.page.keyboard.press(key);
        }
    }

    async keyboardType(text: string) {
        await this.page.keyboard.type(text);
    }

    async waitDropdownOptionFocused(text: string) {
        await expect(this.locators.dropdown.option({ text })).toBeAttached();
    }

    async waitDropdownOptionChecked(text: string) {
        await expect(this.locators.dropdown.option({ text, focused: true, checked: true })).toBeAttached();
    }

    async waitDropdownOptionCheckedMixed(text: string) {
        await expect(
            this.locators.dropdown.option({ text, has: 'input[type="checkbox"][aria-checked="mixed"]' }),
        ).toBeAttached();
    }
}
