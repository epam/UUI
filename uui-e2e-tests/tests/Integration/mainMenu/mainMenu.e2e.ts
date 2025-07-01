import { expect } from '@playwright/test';
import { test } from '../../../framework/fixtures/integrationTestPage/fixture';
import { MainMenuObject } from '../../../framework/pageObjects/mainMenuObject';
import { setupDocExampleTest } from '../testUtils';

const testPageUrl = {
    responsive: '/docExample?theme=loveship&examplePath=mainMenu%2FResponsive',
    serverBadgePreview: '/preview?theme=loveship&isSkin=true&componentId=mainMenu&previewId=All+Variants',
};

test.only('mainMenu/Responsive scenario', async ({ pageWrapper }, testInfo) => {
    const { pageObject, expectScreenshot } = await setupDocExampleTest({
        testInfo,
        pageWrapper,
        PageObjectConstructor: MainMenuObject,
        testUrl: testPageUrl.responsive,
    });
    const mainMenu = pageObject as MainMenuObject;

    await test.step('Default: menu container is visible', async () => {
        await expect(mainMenu.locators.container).toBeVisible();
        await expectScreenshot(1, 'default');
    });

    await test.step('More: open More menu', async () => {
        expect(await mainMenu.isMoreButtonVisible()).toBe(true);
        await mainMenu.clickMoreButton();
        expect(await mainMenu.isDropdownVisible()).toBe(true);
        await expectScreenshot(2, 'more-open');
    });

    await test.step('Responsive: set small viewport and open burger menu', async () => {
        await pageWrapper.page.setViewportSize({ width: 500, height: 900 });
        await expectScreenshot(3, 'responsive-burger-visible');
        await mainMenu.clickBurger();
        expect(await mainMenu.isBurgerVisible()).toBe(true);
        await expectScreenshot(4, 'responsive-burger-open');
        pageWrapper.page.viewportSize();
    });
});

test('mainMenu/ServerBadge', async ({ pageWrapper }, testInfo) => {
    const { pageObject, expectScreenshot } = await setupDocExampleTest({
        testInfo,
        pageWrapper,
        PageObjectConstructor: MainMenuObject,
        testUrl: testPageUrl.serverBadgePreview,
    });
    await pageWrapper.page.setViewportSize({ width: 640, height: 120 });
    const mainMenu = pageObject as MainMenuObject;
    await expect(mainMenu.locators.serverBadgeLabel).toBeVisible();
    const badgeText = await mainMenu.getServerBadgeText();
    expect(badgeText && badgeText.length > 0).toBeTruthy();
    const color = await mainMenu.getServerBadgeColor();
    expect(color).toBeTruthy();
    await expectScreenshot(1, 'serverBadge-smoke');
    pageWrapper.page.viewportSize();
});
