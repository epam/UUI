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

export const themeName: Record<TTheme, 'Promo' | 'Loveship Light' | 'Loveship Dark' | 'Electric' | 'Vanilla Thunder'> = {
    [TTheme.promo]: 'Promo',
    [TTheme.loveship]: 'Loveship Light',
    [TTheme.loveship_dark]: 'Loveship Dark',
    [TTheme.electric]: 'Electric',
    [TTheme.vanilla_thunder]: 'Vanilla Thunder',
};

export const DEFAULT_MODE = TMode.doc;
