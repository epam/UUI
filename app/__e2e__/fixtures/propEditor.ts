import type { Page, ElementHandle, Locator } from '@playwright/test';
import { TPropEditorOptions, TTheme } from './types';

export const TEST_AUTOMATION_MASK = 'uui-test-automation-mask';

export const componentPreviewURL = (params: Partial<TPropEditorOptions>) => {
    const query: Record<string, any> = {
        componentId: params.componentId,
        isSkin: params.isSkin,
        theme: params.theme,
        previewId: params.previewId,
    };
    const queryStr = Object.keys(query).filter((name) => query[name] !== undefined).map((name) => `${name}=${query[name]}`).join('&');
    return `/preview?${queryStr}`;
};

export class PropEditor {
    constructor(public readonly page: Page) {
    }

    async goto(params: Partial<{ componentId: string; theme: TTheme; isSkin: boolean; previewId: string; }>) {
        const url = componentPreviewURL(params);
        await this.page.goto(url);
    }

    getMask(): Locator[] {
        return [this.page.locator(`css=.${TEST_AUTOMATION_MASK}`)];
    }

    async editPreview(params: { componentId: string; theme: TTheme; isSkin: boolean; previewId: string; }) {
        let toolbarRegion = await this.getToolbarRegion();
        const editInline = await toolbarRegion.waitForSelector('button:has-text("Edit Inline")');
        await editInline.click();
        const inlineEditor = await toolbarRegion.waitForSelector('div.uui-input-box textarea') as ElementHandle<HTMLInputElement>;

        const rawValue = JSON.stringify(params, undefined, 1);
        await inlineEditor.fill(rawValue);

        const confirmBtn = await toolbarRegion.waitForSelector('button:has-text("Apply")');
        await confirmBtn.click();
        toolbarRegion = await this.getToolbarRegion();
        await toolbarRegion.waitForSelector('button:has-text("Edit Inline")');
        await this.getContentRegion();
    }

    private async getToolbarRegion() {
        return await this.page.waitForSelector('div[role="region"][aria-label="Preview Toolbar"]');
    }

    private async getContentRegion() {
        return await this.page.waitForSelector('div[role="region"][aria-label="Preview Content"]:not([aria-busy="true"])');
    }
}
