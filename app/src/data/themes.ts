import { CustomThemeManifest } from './customThemes';
import settings_4px from './settings_4px';
import propsOverride_4px from './propsOverride_4px';

export enum BuiltInTheme {
    electric = 'electric',
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

export interface ThemeBaseParams extends Partial<CustomThemeManifest> {
    id: ThemeId;
    name: string;
}

export const builtInThemes: ThemeBaseParams[] = [
    { id: BuiltInTheme.electric, name: 'Electric' },
    { id: BuiltInTheme.loveship, name: 'Loveship Light' },
    { id: BuiltInTheme.loveship_dark, name: 'Loveship Dark' },
    { id: BuiltInTheme.fresh_4px, name: 'Fresh Light 4px', settings: settings_4px, propsOverride: propsOverride_4px, css: null },
    { id: BuiltInTheme.promo, name: 'Promo' },
    { id: BuiltInTheme.vanilla_thunder, name: 'Vanilla Thunder' },
    { id: BuiltInTheme.eduverse_light, name: 'Eduverse Light' },
    { id: BuiltInTheme.eduverse_dark, name: 'Eduverse Dark' },
];
