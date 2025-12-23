import { expect, type Locator } from '@playwright/test';
import { type PreviewPageParams } from '../../types';
import { AbsPage, type IPageParams } from '../shared/absPage';
import type { TComponentPreview } from '@epam/uui-docs';
import { Link } from '@epam/uui-core';
import { PlayWrightInterfaceName } from '../../constants';

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
        await this._clientRedirect({
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

    protected async _clientRedirect(link: Link) {
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
            const playWrightInterface = await waitForInterface();
            playWrightInterface.clientRedirect(p);
        }, [jsonStringify(link), PlayWrightInterfaceName].join('[||||]'));
    }
}

function jsonStringify(json: object) {
    return JSON.stringify(json, undefined, 1);
}
