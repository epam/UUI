import type { Page, Locator } from '@playwright/test';
import { PreviewPageParams, TClip } from '../types';
import { PlayWrightInterfaceName, PREVIEW_URL } from '../constants';

export class PreviewPage {
    private locators: {
        regionContentNotBusy: Locator;
        regionScreenshotContent: Locator;
    };

    constructor(public readonly page: Page) {
        const regionContentNotBusy = page.locator('[aria-label="Preview Content"][aria-busy="false"]');
        const regionScreenshotContent = page.locator('[aria-label="Preview Content"][aria-busy="false"] > div');
        this.locators = {
            regionContentNotBusy,
            regionScreenshotContent,
        };
    }

    async goto() {
        await this.page.goto(PREVIEW_URL);
    }

    async getScreenshotOptions(): Promise<{ fullPage?: boolean; clip: TClip }> {
        // in some very rare cases, the content is not fully ready, this small timeout solves the issue.
        await this.page.waitForTimeout(30);
        const clip = await this.locators.regionScreenshotContent.boundingBox() as TClip;
        return { fullPage: true, clip };
    }

    async editPreview(params: PreviewPageParams) {
        await this.page.evaluate((_params: string) => {
            const [p, i] = _params.split('[||||]');
            // @ts-ignore Reason: this specific code will be run in context of web page
            (window as any)[i](p);
        }, [jsonStringify(params), PlayWrightInterfaceName].join('[||||]'));
        await this.locators.regionContentNotBusy.waitFor();
    }
}

function jsonStringify(json: object) {
    return JSON.stringify(json, undefined, 1);
}
