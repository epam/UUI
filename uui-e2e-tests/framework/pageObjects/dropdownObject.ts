import { Locator, Page } from '@playwright/test';

export class DropdownObject {
    public readonly locators: {
        contentWrapper: Locator;
        dropdown: {
            target: Locator;
            body: Locator;
        },
    };

    constructor(public page: Page) {
        const wrapper = page.locator('[aria-label="Preview Content"][aria-busy="false"]');
        const target = page.locator('[aria-haspopup="true"]');
        const body = page.locator('div[role="dialog"]');
        this.locators = {
            contentWrapper: wrapper,
            dropdown: {
                target,
                body,
            },
        };
    }

    async waitForContentLoad() {
        await this.locators.contentWrapper.waitFor();
    }

    async hoverTarget() {
        await this.locators.dropdown.target.hover();
    }

    async clickTarget() {
        await this.locators.dropdown.target.click();
    }

    async mouseMoveFromLocatorToBottom({ locator, directionY }: { locator: Locator, directionY: number }) {
        const box = await locator.boundingBox();
        if (!box) {
            throw new Error('Element is not visible');
        }
        const { x, y, width, height } = box;
        const x1 = x + width / 2;
        const y1 = y + height + directionY;

        await this.page.mouse.move(x1, y1);
    }

    /**
     * Reset mouse pos to avoid unintentional hover effects
     */
    async resetMousePos() {
        await this.page.mouse.move(0, 0);
    }

    async waitDropdownBodyVisible() {
        await this.locators.dropdown.body.waitFor({ state: 'visible' });
    }

    async waitDropdownBodyHidden() {
        await this.locators.dropdown.body.waitFor({ state: 'hidden' });
    }

    async addScrollToContentWrapper() {
        await this.page.addStyleTag({
            content: `
                .test-style {
                  height: 1000px;
                  margin-top: 600px;
                }
            `,
        });
        await this.locators.contentWrapper.evaluate((element: HTMLElement) => {
            element.classList.add('test-style');
        });
    }

    async removeStylesFromContentWrapper() {
        await this.locators.contentWrapper.evaluate((element: HTMLElement) => {
            element.classList.remove('test-style');
        });
    }

    async mouseWheel(y: number) {
        await this.page.mouse.wheel(0, y);
    }
}
