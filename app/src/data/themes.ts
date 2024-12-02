import { CustomThemeManifest } from './customThemes';
import settings_4px from './settings_4px';
import propsOverride_4px from './propsOverride_4px';

export enum BuiltInTheme {
    electric = 'electric',
    loveship = 'loveship',
    loveship_4px = 'loveship_4px',
    loveship_dark = 'loveship_dark',
    loveship_dark_4px = 'loveship_dark_4px',
    promo = 'promo',
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
    { id: BuiltInTheme.loveship_4px, name: 'Loveship Light 4px', settings: settings_4px, propsOverride: propsOverride_4px },
    { id: BuiltInTheme.loveship_dark, name: 'Loveship Dark' },
    { id: BuiltInTheme.loveship_dark_4px, name: 'Loveship Dark 4px', settings: settings_4px, propsOverride: propsOverride_4px },
    { id: BuiltInTheme.vanilla_thunder, name: 'Vanilla Thunder' },
    { id: BuiltInTheme.promo, name: 'Promo' },
    { id: BuiltInTheme.eduverse_light, name: 'Eduverse Light' },
    { id: BuiltInTheme.eduverse_dark, name: 'Eduverse Dark' },
];
