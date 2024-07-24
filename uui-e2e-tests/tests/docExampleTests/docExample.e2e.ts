import { test } from '../../framework/fixtures/docExamplePage/fixture';
import { PickerInputObject } from '../../framework/pageObjects/pickerInputObject';
import { expect } from '@playwright/test';

test('PickerInput-ValueSelectWithKeyboard', async ({ docExamplePage }, testInfo) => {
    await docExamplePage.editDocExample({ examplePath: 'pickerInput/LazyTreeInput' });
    const { page } = docExamplePage;
    const root = page.locator('css=.uui-input-box');
    const pio = new PickerInputObject(page, root);
    await pio.openDropdown();
    await page.waitForTimeout(150);
    await expect(page).toHaveScreenshot(`${testInfo.title}.png`);
});
