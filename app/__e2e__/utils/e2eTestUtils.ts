import { expect } from '@playwright/test';
import { test } from '../fixtures/allFixtures';
import { TTestComponentScreenshotParams } from '../fixtures/types';

export function testComponentScreenshot(params: TTestComponentScreenshotParams) {
    const { componentId, matrix, namespace, viewport } = params;
    matrix.theme.forEach((theme) => {
        matrix.isSkin.forEach((isSkin) => {
            matrix.previewId.forEach((previewId) => {
                const groupName = `NS=${namespace} Component=${componentId} Theme=${theme} Skin=${isSkin} Preview=${previewId}`;
                const testName = `Screenshot: ${groupName}`;
                test.describe(() => {
                    if (viewport) {
                        test.use({
                            viewport,
                        });
                    }
                    test(testName, async ({ propEditor }) => {
                        await propEditor.editPreview({
                            componentId,
                            previewId,
                            isSkin,
                            theme,
                        });
                        const mask = propEditor.getMask();
                        await propEditor.page.waitForTimeout(50);
                        await expect(propEditor.page).toHaveScreenshot(`(${testName})${componentId}.png`, { fullPage: true, mask, maskColor: '#fff' });
                    });
                });
            });
        });
    });
}
