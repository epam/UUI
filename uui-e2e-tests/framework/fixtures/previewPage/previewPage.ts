import { expect, type Locator } from '@playwright/test';
import { type PreviewPageParams } from '../../types';
import { AbsPage, type IPageParams } from '../shared/absPage';
import type { TComponentPreview } from '@epam/uui-docs';

const INLINE_PREVIEW_PREFIX = 'json:';

function formatPreviewIdToString(previewId: string | undefined | TComponentPreview<unknown>): string | undefined {
    if (previewId) {
        if (typeof previewId !== 'string') {
            return `${INLINE_PREVIEW_PREFIX}${JSON.stringify(previewId)}`;
        }
        return previewId;
    }
}
export class PreviewPage extends AbsPage {
    private readonly locators: {
        readonly regionContentNotBusy: Locator;
        readonly regionScreenshotContent: Locator;
    };

    constructor(params: IPageParams) {
        super(params);
        const regionContentNotBusy = this.page.locator('[aria-label="Page Content"][aria-busy="false"]');
        const regionScreenshotContent = regionContentNotBusy.locator('> div');
        this.locators = {
            regionContentNotBusy,
            regionScreenshotContent,
        };
    }

    async clientRedirect(params: PreviewPageParams) {
        await super._clientRedirect({
            pathname: '/preview',
            query: {
                theme: params.theme,
                isSkin: params.isSkin ?? true,
                componentId: params.componentId,
                previewId: formatPreviewIdToString(params.previewId),
            },
        });
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
