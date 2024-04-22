import { TPropEditorTypeOverride } from '@epam/uui-docs';

export enum BuiltInTheme {
    electric = 'electric',
    loveship = 'loveship',
    loveship_dark = 'loveship_dark',
    promo = 'promo',
    vanilla_thunder = 'vanilla_thunder'
}

export interface Theme {
    id: string;
    name: string;
}
export interface CustomTheme extends Theme {
    css: string[];
    propsOverride?: TPropEditorTypeOverride;
}

export const builtInThemes: Theme[] = [
    { id: BuiltInTheme.loveship, name: 'Loveship Light' },
    { id: BuiltInTheme.loveship_dark, name: 'Loveship Dark' },
    { id: BuiltInTheme.electric, name: 'Electric' },
    { id: BuiltInTheme.vanilla_thunder, name: 'Vanilla Thunder' },
    { id: BuiltInTheme.promo, name: 'Promo' },
];
