import { expect } from '@playwright/test';
import { test } from '../fixtures';
import { ScreenshotTestParamsSingle, TMatrix, TMatrixMinimal, TTheme } from '../types';
import { TComponentId, TPreviewIdByComponentId } from '../data/testData';
import { createUniqueTestName } from './testNameUtils';
import { Ctx } from './ctx';
import { screenshotsDirAbsPath } from '../../playwright.config';

export class TestBuilder {
    private cfgByComponent: Map<TComponentId, TMatrix[]> = new Map();

    /**
     * @param cid
     * @param matrix
     */
    add<PComp extends keyof TPreviewIdByComponentId>(cid: PComp, matrix: TMatrixMinimal<TPreviewIdByComponentId[typeof cid]>) {
        type TPreviewsArr = TPreviewIdByComponentId[typeof cid];
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
        };
        prev!.push(matrixFull);
        return this;
    }

    buildTests(params?: { runId?: string }) {
        const ctx: Ctx = new Ctx(screenshotsDirAbsPath);
        const runId = params?.runId;
        this.cfgByComponent.forEach((matrixArr, componentId) => {
            matrixArr.forEach((matrix) => {
                createTestsForSingleComponentId({ runId, componentId, matrix }, ctx);
            });
        });
        ctx.reportIssues();
    }
}

function createTestsForSingleComponentId(builderParams: ScreenshotTestParamsSingle, ctx: Ctx) {
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
                test(testName, async ({ previewPage }) => {
                    await previewPage.editPreview(pageParams);
                    await matrix.onBeforeExpect({ previewPage });
                    const opts = await previewPage.getScreenshotOptions();
                    await expect(previewPage.page).toHaveScreenshot(screenshotName, { ...opts });
                });
            });
        });
    });
}
