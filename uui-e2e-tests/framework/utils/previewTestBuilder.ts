import { previewPageTest } from '../../framework/fixtures';
import { TEngine, TKnownCompId, TMatrixFull, TMatrixMinimal, TTheme } from '../types';
import { TComponentId, THEMES, TPreviewIdByComponentId } from '../data/testData';
import { formatTestName } from './previewTestNameUtils';
import { PreviewTestBuilderContext } from './previewTestBuilderContext';
import { previewScreenshotsDirAbsPath } from '../../playwright.config';

export class PreviewTestBuilder {
    private cfgByComponent: Map<TComponentId, TMatrixFull[]> = new Map();

    skip<CompId extends TKnownCompId>(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        cid: CompId,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        matrix: TMatrixMinimal<TPreviewIdByComponentId[CompId]> | TMatrixMinimal<TPreviewIdByComponentId[CompId]>[],
    ): PreviewTestBuilder {
        return this;
    }

    only<CompId extends TKnownCompId>(
        cid: CompId,
        matrix: TMatrixMinimal<TPreviewIdByComponentId[CompId]> | TMatrixMinimal<TPreviewIdByComponentId[CompId]>[],
    ): PreviewTestBuilder {
        return this._add(cid, matrix, true);
    }

    /**
     * @param cid
     * @param matrix
     */
    add<CompId extends TKnownCompId>(
        cid: CompId,
        matrix: TMatrixMinimal<TPreviewIdByComponentId[CompId]> | TMatrixMinimal<TPreviewIdByComponentId[CompId]>[],
    ): PreviewTestBuilder {
        return this._add(cid, matrix, false);
    }

    private _add<CompId extends TKnownCompId>(
        cid: CompId,
        matrix: TMatrixMinimal<TPreviewIdByComponentId[CompId]> | TMatrixMinimal<TPreviewIdByComponentId[CompId]>[],
        only: boolean,
    ) {
        const prev = this.cfgByComponent.get(cid) || [];
        if (Array.isArray(matrix)) {
            matrix.forEach((item) => {
                prev.push({ ...(item as TMatrixMinimal), only });
            });
        } else {
            prev.push({ ...(matrix as TMatrixMinimal), only });
        }
        this.cfgByComponent.set(cid, prev);
        return this;
    }

    buildTests() {
        const ctx: PreviewTestBuilderContext = new PreviewTestBuilderContext(previewScreenshotsDirAbsPath);
        this.cfgByComponent.forEach((matrixArr, componentId) => {
            matrixArr.forEach((matrix) => {
                createTestsForSingleComponentId({ componentId, matrix }, ctx);
            });
        });
        ctx.reportIssues();
    }
}

function createTestsForSingleComponentId(builderParams: { componentId: TComponentId; matrix: TMatrixFull }, ctx: PreviewTestBuilderContext) {
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
                const testName = formatTestName({ ...pageParams, previewTag: matrix.previewTag });
                ctx.seen(testName, matrix.onlyChromium);
                if (ctx.isDryRun()) {
                    return;
                }
                const screenshotName = `${testName}.png`;
                if (ctx.shouldSkipTest(testName)) {
                    return;
                }
                const testFn = matrix.only ? previewPageTest.only : previewPageTest;

                testFn(testName, async ({ pageWrapper, browserName }) => {
                    if (matrix.onlyChromium) {
                        previewPageTest.skip(browserName !== TEngine.chromium, `This test is "${TEngine.chromium}"-only`);
                    }
                    await pageWrapper.clientRedirect(pageParams);
                    if (matrix.onBeforeExpect) {
                        await matrix.onBeforeExpect({ pageWrapper, previewId });
                    }
                    if (matrix.focusFirstElement) {
                        const sel = matrix.focusFirstElement({ previewId });
                        typeof sel === 'string' && await pageWrapper.focusElement(sel);
                    }

                    if (matrix.clickElement) {
                        const sel = matrix.clickElement({ previewId });
                        typeof sel === 'string' && await pageWrapper.clickElement(sel);
                    }
                    if (matrix.forcePseudoState) {
                        try {
                            await pageWrapper.cdpSession.cssForcePseudoState(matrix.forcePseudoState);
                            await assert();
                        } finally {
                            await pageWrapper.cdpSession.close();
                        }
                    } else {
                        await assert();
                    }
                    async function assert() {
                        await pageWrapper.expectScreenshot({
                            isSlowTest: matrix.slow,
                            screenshotName,
                        });
                    }
                });
            });
        }
    });
}
