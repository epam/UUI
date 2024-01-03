import { TFigmaThemeName, TUuiCssVarName } from './types/sharedTypes';

interface IFigmaVarsConfig {
    [pathPrefix: string]: IFigmaVarConfigValue
}
type TList = Record<string, TFigmaThemeName[]>;
export interface IFigmaVarConfigValue {
    pathToCssVar: (path: string) => TUuiCssVarName;
    whitelist?: TList;
    blacklist?: TList;
}

const { EPAM, PROMO, LOVESHIP_LIGHT, LOVESHIP_DARK } = TFigmaThemeName;
const ALL = Object.values(TFigmaThemeName);

export const FIGMA_VARS_CFG: IFigmaVarsConfig = {
    'core/': {
        pathToCssVar: corePathToCssVar,
        blacklist: {
            'core/text/text-contrast': [...ALL],
            'core/text/text-white': [...ALL],
            'core/text/text-black': [...ALL],
        },
    },
    'palette-additional/': {
        pathToCssVar: palettePathToCssVar,
    },
    'palette/': {
        pathToCssVar: palettePathToCssVar,
        whitelist: {
            'palette/amber/amber-5': [PROMO],
            'palette/amber/amber-10': [PROMO],
            'palette/amber/amber-20': [PROMO],
            'palette/amber/amber-50': [PROMO],
            'palette/amber/amber-60': [PROMO],
            'palette/amber/amber-70': [PROMO],
            'palette/blue/blue-5': [PROMO],
            'palette/blue/blue-10': [PROMO],
            'palette/blue/blue-20': [PROMO],
            'palette/blue/blue-50': [PROMO],
            'palette/blue/blue-60': [PROMO],
            'palette/blue/blue-70': [PROMO],
            'palette/electric/electric-5': [EPAM],
            'palette/electric/electric-10': [EPAM],
            'palette/electric/electric-20': [EPAM],
            'palette/electric/electric-50': [EPAM],
            'palette/electric/electric-60': [EPAM],
            'palette/electric/electric-70': [EPAM],
            'palette/emerald/emerald-5': [EPAM],
            'palette/emerald/emerald-10': [EPAM],
            'palette/emerald/emerald-20': [EPAM],
            'palette/emerald/emerald-50': [EPAM],
            'palette/emerald/emerald-60': [EPAM],
            'palette/emerald/emerald-70': [EPAM],
            'palette/fire/fire-5': [LOVESHIP_LIGHT, LOVESHIP_DARK, EPAM],
            'palette/fire/fire-10': [LOVESHIP_LIGHT, LOVESHIP_DARK, EPAM],
            'palette/fire/fire-20': [LOVESHIP_LIGHT, LOVESHIP_DARK, EPAM],
            'palette/fire/fire-50': [LOVESHIP_LIGHT, LOVESHIP_DARK, EPAM],
            'palette/fire/fire-60': [LOVESHIP_LIGHT, LOVESHIP_DARK, EPAM],
            'palette/fire/fire-70': [LOVESHIP_LIGHT, LOVESHIP_DARK, EPAM],
            'palette/gray/gray5': [PROMO],
            'palette/gray/gray10': [PROMO],
            'palette/gray/gray20': [PROMO],
            'palette/gray/gray30': [PROMO],
            'palette/gray/gray40': [PROMO],
            'palette/gray/gray50': [PROMO],
            'palette/gray/gray60': [PROMO],
            'palette/gray/gray70': [PROMO],
            'palette/gray/gray80': [PROMO],
            'palette/gray/gray90': [PROMO],
            'palette/green/green-5': [PROMO],
            'palette/green/green-10': [PROMO],
            'palette/green/green-20': [PROMO],
            'palette/green/green-50': [PROMO],
            'palette/green/green-60': [PROMO],
            'palette/green/green-70': [PROMO],
            'palette/night/night50': [LOVESHIP_LIGHT, LOVESHIP_DARK, EPAM],
            'palette/night/night100': [LOVESHIP_LIGHT, LOVESHIP_DARK, EPAM],
            'palette/night/night200': [LOVESHIP_LIGHT, LOVESHIP_DARK, EPAM],
            'palette/night/night300': [LOVESHIP_LIGHT, LOVESHIP_DARK, EPAM],
            'palette/night/night400': [LOVESHIP_LIGHT, LOVESHIP_DARK, EPAM],
            'palette/night/night500': [LOVESHIP_LIGHT, LOVESHIP_DARK, EPAM],
            'palette/night/night600': [LOVESHIP_LIGHT, LOVESHIP_DARK, EPAM],
            'palette/night/night700': [LOVESHIP_LIGHT, LOVESHIP_DARK, EPAM],
            'palette/night/night800': [LOVESHIP_LIGHT, LOVESHIP_DARK, EPAM],
            'palette/night/night900': [LOVESHIP_LIGHT, LOVESHIP_DARK, EPAM],
            'palette/night/night950': [EPAM],
            'palette/red/red-5': [PROMO],
            'palette/red/red-10': [PROMO],
            'palette/red/red-20': [PROMO],
            'palette/red/red-50': [PROMO],
            'palette/red/red-60': [PROMO],
            'palette/red/red-70': [PROMO],
            'palette/sky/sky-5': [LOVESHIP_LIGHT, LOVESHIP_DARK],
            'palette/sky/sky-10': [LOVESHIP_LIGHT, LOVESHIP_DARK],
            'palette/sky/sky-20': [LOVESHIP_LIGHT, LOVESHIP_DARK],
            'palette/sky/sky-50': [LOVESHIP_LIGHT, LOVESHIP_DARK],
            'palette/sky/sky-60': [LOVESHIP_LIGHT, LOVESHIP_DARK],
            'palette/sky/sky-70': [LOVESHIP_LIGHT, LOVESHIP_DARK],
            'palette/sun/sun-5': [LOVESHIP_LIGHT, LOVESHIP_DARK, EPAM],
            'palette/sun/sun-10': [LOVESHIP_LIGHT, LOVESHIP_DARK, EPAM],
            'palette/sun/sun-20': [LOVESHIP_LIGHT, LOVESHIP_DARK, EPAM],
            'palette/sun/sun-50': [LOVESHIP_LIGHT, LOVESHIP_DARK, EPAM],
            'palette/sun/sun-60': [LOVESHIP_LIGHT, LOVESHIP_DARK, EPAM],
            'palette/sun/sun-70': [LOVESHIP_LIGHT, LOVESHIP_DARK, EPAM],
            'palette/white': [LOVESHIP_LIGHT, LOVESHIP_DARK, PROMO, EPAM],
        },
    },
};

function palettePathToCssVar(path: string): TUuiCssVarName {
    const tokens = path.split('/');
    const lastToken = tokens[tokens.length - 1];
    return `--${lastToken}`;
}
function corePathToCssVar(path: string): TUuiCssVarName {
    const tokens = path.split('/');
    const lastToken = tokens[tokens.length - 1];
    return `--uui-${lastToken}`;
}
