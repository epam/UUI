import { test } from '../../../framework/fixtures/docExamplePage/fixture';
import { PickerInputObject } from '../../../framework/pageObjects/pickerInputObject';
import { type TestInfo } from '@playwright/test';
import { type DocExamplePage } from '../../../framework/fixtures/docExamplePage/docExamplePage';
import { DocExamplePath } from '../constants';

async function setupTest(
    params: { testInfo: TestInfo, examplePath: DocExamplePath, pageWrapper: DocExamplePage },
) {
    const { pageWrapper, testInfo, examplePath } = params;
    await pageWrapper.clientRedirect({ examplePath });
    const comp = new PickerInputObject(pageWrapper.page);
    const expectScreenshot = async (stepName: string) => {
        const screenshotName = `${testInfo.title}_${stepName}.png`;
        await pageWrapper.expectScreenshot(screenshotName);
    };
    return { comp, expectScreenshot };
}

test(DocExamplePath['pickerInput/LazyTreeInput'], async ({ pageWrapper }, testInfo) => {
    const { comp, expectScreenshot } = await setupTest({ testInfo, examplePath: DocExamplePath['pickerInput/LazyTreeInput'], pageWrapper });

    await comp.focusInput();
    await expectScreenshot('step1-focus-input');

    await comp.keyboardPress('Enter');
    await comp.waitDropdownLoaderAppearsAndDisappears();
    await expectScreenshot('step2-focus-search');

    await comp.keyboardType('franc');
    await comp.waitDropdownLoaderAppearsAndDisappears();
    await expectScreenshot('step3-search-results');

    await comp.keyboardPress('ArrowDown', 8);
    await comp.waitDropdownOptionFocused('FranceEurope');
    await expectScreenshot('step4-option-france-focused');

    await comp.keyboardPress('Enter');
    await comp.waitDropdownOptionChecked('FranceEurope');
    await expectScreenshot('step5-option-france-checked');

    await comp.keyboardPress('Backspace', 5);
    await comp.waitDropdownOptionCheckedMixed('Europe');
    await expectScreenshot('step6-option-europe-checked-mixed');

    await comp.keyboardPress('Escape');
    await comp.waitDropdownDisappears();
    await expectScreenshot('step7-france-selected');
});
