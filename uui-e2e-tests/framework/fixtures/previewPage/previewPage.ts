import { expect, type Locator } from '@playwright/test';
import { type PreviewPageParams } from '../../types';
import { AbsPage, type IPageParams } from '../shared/absPage';

export class PreviewPage extends AbsPage {
    private readonly locators: {
        readonly regionContentNotBusy: Locator;
        readonly regionScreenshotContent: Locator;
    };

    constructor(params: IPageParams) {
        super(params);
        const regionContentNotBusy = this.page.locator('[aria-label="Preview Content"][aria-busy="false"]');
        const regionScreenshotContent = regionContentNotBusy.locator('> div');
        this.locators = {
            regionContentNotBusy,
            regionScreenshotContent,
        };
    }

    async clientRedirect(params: PreviewPageParams) {
        await super._clientRedirect<PreviewPageParams>(params);
        await this.locators.regionContentNotBusy.waitFor();
    }

    async expectScreenshot(
        params: { screenshotName: string, isSlowTest?: boolean },
    ) {
        const screenshotOptions = await super._getScreenshotOptions({
            isSlowTest: params.isSlowTest,
            locator: this.locators.regionScreenshotContent,
        });
        await expect(this.page).toHaveScreenshot(params.screenshotName, screenshotOptions);
    }
}
