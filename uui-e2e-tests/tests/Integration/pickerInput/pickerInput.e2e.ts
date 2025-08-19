import { test } from '../../../framework/fixtures/integrationTestPage/fixture';
import { PickerInputObject } from '../../../framework/pageObjects/pickerInputObject';
import { setupDocExampleTest } from '../testUtils';

const OPTION_TEXT = {
    FRANCE_EUROPE: 'FranceEurope',
    FRANCE_GARGES: 'Garges-lès-GonesseEurope / France',
};

test.only('pickerInput/LazyTreeInput', async ({ pageWrapper }, testInfo) => {
    const { pageObject, expectScreenshot } = await setupDocExampleTest({
        testInfo,
        pageWrapper,
        PageObjectConstructor: PickerInputObject,
        testUrl: '/docExample?theme=loveship&examplePath=pickerInput%2FLazyTreeInput',
    });
    await test.step('Put focus on the picker input field', async () => {
        await pageObject.focusInput();
        await expectScreenshot(1, 'focus-input');
    });
    await test.step('Press "Enter" key 1 time', async () => {
        await pageObject.keyboardPress('Enter');
        await pageObject.waitDropdownLoaderAppearsAndDisappears();
        await pageWrapper.page.waitForTimeout(50); // Fix for flaky test. Sometimes footer top shadow doesn't disappear
        await expectScreenshot(2, 'focus-search');
    });
    await test.step('Type "france" into the search field', async () => {
        await pageObject.keyboardType('france');
        await pageObject.waitDropdownLoaderAppearsAndDisappears();
        await expectScreenshot(3, 'search-results');
    });
    await test.step('Press "down arrow" 1 times', async () => {
        await pageObject.keyboardPress('ArrowDown', 1, async (index) => pageObject.expectOptionFocusedAndInViewportByPos(index + 2));
        await pageObject.expectOptionInViewport(OPTION_TEXT.FRANCE_EUROPE);
        await expectScreenshot(4, 'option-france-focused');
    });
    await test.step('Press "Enter" key 1 time', async () => {
        await pageObject.keyboardPress('Enter');
        await pageObject.waitDropdownOptionChecked(OPTION_TEXT.FRANCE_EUROPE);
        await expectScreenshot(5, 'option-france-checked');
    });
    await test.step('Press "Backspace" key 6 times', async () => {
        await pageObject.keyboardPress('Backspace', 6);
        await pageObject.waitDropdownOptionCheckedMixed('Europe');
        await expectScreenshot(6, 'option-europe-checked-mixed');
    });
    await test.step('Press "Esc" key 1 time', async () => {
        await pageObject.keyboardPress('Escape');
        await pageObject.waitDropdownDisappears();
        await expectScreenshot(7, 'france-selected');
    });
    await test.step('Focus outer element by pressing "Shift+Tab" key 1 time', async () => {
        await pageObject.keyboardPress('Shift+Tab');
        await expectScreenshot(8, 'focus-outside');
    });
    await test.step('Return focus back by pressing "Tab" key 1 time', async () => {
        await pageObject.keyboardPress('Tab');
        await expectScreenshot(9, 'focus-input');
    });
    await test.step('Press "Enter" key 1 time', async () => {
        await pageObject.keyboardPress('Enter');
        await pageObject.waitDropdownLoaderAppearsAndDisappears();
        await expectScreenshot(10, 'focus-search');
    });
    await test.step('Type "garg" into the search field', async () => {
        await pageObject.keyboardType('garg');
        await pageObject.waitDropdownLoaderAppearsAndDisappears();
        await expectScreenshot(11, 'search-results');
    });
    await test.step('Press "down arrow" 1 times', async () => {
        await pageObject.keyboardPress('ArrowDown', 1, async (index) => pageObject.expectOptionFocusedAndInViewportByPos(index + 2));
        await pageObject.expectOptionInViewport(OPTION_TEXT.FRANCE_GARGES);
        await expectScreenshot(12, 'option-garges-focused');
    });
    await test.step('Click on the "Garges-lès-Gonesse" option', async () => {
        await pageObject.clickOption(OPTION_TEXT.FRANCE_GARGES);
        await pageObject.waitDropdownOptionUnchecked(OPTION_TEXT.FRANCE_GARGES);
        await expectScreenshot(13, 'option-garges-unchecked');
    });
    await test.step('Press "Backspace" key 4 times', async () => {
        await pageObject.focusDropdownSearchInput();
        await pageObject.keyboardPress('Backspace', 4);
        await pageObject.waitDropdownOptionCheckedMixed('Europe');
        await expectScreenshot(14, 'option-europe-checked-mixed');
    });
    await test.step('Type "qwe" into the search field', async () => {
        await pageObject.keyboardType('qwe');
        await pageObject.waitForNoRecordsFoundMsg();
        await expectScreenshot(15, 'search-results');
    });
    await test.step('Erase "qwe" in the search field', async () => {
        await pageObject.keyboardPress('Backspace', 3);
        await pageObject.waitDropdownOptionCheckedMixed('Europe');
        await expectScreenshot(16, 'option-europe-checked-mixed');
    });
    await test.step('Focus "Show only selected" switch', async () => {
        await pageObject.focusShowOnlySelectedSwitch();
        await expectScreenshot(17, 'focus-only-selected-switch');
    });
    await test.step('Press "Space" key', async () => {
        await pageObject.keyboardPress('Space');
        await pageObject.waitForAllOptionsChecked();
        await expectScreenshot(18, 'only-selected-search-results');
    });
    await test.step('Press "Tab" key 1 time', async () => {
        await pageObject.keyboardPress('Tab');
        await expectScreenshot(19, 'focus-clear-all-button');
    });
    await test.step('Click on "CLEAR ALL" link button', async () => {
        await pageObject.keyboardPress('Enter');
        await pageObject.waitForSelectAllButton();
        await pageObject.waitForAllOptionsUnchecked();
        // hack - scrolling behavior is not consistent between test runs: "-scrolled-top" css class is not added sometimes
        await pageObject.keyboardPress('Escape');
        await pageObject.waitDropdownDisappears();
        await pageObject.keyboardPress('Enter');
        await pageObject.waitDropdownLoaderAppearsAndDisappears();
        // hack - end
        await expectScreenshot(20, 'cleared');
    });
    await test.step('Press "Esc" key 1 time', async () => {
        await pageObject.keyboardPress('Escape');
        await pageObject.waitDropdownDisappears();
        await expectScreenshot(21, 'focus-input');
    });
    await test.step('Focus outer element by pressing "Shift+Tab" key 1 time', async () => {
        await pageObject.keyboardPress('Shift+Tab');
        await expectScreenshot(22, 'focus-outside');
    });
});

test('pickerInput/LazyTreeInput/Mobile view', async ({ pageWrapper }, testInfo) => {
    const { pageObject, expectScreenshot } = await setupDocExampleTest({
        testInfo,
        pageWrapper,
        PageObjectConstructor: PickerInputObject,
        testUrl: '/docExample?theme=loveship&examplePath=pickerInput%2FLazyTreeInput',
    });

    await test.step('Put focus on the picker input field', async () => {
        await pageWrapper.page.setViewportSize({ width: 640, height: 900 });
        await pageObject.locators.input.click();
        await expectScreenshot(1, 'open-mobile-view');
    });
    await test.step('Type "france" into the search field', async () => {
        await pageObject.focusDropdownSearchInput();
        await pageObject.keyboardType('france');
        await pageObject.waitDropdownLoaderAppearsAndDisappears();
        await expectScreenshot(2, 'search-results');
    });

    await test.step('Click on the "France" option', async () => {
        await pageObject.clickOption(OPTION_TEXT.FRANCE_EUROPE);
        await pageObject.waitDropdownOptionChecked(OPTION_TEXT.FRANCE_EUROPE);
        await expectScreenshot(3, 'option-france-checked');
    });

    await test.step('Press "Backspace" key 6 times(Clear search)', async () => {
        await pageObject.focusDropdownSearchInput();
        await pageObject.keyboardPress('Backspace', 6);
        await pageObject.waitDropdownOptionCheckedMixed('Europe');
        await expectScreenshot(4, 'option-europe-checked-mixed');
    });

    await test.step('Press "Done" button', async () => {
        await pageObject.locators.dropdown.done.click();
        await pageObject.waitDropdownDisappears();
        await expectScreenshot(5, 'body-closed-after-done-click');
        pageWrapper.page.viewportSize();
    });
});
