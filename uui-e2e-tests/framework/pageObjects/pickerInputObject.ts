import { Locator, Page, expect } from '@playwright/test';

// see all key codes here: https://playwright.dev/docs/api/class-keyboard#keyboard-press
type TKeyboardKey = 'ArrowDown' | 'Backspace' | 'Enter' | 'Escape' | 'Shift' | 'Tab' | 'Shift+Tab' | 'Space';

export class PickerInputObject {
    public readonly locators: {
        input: Locator;
        dropdown: {
            root: Locator;
            option: (params: { focused?: boolean, checked?: boolean, text?: string, has?: string, ariaPosinset?: number }) => Locator;
            blocker: Locator;
            search: Locator;
            noRecords: Locator;
            showOnlySelectedSwitch: Locator;
            selectAll: Locator;
            clearAll: Locator;
            areaMultiSelectable: {
                root: Locator,
                allChecked: Locator,
                allUnchecked: Locator,
            }
        },
    };

    constructor(private page: Page) {
        const input = page.locator('.uui-input-box.uui-picker_toggler');
        const dropdown = page.locator('div[role="dialog"] .uui-dropdown-body');
        const areaMultiSelectable = dropdown.locator('div[aria-multiselectable="true"]');
        this.locators = {
            input,
            dropdown: {
                root: dropdown,
                search: dropdown.locator('input[type="search"]'),
                noRecords: dropdown.locator('.uui-flex-row .uui-text').getByText('No records found'),
                option: (params) => {
                    let sel = 'div[role="option"]';
                    if (params.focused) {
                        sel += '.uui-focus';
                    }
                    if (params.checked) {
                        sel += '[aria-checked="true"]';
                    }
                    if (typeof params.ariaPosinset === 'number') {
                        sel += `[aria-posinset="${params.ariaPosinset}"]`;
                    }
                    if (typeof params.has === 'string') {
                        sel += `:has(${params.has})`;
                    }
                    const loc = dropdown.locator(sel);
                    if (typeof params.text === 'string') {
                        return loc.getByText(params.text, { exact: true });
                    }
                    return loc;
                },
                blocker: dropdown.locator('.uui-blocker'),
                showOnlySelectedSwitch: dropdown.locator('label:has(input[role="switch"])').locator('input[role="switch"]'),
                selectAll: dropdown.locator('button').getByText('SELECT ALL'),
                clearAll: dropdown.locator('button').getByText('CLEAR ALL'),
                areaMultiSelectable: {
                    root: areaMultiSelectable,
                    allChecked: areaMultiSelectable.locator('input[type="checkbox"][aria-checked="true"]'),
                    allUnchecked: areaMultiSelectable.locator('input[type="checkbox"][aria-checked="false"]'),
                },
            },
        };
    }

    async focusInput() {
        await this.page.press('[aria-label="Doc Example Content"]', 'Tab');
        await this.page.press('[aria-label="Doc Example Content"]', 'Tab');
    }

    async focusShowOnlySelectedSwitch() {
        await this.locators.dropdown.showOnlySelectedSwitch.first().focus();
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

    async clickOption(text: string) {
        await this.locators.dropdown.option({ text }).click();
        await this.resetMousePos();
    }

    async waitDropdownLoaderAppearsAndDisappears() {
        await this.locators.dropdown.blocker.waitFor({ state: 'visible' });
        await this.locators.dropdown.blocker.waitFor({ state: 'hidden' });
    }

    async waitForSelectAllButton() {
        await this.locators.dropdown.selectAll.waitFor({ state: 'visible' });
    }

    async waitForAllOptionsUnchecked() {
        const all = await this.locators.dropdown.areaMultiSelectable.allChecked.all();
        await Promise.all(
            all.map((i) => i.waitFor({ state: 'hidden' })),
        );
    }

    async waitForAllOptionsChecked() {
        const all = await this.locators.dropdown.areaMultiSelectable.allUnchecked.all();
        await Promise.all(
            all.map((i) => i.waitFor({ state: 'hidden' })),
        );
    }

    async waitForNoRecordsFoundMsg() {
        await this.locators.dropdown.noRecords.waitFor({ state: 'visible' });
    }

    async waitDropdownDisappears() {
        await this.locators.dropdown.root.waitFor({ state: 'hidden' });
    }

    async keyboardPress(key: TKeyboardKey, times?: number, afterEach?: (index: number) => Promise<void>) {
        for (let i = 0; i < (times || 1); i++) {
            await this.page.keyboard.press(key, { delay: 50 });
            if (afterEach) {
                await afterEach(i);
            }
        }
    }

    async keyboardType(text: string) {
        await this.page.keyboard.type(text);
    }

    async expectOptionInViewport(text: string) {
        await expect(this.locators.dropdown.option({ text })).toBeInViewport({ ratio: 0.95 });
    }

    /**
     * @param pos - starts from 1
     */
    async expectOptionFocusedAndInViewportByPos(pos: number) {
        await expect(this.locators.dropdown.option({ ariaPosinset: pos, focused: true })).toBeInViewport({ ratio: 0.95 });
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
