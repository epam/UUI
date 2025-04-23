import { expect } from '@playwright/test';
import { test } from '../../../framework/fixtures/integrationTestPage/fixture';
import { DropdownObject } from '../../../framework/pageObjects/dropdownObject';
import { setupDocExampleTest } from '../testUtils';

enum testPageUrl {
    'Dropdown / Scrolling behavior' = '/preview?theme=loveship&isSkin=true&componentId=dropdown&previewId=json%3A%7B"id"%3A""%2C"context"%3A"Default"%2C"matrix"%3A%7B%7D%7D',
    'Dropdown / Boundary mode' = '/preview?theme=loveship&isSkin=true&componentId=dropdown&previewId=json%3A%7B%22id%22%3A%22%22%2C%22context%22%3A%22Default%22%2C%22matrix%22%3A%7B%22openOnHover%22%3A%7B%22examples%22%3A%5B%22true%22%5D%7D%2C%22closeOnMouseLeave%22%3A%7B%22examples%22%3A%5B%22boundary%22%5D%7D%7D%7D'
}

test('Dropdown / Boundary mode', async ({ pageWrapper }, testInfo) => {
    const { pageObject } = await setupDocExampleTest({
        testInfo,
        pageWrapper,
        PageObjectConstructor: DropdownObject,
        testUrl: testPageUrl['Dropdown / Boundary mode'],
    });

    await pageObject.waitForContentLoad();

    await test.step('Body appears when the target element is hovered over', async () => {
        await pageObject.hoverTarget();
        await pageObject.waitDropdownBodyVisible();
    });

    await test.step('Body closure with delay when mouse in boundary area', async () => {
        await pageObject.mouseMoveFromLocatorToBottom({ locator: pageObject.locators.dropdown.body, directionY: 10 });
        await pageObject.page.waitForTimeout(1000);
        expect(await pageObject.locators.dropdown.body.isVisible()).toBe(true);
        await pageObject.page.waitForTimeout(1000);
        expect(await pageObject.locators.dropdown.body.isVisible()).toBe(false);
    });

    await test.step('Body closes immediately when mouse is out of boundary area', async () => {
        await pageObject.hoverTarget();
        await pageObject.waitDropdownBodyVisible();
        await pageObject.mouseMoveFromLocatorToBottom({ locator: pageObject.locators.dropdown.body, directionY: 40 });
        expect(await pageObject.locators.dropdown.body.isVisible()).toBe(false);
    });
});

test('Dropdown / Scrolling behavior', async ({ pageWrapper }, testInfo) => {
    const { pageObject } = await setupDocExampleTest({
        testInfo,
        pageWrapper,
        PageObjectConstructor: DropdownObject,
        testUrl: testPageUrl['Dropdown / Scrolling behavior'],
    });

    await pageObject.waitForContentLoad();

    await test.step('Body changes position when the target element is scrolled', async () => {
        await pageObject.addScrollToContentWrapper();
        await pageObject.clickTarget();
        await pageObject.waitDropdownBodyVisible();
        await expect(pageObject.locators.dropdown.body).toHaveAttribute('data-placement', 'top-start');
        await pageObject.mouseWheel(250);
        expect(await pageObject.locators.dropdown.body.isVisible()).toBe(true);
        await expect(pageObject.locators.dropdown.body).toHaveAttribute('data-placement', 'bottom-start');
    });

    await test.step('Body disappears when the target element is scrolled out of the viewport', async () => {
        expect(await pageObject.locators.dropdown.body.isVisible()).toBe(true);
        await pageObject.mouseWheel(800);
        await pageObject.waitDropdownBodyHidden();
        await pageObject.removeStylesFromContentWrapper();
    });
});
