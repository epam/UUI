import { expect } from '@playwright/test';
import { test } from '../fixtures';
import { PreviewPageParams, ScreenshotTestParamsSingle, TMatrix, TTheme } from '../types';
import { TComponentId, TPreviewIdByComponentId } from '../data/testData';
import { testNameToFileName, createUniqueTestName } from './testNameUtils';
import { Ctx } from './ctx';
import { screenshotsDirAbsPath } from '../../playwright.config';

export class TestBuilder {
    private cfgByComponent: Map<TComponentId, TMatrix[]> = new Map();

    /**
     * @param cid
     * @param matrix
     */
    add<Comp extends keyof TPreviewIdByComponentId>(cid: Comp, matrix: Partial<TMatrix<TPreviewIdByComponentId[typeof cid]>> & Pick<TMatrix<TPreviewIdByComponentId[typeof cid]>, 'previewId'>) {
        let prev = this.cfgByComponent.get(cid);
        if (!prev) {
            prev = [];
            this.cfgByComponent.set(cid, prev);
        }
        const theme = matrix.theme === undefined
            ? Object.values(TTheme).filter((t) => t !== TTheme.vanilla_thunder)
            : matrix.theme;
        const matrixFull: TMatrix<TPreviewIdByComponentId[typeof cid]> = {
            ...matrix,
            isSkin: matrix.isSkin === undefined ? [true, false] : matrix.isSkin,
            theme,
        };
        prev!.push(matrixFull as TMatrix<TPreviewIdByComponentId[typeof cid]>);
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

        ctx.reportUnusedScreenshots();
    }
}

function createTestsForSingleComponentId(builderParams: ScreenshotTestParamsSingle, ctx: Ctx) {
    const { componentId, matrix, runId } = builderParams;
    matrix.theme.forEach((theme) => {
        matrix.isSkin.forEach((isSkin) => {
            matrix.previewId.forEach((previewId) => {
                const pageParams = { theme, isSkin, previewId, componentId };
                const testName = createUniqueTestName({ runId, pageParams });
                const screenshotName = testNameToFileName(testName);
                ctx.seen(testName);
                testScreenshot({ pageParams, testName, screenshotName: `${screenshotName}.png` });
            });
        });
    });
}

function testScreenshot(
    params: { pageParams: PreviewPageParams, testName: string, screenshotName: string },
) {
    const { pageParams, testName, screenshotName } = params;
    test(testName, async ({ previewPage }) => {
        await previewPage.editPreview(pageParams);
        const opts = await previewPage.getScreenshotOptions();
        await expect(previewPage.page).toHaveScreenshot(screenshotName, { ...opts });
    });
}
