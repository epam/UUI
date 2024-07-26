import type { Locator, Page } from '@playwright/test';
import { DocExamplePageParams, TEngine, TTheme } from '../../types';
import { DOC_EXAMPLE_URL, PlayWrightInterfaceName } from '../../constants';

export class DocExamplePage {
    private readonly locators: {
        regionContentNotBusy: Locator;
    };

    private readonly engine: TEngine;
    public readonly page: Page;

    constructor(params: { page: Page, engine: TEngine }) {
        const { page, engine } = params;
        this.page = page;
        this.engine = engine;
        this.locators = {
            regionContentNotBusy: page.locator('[aria-label="Doc Example Content"][aria-busy="false"]'),
        };
    }

    async goto() {
        await this.page.goto(DOC_EXAMPLE_URL);
    }

    async editDocExample(params: Pick<DocExamplePageParams, 'examplePath'>) {
        const paramsFull: DocExamplePageParams = {
            // As we agreed, "doc example" tests must be always run on "loveship" theme
            theme: TTheme.loveship,
            ...params,
        };
        await this.page.evaluate((_params: string) => {
            const [p, i] = _params.split('[||||]');
            // @ts-ignore Reason: this specific code will be run in context of web page
            (window as any)[i](p);
        }, [jsonStringify(paramsFull), PlayWrightInterfaceName].join('[||||]'));
        await this.locators.regionContentNotBusy.waitFor();
    }

    async close() {

    }
}

function jsonStringify(json: object) {
    return JSON.stringify(json, undefined, 1);
}
