import { expect, type Locator } from '@playwright/test';
import { type PreviewPageParams } from '../../types';
import { AbsPage, type IPageParams, type IScreenshotOptions } from '../shared/absPage';

const stylePath = 'framework/fixtures/previewPage/screenshot.css';

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

    async openInitialPage() {
        await super.openInitialPage();
        await this.page.addStyleTag({ path: stylePath });
    }

    async clientRedirect(params: PreviewPageParams) {
        await super._clientRedirect<PreviewPageParams>(params);
        await this.locators.regionContentNotBusy.waitFor();
    }

    async expectScreenshot(
        params: { screenshotName: string, isSlowTest?: boolean },
    ) {
        const screenshotOptions = await this.getScreenshotOptions(params.isSlowTest);
        await expect(this.page).toHaveScreenshot(params.screenshotName, screenshotOptions);
    }

    private async getScreenshotOptions(isSlowTest?: boolean): Promise<IScreenshotOptions> {
        return super._getScreenshotOptions({
            isSlowTest,
            locator: this.locators.regionScreenshotContent,
        });
    }
}
