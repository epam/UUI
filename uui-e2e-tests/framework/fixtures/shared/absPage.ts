import { Locator, Page } from '@playwright/test';
import { TClip, TEngine } from '../../types';
import { PlayWrightInterfaceName } from '../../constants';
import { slowTestExpectTimeout } from '../../../playwright.config';
import { CdpSessionWrapper } from '../previewPage/cdpSessionWrapper';

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

    protected async _clientRedirect<T extends object>(params: T) {
        await this.page.mouse.move(0, 0);
        await this.page.evaluate(async (_params: string) => {
            const [p, i] = _params.split('[||||]');
            // @ts-ignore Reason: this specific code will be run in context of web page
            const globalObj = window as any;
            const waitForInterface = () => {
                return new Promise<any>((resolve, reject) => {
                    const get = () => globalObj[i];
                    if (get()) {
                        resolve(get());
                    } else {
                        const MAX_ATTEMPTS = 5;
                        let _attempts = 0;
                        const _intervalId = globalObj.setInterval(() => {
                            _attempts++;
                            if (get()) {
                                globalObj.clearInterval(_intervalId);
                                resolve(get());
                            } else if (_attempts === MAX_ATTEMPTS) {
                                globalObj.clearInterval(_intervalId);
                                reject(new Error(`Unable to find window.${i} global variable after ${_attempts} attempts.`));
                            }
                        }, 500);
                    }
                });
            };
            (await waitForInterface())(p);
        }, [jsonStringify(params), PlayWrightInterfaceName].join('[||||]'));
    }
}

function jsonStringify(json: object) {
    return JSON.stringify(json, undefined, 1);
}
