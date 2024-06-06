import type { Page, Locator } from '@playwright/test';
import { PreviewPageParams, TClip, TEngine } from '../types';
import { PlayWrightInterfaceName, PREVIEW_URL } from '../constants';
import { CdpSessionWrapper } from './cdpSessionWrapper';

export class PreviewPage {
    private readonly locators: {
        regionContentNotBusy: Locator;
        regionScreenshotContent: Locator;
    };

    private readonly engine: TEngine;
    public cdpSession: CdpSessionWrapper;
    public readonly page: Page;

    constructor(params: { page: Page, engine: TEngine }) {
        const { page, engine } = params;
        this.page = page;
        this.engine = engine;
        this.cdpSession = new CdpSessionWrapper(page, engine);
        const regionContentNotBusy = page.locator('[aria-label="Preview Content"][aria-busy="false"]');
        const regionScreenshotContent = page.locator('[aria-label="Preview Content"][aria-busy="false"] > div');
        this.locators = {
            regionContentNotBusy,
            regionScreenshotContent,
        };
    }

    async focusElement(selector: string) {
        await this.page.locator(selector).first().focus();
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

    async close() {
        await this.cdpSession.close();
    }
}

function jsonStringify(json: object) {
    return JSON.stringify(json, undefined, 1);
}
