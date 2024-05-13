import { expect } from '@playwright/test';
import { test } from '../fixtures';
import { TMatrix, TMatrixMinimal, TTheme } from '../types';
import { TComponentId, TPreviewIdByComponentId } from '../data/testData';
import { createUniqueTestName } from './testNameUtils';
import { TestBuilderContext } from './testBuilderContext';
import { screenshotsDirAbsPath } from '../../playwright.config';

export class TestBuilder {
    private cfgByComponent: Map<TComponentId, TMatrix[]> = new Map();

    only<PComp extends keyof TPreviewIdByComponentId, PMatrix extends TMatrixMinimal<TPreviewIdByComponentId[PComp]>>(cid: PComp, matrix: PMatrix): TestBuilder {
        return this._add(cid, matrix, true);
    }

    /**
     * @param cid
     * @param matrix
     */
    add<PComp extends keyof TPreviewIdByComponentId, PMatrix extends TMatrixMinimal<TPreviewIdByComponentId[PComp]>>(cid: PComp, matrix: PMatrix): TestBuilder {
        return this._add(cid, matrix);
    }

    private _add<
        PComp extends keyof TPreviewIdByComponentId,
        PMatrix extends TMatrixMinimal<TPreviewIdByComponentId[PComp]>
    >(cid: PComp, matrix: PMatrix, only?: boolean) {
        type TPreviewsArr = TPreviewIdByComponentId[PComp];
        let prev = this.cfgByComponent.get(cid);
        if (!prev) {
            prev = [];
            this.cfgByComponent.set(cid, prev);
        }
        const theme = matrix.theme === undefined
            ? Object.values(TTheme).filter((t) => t !== TTheme.vanilla_thunder)
            : matrix.theme;
        const isSkin = matrix.isSkin === undefined ? [true, false] : matrix.isSkin;
        const onBeforeExpect = matrix.onBeforeExpect === undefined ? async () => {} : matrix.onBeforeExpect;
        const matrixFull: TMatrix<TPreviewsArr> = {
            ...matrix,
            isSkin,
            theme,
            onBeforeExpect,
            only,
        };
        prev!.push(matrixFull);
        return this;
    }

    buildTests(params?: { runId?: string }) {
        const ctx: TestBuilderContext = new TestBuilderContext(screenshotsDirAbsPath);
        const runId = params?.runId;
        this.cfgByComponent.forEach((matrixArr, componentId) => {
            matrixArr.forEach((matrix) => {
                createTestsForSingleComponentId({ runId, componentId, matrix }, ctx);
            });
        });
        ctx.reportIssues();
    }
}

type ScreenshotTestParamsSingle = {
    runId?: string;
    componentId: TComponentId;
    matrix: TMatrix;
};

function createTestsForSingleComponentId(builderParams: ScreenshotTestParamsSingle, ctx: TestBuilderContext) {
    const { componentId, matrix, runId } = builderParams;
    matrix.theme.forEach((theme) => {
        matrix.isSkin.forEach((isSkin) => {
            matrix.previewId.forEach((previewId) => {
                const pageParams = { theme, isSkin, previewId, componentId };
                const testName = createUniqueTestName({ runId, pageParams });
                ctx.seen(testName);
                const screenshotName = `${testName}.png`;
                if (ctx.shouldSkipTest(testName)) {
                    return;
                }
                const testFn = matrix.only ? test.only : test;
                testFn(testName, async ({ previewPage }) => {
                    await previewPage.editPreview(pageParams);
                    await matrix.onBeforeExpect({ previewPage, previewId });
                    if (matrix.focusFirstElement) {
                        const sel = matrix.focusFirstElement({ previewId });
                        typeof sel === 'string' && await previewPage.focusElement(sel);
                    }
                    if (matrix.waitFor) {
                        await previewPage.page.waitForTimeout(matrix.waitFor);
                    }
                    if (matrix.blurActiveElement) {
                        await previewPage.page.evaluate(() => {
                            // @ts-ignore
                            const elem = document.activeElement;
                            if (elem) {
                                elem.blur();
                            }
                        });
                    }
                    const opts = await previewPage.getScreenshotOptions();
                    await expect(previewPage.page).toHaveScreenshot(screenshotName, { ...opts });
                });
            });
        });
    });
}
