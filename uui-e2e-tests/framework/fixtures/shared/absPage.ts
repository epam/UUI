import { Locator, Page } from '@playwright/test';
import type { Link } from '@epam/uui-core';
import { TClip, TEngine } from '../../types';
import { slowTestExpectTimeout } from '../../../playwright.config';
import { CdpSessionWrapper } from '../previewPage/cdpSessionWrapper';
import { queryToSearch } from '../../utils/queryToSearch';

export interface IScreenshotOptions {
    fullPage?: boolean;
    clip?: TClip;
    timeout?: number;
}

export interface IPageParams {
    page: Page;
    engine: TEngine;
    initialUrl: string;
    extraStyles?: string;
}

export abstract class AbsPage {
    public readonly page: Page;
    public readonly engine: TEngine;
    public readonly initialUrl: string;
    public readonly extraStyles?: string;
    public cdpSession: CdpSessionWrapper;

    protected constructor(pageParams: IPageParams) {
        this.page = pageParams.page;
        this.engine = pageParams.engine;
        this.initialUrl = pageParams.initialUrl;
        this.extraStyles = pageParams.extraStyles;
        this.cdpSession = new CdpSessionWrapper(this.page, this.engine);
    }

    async close() {
        await this.cdpSession.close();
    }

    async openInitialPage(url?: string): Promise<void> {
        await this.page.goto(url || this.initialUrl);
        if (this.extraStyles) {
            await this.page.addStyleTag({ path: this.extraStyles });
        }
    }

    async focusElement(selector: string) {
        await this.page.locator(selector).first().focus();
    }

    async clickElement(selector: string) {
        await this.page.locator(selector).first().click();
    }

    protected async _getScreenshotOptions(
        params: { isSlowTest?: boolean; locator?: Locator },
    ): Promise<IScreenshotOptions> {
        const { isSlowTest, locator } = params;
        const res: IScreenshotOptions = { fullPage: true };
        if (locator) {
            res.clip = await locator.boundingBox() as TClip;
        }
        if (isSlowTest) {
            res.timeout = slowTestExpectTimeout;
        }
        return res;
    }

    protected async _clientRedirect(link: Link) {
        await this.page.mouse.move(0, 0);
   
        const params = link.query ? queryToSearch(link.query) : link.search;
        await this.page.goto(`${link.pathname}${params?.length ? `?${params}` : ''}`);
        await this.page.waitForFunction(() => document.fonts.ready);
    }
}
