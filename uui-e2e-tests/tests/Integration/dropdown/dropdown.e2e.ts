import { expect } from '@playwright/test';
import { test } from '../../../framework/fixtures/docExamplePage/fixture';
import { DropdownObject } from '../../../framework/pageObjects/dropdownObject';
import { DocExamplePath, setupDocExampleTest } from '../testUtils';

test('Dropdown / Boundary mode', async ({ pageWrapper }, testInfo) => {
    const { pageObject, expectScreenshot } = await setupDocExampleTest({
        testInfo,
        pageWrapper,
        PageObjectConstructor: DropdownObject,
        testUrl: DocExamplePath['Dropdown / Boundary mode'],
    });

    await pageObject.waitForContentLoad();

    await test.step('Body appears when the target element is hovered over', async () => {
        await pageObject.hoverTarget();
        await pageObject.waitDropdownBodyVisible();
        await pageObject.page.waitForTimeout(100); // wait for API call
        await expectScreenshot(1, 'body-opened');
    });

    await test.step('Body closure with delay when mouse in boundary area', async () => {
        await pageObject.mouseMoveFromLocatorToBottom({ locator: pageObject.locators.dropdown.body, directionY: 10 });
        await pageObject.page.waitForTimeout(1000);
        expect(await pageObject.locators.dropdown.body.isVisible()).toBe(true);
        await pageObject.page.waitForTimeout(1000);
        expect(await pageObject.locators.dropdown.body.isVisible()).toBe(false);
        await expectScreenshot(2, 'body-closed');
    });

    await test.step('Body closes immediately when mouse is out of boundary area', async () => {
        await pageObject.hoverTarget();
        await pageObject.waitDropdownBodyVisible();
        await pageObject.mouseMoveFromLocatorToBottom({ locator: pageObject.locators.dropdown.body, directionY: 40 });
        expect(await pageObject.locators.dropdown.body.isVisible()).toBe(false);
        await expectScreenshot(3, 'body-closed');
    });
});

test('Dropdown / Scrolling behavior', async ({ pageWrapper }, testInfo) => {
    const { pageObject, expectScreenshot } = await setupDocExampleTest({
        testInfo,
        pageWrapper,
        PageObjectConstructor: DropdownObject,
        testUrl: DocExamplePath['Dropdown / Scrolling behavior'],
    });

    await pageObject.waitForContentLoad();

    await test.step('Body changes position when the target element is scrolled', async () => {
        await pageObject.addScrollToContentWrapper();
        await pageObject.clickTarget();
        await pageObject.waitDropdownBodyVisible();
        await expect(pageObject.locators.dropdown.body).toHaveAttribute('data-placement', 'top-start');
        await pageObject.mouseWheel(250);
        await expect(pageObject.locators.dropdown.body).toHaveAttribute('data-placement', 'bottom-start');
        await expectScreenshot(1, 'body-position-top');
    });

    await test.step('Body disappears when the target element is scrolled out of the viewport', async () => {
        await pageObject.mouseWheel(800);
        await pageObject.waitDropdownBodyHidden();
        await expectScreenshot(2, 'body-closed');
        await pageObject.removeStylesFromContentWrapper();
    });
});
