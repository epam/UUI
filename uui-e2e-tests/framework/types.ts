import type { TComponentId, TPreviewIdByComponentId } from './data/testData';
import type { PreviewPage } from './pages/previewPage';

export type TClip = { x: number, y: number, width: number, height: number };

export enum TEngine {
    chromium = 'chromium',
    webkit = 'webkit'
}

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

type TObjValues<T> = T[keyof T];
type TArrItem<T> = T extends (infer TItem)[] ? TItem : never;

export type TMatrixMinimal<PreviewIdArr extends TObjValues<TPreviewIdByComponentId> = TObjValues<TPreviewIdByComponentId>> = {
    previewId: PreviewIdArr;
    theme?: TTheme[];
    skins?: TTheme[];
    onBeforeExpect?: (params: { previewPage: PreviewPage, previewId: TArrItem<PreviewIdArr> }) => Promise<void>;
    focusFirstElement?: (params: { previewId: TArrItem<PreviewIdArr> }) => string | boolean | undefined;
    onlyChromium?: true;
    // Chromium-only! It uses Chrome DevToolsProtocol to set certain pseudo states to all elements matching given CSS selector.
    forcePseudoState?: {
        state: 'hover' | 'focus',
        // Valid CSS selector string. See also: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_selectors
        selector: string
    };
    // increases the default "expect" timeout
    slow?: true;
};

export type TMatrixFull<PreviewIdArr extends TObjValues<TPreviewIdByComponentId> = TObjValues<TPreviewIdByComponentId>> = TMatrixMinimal<PreviewIdArr> & {
    only?: boolean;
};

export type TKnownCompId = keyof TPreviewIdByComponentId;
