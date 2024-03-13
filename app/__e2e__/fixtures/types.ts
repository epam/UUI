import { ViewportSize } from '@playwright/test';

export type TPropEditorOptions = {
    componentId: string;
    theme: TTheme;
    isSkin: boolean;
    previewId: string;
};

export enum TTheme {
    electric = 'electric',
    loveship = 'loveship',
    loveship_dark = 'loveship_dark',
    promo = 'promo',
    vanilla_thunder = 'vanilla_thunder'
}

export type TTestMatrix = {
    theme: TTheme[];
    isSkin: boolean[];
    previewId: string[];
};

export type TTestComponentScreenshotParams = {
    namespace?: string;
    /**
     * This "id" which corresponds to "id" URL param defined here: app/src/documents/structure.ts
     */
    componentId: string;
    matrix: TTestMatrix;
    viewport?: ViewportSize;
};
