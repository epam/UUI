import { Locator, Page } from '@playwright/test';

export class MainMenuObject {
    public readonly locators: {
        container: Locator;
        logo: Locator;
        serverBadge: Locator;
        serverBadgeLabel: Locator;
        burger: Locator;
        moreButton: Locator;
        menuItem: (text: string) => Locator;
        dropdown: Locator;
    };

    constructor(public page: Page) {
        this.locators = {
            container: page.locator('.uui-mainmenu-container'),
            logo: page.locator('img[alt="Main Menu Logo"]'),
            serverBadge: page.locator('.uui-mainmenu-server-badge'),
            serverBadgeLabel: page.locator('.uui-mainmenu-server-badge-label'),
            burger: page.locator('.uui-burger button'),
            moreButton: page.locator('button').getByText('More'),
            menuItem: (text: string) => page.locator('.uui-mainmenu-container [role="menuitem"], .uui-mainmenu-container button, .uui-mainmenu-container a').getByText(text, { exact: true }),
            dropdown: page.locator('div[role="dialog"] .uui-main_menu-dropdown'),
        };
    }

    async clickLogo() {
        await this.locators.logo.click();
    }

    async getLogoSrc() {
        return await this.locators.logo.getAttribute('src');
    }

    async getServerBadgeText() {
        return await this.locators.serverBadgeLabel.textContent();
    }

    async getServerBadgeColor() {
        return await this.locators.serverBadgeLabel.evaluate((el) => getComputedStyle(el).backgroundColor);
    }

    async clickBurger() {
        await this.locators.burger.first().click();
    }

    async isBurgerVisible() {
        return await this.locators.burger.first().isVisible();
    }

    async clickMoreButton() {
        await this.locators.moreButton.first().click();
    }

    async isMoreButtonVisible() {
        return await this.locators.moreButton.first().isVisible();
    }

    async clickMenuItem(text: string) {
        await this.locators.menuItem(text).click();
    }

    async isMenuItemVisible(text: string) {
        return await this.locators.menuItem(text).isVisible();
    }

    async isDropdownVisible() {
        return await this.locators.dropdown.isVisible();
    }

    async getRawProp(attr: string) {
        return await this.locators.container.getAttribute(attr);
    }
}
