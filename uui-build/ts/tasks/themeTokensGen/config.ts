import { TFigmaThemeName, TUuiCssVarName } from './types/sharedTypes';
import { corePathToCssVar, palettePathToCssVar } from './utils/cssVarUtils';

interface IFigmaVarsConfig {
    [pathPrefix: string]: IFigmaVarConfigValue
}
export type TList = Record<string, TFigmaThemeName[] | '*'>;
export interface IFigmaVarConfigValue {
    enabled: boolean;
    pathToCssVar: (path: string) => TUuiCssVarName;
    whitelist?: TList;
    blacklist?: TList;
}

const { EPAM, PROMO, LOVESHIP_LIGHT, LOVESHIP_DARK } = TFigmaThemeName;

const USE_TEMP_BL_AND_WL = false;

export const FIGMA_VARS_CFG: IFigmaVarsConfig = clearLists({
    'core/': {
        enabled: true,
        pathToCssVar: corePathToCssVar,
        whitelist: {
            'core/border-radius': '*',
            'core/controls/control-bg': '*',
            'core/controls/control-bg-disabled': '*',
            'core/controls/control-bg-hover': '*',
            'core/controls/control-border': '*',
            'core/controls/control-border-disabled': '*',
            'core/controls/control-border-hover': '*',
            'core/controls/control-icon': '*',
            'core/controls/control-icon-disabled': '*',
            'core/controls/control-placeholder': '*',
            'core/controls/control-placeholder-disabled': '*',
            'core/controls/control-text': '*',
            'core/controls/control-text-disabled': '*',
            'core/icons/icon': '*',
            'core/icons/icon-active': '*',
            'core/icons/icon-disabled': '*',
            'core/icons/icon-hover': '*',
            'core/links/link-disabled': '*',
            'core/links/link-hover': '*',
            'core/links/link-visited': '*',
            'core/neutral/neutral-0': '*',
            'core/neutral/neutral-5': '*',
            'core/neutral/neutral-10': '*',
            'core/neutral/neutral-20': '*',
            'core/neutral/neutral-30': '*',
            'core/neutral/neutral-40': '*',
            'core/neutral/neutral-50': '*',
            'core/neutral/neutral-60': '*',
            'core/neutral/neutral-70': '*',
            'core/neutral/neutral-80': '*',
            'core/neutral/neutral-90': '*',
            'core/neutral/neutral-95': [EPAM],
            'core/neutral/neutral-100': '*',
            'core/other/outline-focus': '*',
            'core/other/skeleton': '*',
            'core/semantic/accent-5': '*',
            'core/semantic/accent-10': '*',
            'core/semantic/accent-20': '*',
            'core/semantic/accent-50': '*',
            'core/semantic/accent-60': '*',
            'core/semantic/accent-70': '*',
            'core/semantic/accent-contrast': '*',
            'core/semantic/critical-5': '*',
            'core/semantic/critical-10': '*',
            'core/semantic/critical-20': '*',
            'core/semantic/critical-50': '*',
            'core/semantic/critical-60': '*',
            'core/semantic/critical-70': '*',
            'core/semantic/critical-contrast': '*',
            'core/semantic/error-5': '*',
            'core/semantic/error-10': '*',
            'core/semantic/error-20': '*',
            'core/semantic/error-50': '*',
            'core/semantic/error-60': '*',
            'core/semantic/error-70': '*',
            'core/semantic/error-contrast': '*',
            'core/semantic/info-10': '*',
            'core/semantic/info-20': '*',
            'core/semantic/info-50': '*',
            'core/semantic/info-60': '*',
            'core/semantic/info-70': '*',
            'core/semantic/info-contrast': '*',
            'core/semantic/primary-10': '*',
            'core/semantic/primary-20': '*',
            'core/semantic/primary-50': '*',
            'core/semantic/primary-60': '*',
            'core/semantic/primary-70': '*',
            'core/semantic/primary-contrast': '*',
            'core/semantic/secondary-5': '*',
            'core/semantic/secondary-10': '*',
            'core/semantic/secondary-20': '*',
            'core/semantic/secondary-50': '*',
            'core/semantic/secondary-60': '*',
            'core/semantic/secondary-70': '*',
            'core/semantic/secondary-contrast': '*',
            'core/semantic/success-5': '*',
            'core/semantic/success-10': '*',
            'core/semantic/success-20': '*',
            'core/semantic/success-50': '*',
            'core/semantic/success-60': '*',
            'core/semantic/success-70': '*',
            'core/semantic/success-contrast': '*',
            'core/semantic/warning-5': '*',
            'core/semantic/warning-10': '*',
            'core/semantic/warning-20': '*',
            'core/semantic/warning-50': '*',
            'core/semantic/warning-60': '*',
            'core/semantic/warning-70': '*',
            'core/semantic/warning-contrast': '*',
            'core/surfaces/divider': '*',
            'core/surfaces/divider-light': '*',
            'core/surfaces/overlay': '*',
            'core/surfaces/surface-higher': '*',
            'core/surfaces/surface-highest': '*',
            'core/surfaces/surface-main': '*',
            'core/surfaces/surface-sunken': '*',
            'core/text/text-brand': '*',
            'core/text/text-critical': '*',
            'core/text/text-disabled': '*',
            'core/text/text-info': '*',
            'core/text/text-primary': '*',
            'core/text/text-secondary': '*',
            'core/text/text-success': '*',
            'core/text/text-tertiary': '*',
            'core/text/text-warning': '*',
        },
    },
    'palette-additional/': {
        enabled: true,
        pathToCssVar: palettePathToCssVar,
        whitelist: {
            'palette-additional/cobalt/cobalt-5': '*',
            'palette-additional/cobalt/cobalt-10': '*',
            'palette-additional/cobalt/cobalt-20': '*',
            'palette-additional/cobalt/cobalt-50': '*',
            'palette-additional/cyan/cyan-5': '*',
            'palette-additional/cyan/cyan-10': '*',
            'palette-additional/cyan/cyan-20': '*',
            'palette-additional/cyan/cyan-50': '*',
            'palette-additional/fuchsia/fuchsia-5': '*',
            'palette-additional/fuchsia/fuchsia-10': '*',
            'palette-additional/fuchsia/fuchsia-20': '*',
            'palette-additional/fuchsia/fuchsia-50': '*',
            'palette-additional/mint/mint-5': '*',
            'palette-additional/mint/mint-10': '*',
            'palette-additional/mint/mint-20': '*',
            'palette-additional/mint/mint-50': '*',
            'palette-additional/orange/orange-5': '*',
            'palette-additional/orange/orange-10': '*',
            'palette-additional/orange/orange-20': '*',
            'palette-additional/orange/orange-50': '*',
            'palette-additional/purple/purple-5': '*',
            'palette-additional/purple/purple-10': '*',
            'palette-additional/purple/purple-20': '*',
            'palette-additional/purple/purple-50': '*',
            'palette-additional/yellow/yellow-5': '*',
            'palette-additional/yellow/yellow-10': '*',
            'palette-additional/yellow/yellow-20': '*',
            'palette-additional/yellow/yellow-50': '*',
        },
    },
    'palette/': {
        enabled: true,
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
            'palette/white': '*',
        },
    },
});

/**
 * Removes whitelist/blacklist so that all tokens which match the patterns are included.
 * NOTE:
 *      The whitelist/blacklist attrs is a temporary way to exclude certain Figma tokens from the list of supported tokens.
 *      In the future, designers will use next approach to exclude tokens from certain themes:
 *          - If token value refers to a "<specific variable name>"
 *            (resolvedValuesByMode[<id>].aliasName === "<specific variable name>")
 *          - If token value alias chain (aka valuesByMode) contains a "<specific variable name>" in the chain
 *            (i.e. refers var with name === "<specific variable name>").
 *          - The "<specific variable name>" can be e.g. "nonexistent_variable/nonexistent_variable".
 *            The value of this variable must be ignored.
 * NOTE:
 *      - If certain variables cannot be marked with "<specific variable name>",
 *        but need to be excluded from list of public variables,
 *        then it should be OK to use "blacklist" attribute (unless we find better solution)
 *
 * @param originalCfg
 */
function clearLists(originalCfg: IFigmaVarsConfig): IFigmaVarsConfig {
    return Object.keys(originalCfg).reduce<IFigmaVarsConfig>((acc, key) => {
        const orig = originalCfg[key];
        if (orig.enabled) {
            if (USE_TEMP_BL_AND_WL) {
                acc[key] = orig;
            } else {
                const { whitelist, blacklist, ...rest } = orig;
                acc[key] = rest;
            }
        }
        return acc;
    }, {});
}
