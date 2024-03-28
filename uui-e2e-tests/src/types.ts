import { TPreviewIdByComponentId, TComponentId } from './constants';
import type { PreviewPage } from './pages/previewPage';

export type TClip = { x: number, y: number, width: number, height: number };

export enum TTheme {
    electric = 'electric',
    loveship = 'loveship',
    loveship_dark = 'loveship_dark',
    promo = 'promo',
    vanilla_thunder = 'vanilla_thunder'
}

export interface PreviewPageParams {
    componentId: TComponentId;
    theme: TTheme;
    isSkin: boolean;
    previewId: string;
}

export type TMatrix<Previews extends TPreviewIdByComponentId[keyof TPreviewIdByComponentId] = TPreviewIdByComponentId[keyof TPreviewIdByComponentId]> = {
    theme: TTheme[];
    isSkin: boolean[];
    previewId: Previews;
};
export type ScreenshotTestParamsSingle = {
    runId?: string;
    componentId: TComponentId;
    matrix: TMatrix;
    onBeforeAssertion?: (params: { previewPage: PreviewPage, pageParams: PreviewPageParams }) => Promise<void>
};
