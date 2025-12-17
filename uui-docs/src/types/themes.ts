export enum BuiltInTheme {
    electric = 'electric',
    electric_dark = 'electric_dark',
    loveship = 'loveship',
    loveship_dark = 'loveship_dark',
    promo = 'promo',
    fresh_4px = 'fresh_4px',
    vanilla_thunder = 'vanilla_thunder',
    eduverse_light = 'eduverse_light',
    eduverse_dark = 'eduverse_dark'
}

/* No restrictions on custom theme id - it can be any string */
type CustomTheme = string;

export type ThemeId = BuiltInTheme | CustomTheme;
