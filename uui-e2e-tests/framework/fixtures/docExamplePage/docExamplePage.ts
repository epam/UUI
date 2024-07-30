import { expect, type Locator } from '@playwright/test';
import { type DocExamplePageParams, TTheme } from '../../types';
import { type IPageParams, AbsPage, type IScreenshotOptions } from '../shared/absPage';

export class DocExamplePage extends AbsPage {
    private readonly locators: {
        readonly regionContentNotBusy: Locator;
    };

    constructor(params: IPageParams) {
        super(params);
        this.locators = {
            regionContentNotBusy: this.page.locator('[aria-label="Doc Example Content"][aria-busy="false"]'),
        };
    }

    async expectScreenshot(screenshotName: string) {
        const screenshotOptions = await this.getScreenshotOptions();
        await expect(this.page).toHaveScreenshot(screenshotName, screenshotOptions);
    }

    async clientRedirect(params: { examplePath: string }) {
        await super._clientRedirect<DocExamplePageParams>({
            // As we agreed, "doc example" tests must be always run on "loveship" theme
            theme: TTheme.loveship, ...params,
        });
        await this.locators.regionContentNotBusy.waitFor();
    }

    private async getScreenshotOptions(): Promise<IScreenshotOptions> {
        return super._getScreenshotOptions({
            isSlowTest: false,
        });
    }
}
