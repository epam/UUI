import { test } from '../../../framework/fixtures/docExamplePage/fixture';
import { PickerInputObject } from '../../../framework/pageObjects/pickerInputObject';
import { DocExamplePath, setupDocExampleTest } from '../testUtils';

test.skip(DocExamplePath['pickerInput/LazyTreeInput'], async ({ pageWrapper }, testInfo) => {
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
    await pageObject.waitDropdownOptionFocused('FranceEurope');
    await expectScreenshot('step4-option-france-focused');
    // 5
    await pageObject.keyboardPress('Enter');
    await pageObject.waitDropdownOptionChecked('FranceEurope');
    await expectScreenshot('step5-option-france-checked');
    // 6
    await pageObject.keyboardPress('Backspace', 5);
    await pageObject.waitDropdownOptionCheckedMixed('Europe');
    await expectScreenshot('step6-option-europe-checked-mixed');
    // 7
    await pageObject.keyboardPress('Escape');
    await pageObject.waitDropdownDisappears();
    await expectScreenshot('step7-france-selected');
});
