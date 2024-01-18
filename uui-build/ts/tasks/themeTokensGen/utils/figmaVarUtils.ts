import { IFigmaVarRawNorm, IFigmaVarTemplateNormResolvedValue } from '../types/sourceTypes';
import { IThemeVar, TCssVarRef, TFigmaThemeName, TResolvedValueNorm, TUuiCssVarName } from '../types/sharedTypes';
import { FIGMA_VARS_CFG, IFigmaVarConfigValue, TList } from '../config';
import { UNDEFINED_ALIASES } from '../constants';

export function convertRawToken(
    params: {
        rawTokenNorm: IFigmaVarRawNorm,
        modes: Record<string, TFigmaThemeName>,
        figmaVarByNameNorm: Record<string, IFigmaVarRawNorm | undefined>,
    },
): IThemeVar {
    const { rawTokenNorm, modes, figmaVarByNameNorm } = params;
    const cssVar = getCssVarFromFigmaVar(rawTokenNorm.name) as TUuiCssVarName;

    return {
        id: rawTokenNorm.name,
        type: rawTokenNorm.type,
        description: rawTokenNorm.description,
        useCases: '',
        cssVar,
        published: !rawTokenNorm.hiddenFromPublishing,
        valueByTheme: Object.keys(modes).reduce<IThemeVar['valueByTheme']>((acc, themeId) => {
            const themeName = modes[themeId];
            const valueForTheme = rawTokenNorm.valueByTheme[themeId];
            const supported = isFigmaTokenSupported({ rawTokenNorm, theme: themeName, modes });
            if (valueForTheme && supported) {
                acc[themeName] = {
                    valueChain: mapValue({
                        value: valueForTheme.valueChain as IFigmaVarTemplateNormResolvedValue,
                        figmaVarByNameNorm,
                        modes,
                        themeName,
                    }),
                    valueDirect: mapValue({
                        value: valueForTheme.valueDirect as IFigmaVarTemplateNormResolvedValue,
                        figmaVarByNameNorm,
                        modes,
                        themeName,
                    }),
                };
            }
            return acc;
        }, {}),
    };
}

function mapValue(
    params: {
        value: IFigmaVarTemplateNormResolvedValue,
        figmaVarByNameNorm: Record<string, IFigmaVarRawNorm | undefined>,
        themeName: TFigmaThemeName,
        modes: Record<string, TFigmaThemeName>,
    },
): TResolvedValueNorm {
    const { value, figmaVarByNameNorm, themeName, modes } = params;
    const alias = value.alias.map(({ name }): TCssVarRef => {
        const rawTokenNormLocal = figmaVarByNameNorm[name] as IFigmaVarRawNorm;
        const supportedLocal = isFigmaTokenSupported({ rawTokenNorm: rawTokenNormLocal, theme: themeName, modes });
        if (supportedLocal) {
            return {
                id: name,
                cssVar: getCssVarFromFigmaVar(name),
                supported: true,
                published: !rawTokenNormLocal.hiddenFromPublishing,
            };
        }
        return {
            id: name,
            supported: false,
        };
    });
    return {
        alias,
        value: value.value,
    };
}

export function getCssVarFromFigmaVar(path: string): TUuiCssVarName | undefined {
    const config = getFigmaVarConfig(path);
    if (config) {
        return config.pathToCssVar(path);
    }
}

/**
 * If "theme" is passed then it checks against this theme only.
 * Otherwise - it checks that it's supported in at least 1 theme.
 * @param params
 */
export function isFigmaTokenSupported(params: { rawTokenNorm: IFigmaVarRawNorm, theme?: TFigmaThemeName, modes: Record<string, TFigmaThemeName> }) {
    const { rawTokenNorm, theme, modes } = params;
    const path = rawTokenNorm.name;
    const config = getFigmaVarConfig(path);
    if (config) {
        const { blacklist, whitelist } = config;
        return isTokenSupportedByList({ list: whitelist, isWhitelist: true, path, theme })
            && isTokenSupportedByList({ list: blacklist, isWhitelist: false, path, theme })
            && !isTokenExcludedByAliasRef({ rawTokenNorm, theme, modes });
    }
    return false;
}

function isTokenExcludedByAliasRef(params: { rawTokenNorm: IFigmaVarRawNorm, theme?: TFigmaThemeName, modes: Record<string, TFigmaThemeName> }): boolean {
    const { rawTokenNorm, theme, modes } = params;
    const themeId = Object.keys(modes).find((key) => modes[key] === theme);
    if (themeId) {
        const forTheTheme = rawTokenNorm.valueByTheme[themeId];
        if (forTheTheme) {
            return isAliasChainContainsExcludedRef(forTheTheme.valueChain?.alias)
                || isAliasChainContainsExcludedRef(forTheTheme.valueDirect?.alias);
        }
        return true;
    }
    return Object.values(TFigmaThemeName).every((themeItem) => {
        return isTokenExcludedByAliasRef({ rawTokenNorm, theme: themeItem, modes });
    });
}

function isAliasChainContainsExcludedRef(chain: { name: string }[] | undefined) {
    if (chain) {
        return chain.findIndex((chainItem) => {
            return Object.values(UNDEFINED_ALIASES).some((undefinedAliasName) => undefinedAliasName === chainItem.name);
        }) !== -1;
    }
    return false;
}

function isTokenSupportedByList(params: { path: string, list?: TList, isWhitelist: boolean, theme?: TFigmaThemeName }): boolean {
    const { list, isWhitelist, path, theme } = params;
    let isAllowed: boolean = true;
    if (list) {
        const wlItem = list[path];
        if (wlItem) {
            if (wlItem === '*') {
                isAllowed = isWhitelist;
            } else {
                if (theme) {
                    const idx = wlItem.indexOf(theme);
                    isAllowed = isWhitelist ? idx !== -1 : idx === -1;
                } else {
                    isAllowed = Object.values(TFigmaThemeName).some((themeItem) => {
                        const idx = wlItem.indexOf(themeItem);
                        return isWhitelist ? idx !== -1 : idx === -1;
                    });
                }
            }
        } else {
            isAllowed = !isWhitelist;
        }
    }
    return isAllowed;
}

function getFigmaVarConfig(path: string): IFigmaVarConfigValue | undefined {
    const key = path.split('/')[0] + '/';
    return FIGMA_VARS_CFG[key];
}
