import { test } from '../../../framework/fixtures/docExamplePage/fixture';
import { PickerInputObject } from '../../../framework/pageObjects/pickerInputObject';
import { DocExamplePath, setupDocExampleTest } from '../testUtils';

const OPTION_TEXT = {
    FRANCE_EUROPE: 'FranceEurope',
    FRANCE_GARGES: 'Garges-lès-GonesseEurope / France',
};

test(DocExamplePath['pickerInput/LazyTreeInput'], async ({ pageWrapper }, testInfo) => {
    const { pageObject, expectScreenshot } = await setupDocExampleTest({
        testInfo,
        pageWrapper,
        PageObjectConstructor: PickerInputObject,
        examplePath: DocExamplePath['pickerInput/LazyTreeInput'],
    });
    // 1
    await pageObject.focusInput();
    await expectScreenshot('step1-focus-input');
    // 2
    await pageObject.keyboardPress('Enter');
    await pageObject.waitDropdownLoaderAppearsAndDisappears();
    await expectScreenshot('step2-focus-search');
    // 3
    await pageObject.keyboardType('franc');
    await pageObject.waitDropdownLoaderAppearsAndDisappears();
    await expectScreenshot('step3-search-results');
    // 4
    await pageObject.keyboardPress('ArrowDown', 8);
    await pageObject.expectOptionInViewport(OPTION_TEXT.FRANCE_EUROPE);
    await expectScreenshot('step4-option-france-focused');
    // 5
    await pageObject.keyboardPress('Enter');
    await pageObject.waitDropdownOptionChecked(OPTION_TEXT.FRANCE_EUROPE);
    await expectScreenshot('step5-option-france-checked');
    // 6
    await pageObject.keyboardPress('Backspace', 5);
    await pageObject.waitDropdownOptionCheckedMixed('Europe');
    await expectScreenshot('step6-option-europe-checked-mixed');
    // 7
    await pageObject.keyboardPress('Escape');
    await pageObject.waitDropdownDisappears();
    await expectScreenshot('step7-france-selected');
    // 8
    await pageObject.keyboardPress('Shift+Tab');
    await pageObject.waitDropdownDisappears();
    await expectScreenshot('step8-focus-outside');
    // 9
    await pageObject.keyboardPress('Tab');
    await pageObject.waitDropdownDisappears();
    await expectScreenshot('step9-focus-input');
    // 10
    await pageObject.keyboardPress('Enter');
    await pageObject.waitDropdownLoaderAppearsAndDisappears();
    await expectScreenshot('step10-focus-search');
    // 11
    await pageObject.keyboardType('arg');
    await pageObject.waitDropdownLoaderAppearsAndDisappears();
    await expectScreenshot('step11-search-results');
    // 12
    await pageObject.keyboardPress('ArrowDown', 21);
    await pageObject.expectOptionInViewport(OPTION_TEXT.FRANCE_GARGES);
    await expectScreenshot('step12-option-garges-focused');
    // 13
    await pageObject.clickOption(OPTION_TEXT.FRANCE_GARGES);
    await pageObject.waitDropdownOptionUnchecked(OPTION_TEXT.FRANCE_GARGES);
    await expectScreenshot('step13-option-garges-unchecked');
    // 14
    await pageObject.focusDropdownSearchInput();
    await pageObject.keyboardPress('Backspace', 3);
    await pageObject.waitDropdownOptionCheckedMixed('Europe');
    await expectScreenshot('step14-option-europe-checked-mixed');
    // 15
    await pageObject.keyboardType('qwe');
    await pageObject.waitForNoRecordsFoundMsg();
    await expectScreenshot('step15-search-results');
    // 16
    await pageObject.keyboardPress('Tab');
    await expectScreenshot('step16-focus-only-selected-radio');
});
