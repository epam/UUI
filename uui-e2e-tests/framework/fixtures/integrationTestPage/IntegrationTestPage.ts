import { expect, type Locator } from '@playwright/test';
import { type IPageParams, AbsPage } from '../shared/absPage';
import { Link } from '@epam/uui-core';

export class IntegrationTestPage extends AbsPage {
    private readonly locators: {
        readonly regionContentNotBusy: Locator;
    };

    constructor(params: IPageParams) {
        super(params);
        this.locators = {
            regionContentNotBusy: this.page.locator('[aria-label="Page Content"][aria-busy="false"]'),
        };
    }

    async clientRedirectTo(link: Link) {
        await super._clientRedirect(link);
        await this.locators.regionContentNotBusy.waitFor();
    }

    async expectScreenshot(screenshotName: string) {
        const screenshotOptions = await super._getScreenshotOptions({ isSlowTest: true });
        await expect(this.page).toHaveScreenshot(screenshotName, screenshotOptions);
    }
}
