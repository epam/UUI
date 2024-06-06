import { expect } from '@playwright/test';
import { test } from '../fixtures';
import { TEngine, TKnownCompId, TMatrixFull, TMatrixMinimal, TTheme } from '../types';
import { TComponentId, THEMES, TPreviewIdByComponentId } from '../data/testData';
import { createUniqueTestName } from './testNameUtils';
import { TestBuilderContext } from './testBuilderContext';
import { screenshotsDirAbsPath } from '../../playwright.config';

export class TestBuilder {
    private cfgByComponent: Map<TComponentId, TMatrixFull[]> = new Map();

    only<CompId extends TKnownCompId>(cid: CompId, matrix: TMatrixMinimal<TPreviewIdByComponentId[CompId]>): TestBuilder {
        return this._add(cid, matrix, true);
    }

    /**
     * @param cid
     * @param matrix
     */
    add<CompId extends TKnownCompId>(cid: CompId, matrix: TMatrixMinimal<TPreviewIdByComponentId[CompId]>): TestBuilder {
        return this._add(cid, matrix, false);
    }

    private _add<CompId extends TKnownCompId>(cid: CompId, matrix: TMatrixMinimal<TPreviewIdByComponentId[CompId]>, only: boolean) {
        const prev = this.cfgByComponent.get(cid) || [];
        prev.push({ ...(matrix as TMatrixMinimal), only });
        this.cfgByComponent.set(cid, prev);
        return this;
    }

    buildTests() {
        const ctx: TestBuilderContext = new TestBuilderContext(screenshotsDirAbsPath);
        this.cfgByComponent.forEach((matrixArr, componentId) => {
            matrixArr.forEach((matrix) => {
                createTestsForSingleComponentId({ componentId, matrix }, ctx);
            });
        });
        ctx.reportIssues();
    }
}

function createTestsForSingleComponentId(builderParams: { componentId: TComponentId; matrix: TMatrixFull }, ctx: TestBuilderContext) {
    const { componentId, matrix } = builderParams;
    const themeArr = matrix.theme || THEMES.allExceptVanillaThunder;
    const supportedSkins = matrix.skins || [];
    themeArr.forEach((theme: TTheme) => {
        testAllPreviews({ isSkin: false });
        const shouldTestSkin = supportedSkins.some((skin) => skin === theme);
        if (shouldTestSkin) {
            testAllPreviews({ isSkin: true });
        }
        function testAllPreviews(params: { isSkin: boolean }) {
            matrix.previewId.forEach((previewId) => {
                const pageParams = { theme, isSkin: params.isSkin, previewId, componentId };
                const testName = createUniqueTestName(pageParams);
                ctx.seen(testName, matrix.onlyChromium);
                if (ctx.isDryRun()) {
                    return;
                }
                const screenshotName = `${testName}.png`;
                if (ctx.shouldSkipTest(testName)) {
                    return;
                }
                const testFn = matrix.only ? test.only : test;
                testFn(testName, async ({ previewPage, browserName }) => {
                    if (matrix.onlyChromium) {
                        test.skip(browserName !== TEngine.chromium, `This test is "${TEngine.chromium}"-only`);
                    }
                    await previewPage.editPreview(pageParams);
                    if (matrix.onBeforeExpect) {
                        await matrix.onBeforeExpect({ previewPage, previewId });
                    }
                    if (matrix.focusFirstElement) {
                        const sel = matrix.focusFirstElement({ previewId });
                        typeof sel === 'string' && await previewPage.focusElement(sel);
                    }
                    if (matrix.forcePseudoState) {
                        try {
                            await previewPage.cdpSession.cssForcePseudoState(matrix.forcePseudoState);
                            await assert();
                        } finally {
                            await previewPage.cdpSession.close();
                        }
                    } else {
                        await assert();
                    }
                    async function assert() {
                        const opts = await previewPage.getScreenshotOptions();
                        await expect(previewPage.page).toHaveScreenshot(screenshotName, { ...opts, ...(matrix.slow ? { timeout: 15000 } : {}) });
                    }
                });
            });
        }
    });
}
