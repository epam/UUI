export enum TMode {
    doc = 'doc',
    propsEditor = 'propsEditor'
}

export enum TTheme {
    electric = 'electric',
    loveship = 'loveship',
    loveship_dark = 'loveship_dark',
    promo = 'promo',
    vanilla_thunder = 'vanilla_thunder'
}

export type TUUITheme = `uui-theme-${TTheme}`;

export const DEFAULT_MODE = TMode.doc;
export const DEFAULT_THEME: TUUITheme = 'uui-theme-loveship';
