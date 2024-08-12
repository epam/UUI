import { expect, type Locator } from '@playwright/test';
import { type DocExamplePageParams, TTheme } from '../../types';
import { type IPageParams, AbsPage } from '../shared/absPage';

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

    async clientRedirect(params: { examplePath: string }) {
        await super._clientRedirect<DocExamplePageParams>({
            // As we agreed, "doc example" tests must be always run on "loveship" theme
            theme: TTheme.loveship, ...params,
        });
        await this.locators.regionContentNotBusy.waitFor();
    }

    async expectScreenshot(screenshotName: string) {
        const screenshotOptions = await super._getScreenshotOptions({ isSlowTest: true });
        await expect(this.page).toHaveScreenshot(screenshotName, screenshotOptions);
    }
}
