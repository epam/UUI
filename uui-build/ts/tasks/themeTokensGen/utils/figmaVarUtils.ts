import { IFigmaVarRawNorm, IFigmaVarTemplateNormResolvedValue } from '../types/sourceTypes';
import {
    IThemeVar,
    TCssVarRef,
    TCssVarSupport,
    TFigmaThemeName,
    TResolvedValueNorm,
    TUuiCssVarName,
} from '../types/sharedTypes';
import { FIGMA_VARS_CFG, IFigmaVarConfigValue } from '../config';
import { UNDEFINED_ALIASES } from '../constants';

export function convertRawToken(
    params: {
        rawTokenNorm: IFigmaVarRawNorm,
        modes: Record<string, TFigmaThemeName>,
        figmaVarByNameNorm: Record<string, IFigmaVarRawNorm | undefined>,
    },
): IThemeVar {
    const { rawTokenNorm, modes, figmaVarByNameNorm } = params;
    const cssVarSupport = getCssVarSupportForToken(rawTokenNorm);
    const cssVar = getCssVarFromFigmaVar(rawTokenNorm);
    return {
        id: rawTokenNorm.name,
        type: rawTokenNorm.type,
        description: rawTokenNorm.description,
        useCases: '',
        cssVar,
        cssVarSupport,
        valueByTheme: Object.keys(modes).reduce<IThemeVar['valueByTheme']>((acc, themeId) => {
            const themeName = modes[themeId];
            const valueForTheme = rawTokenNorm.valueByTheme[themeId];
            const canPotentiallyDefineCssVar = canTokenPotentiallyDefineCssVar({ rawTokenNorm, theme: themeName, modes });
            if (canPotentiallyDefineCssVar && valueForTheme) {
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
    const { value, figmaVarByNameNorm } = params;
    const alias = value.alias.map(({ name }): TCssVarRef => {
        const rawTokenNormLocal = figmaVarByNameNorm[name] as IFigmaVarRawNorm;
        const cssVarSupport = getCssVarSupportForToken(rawTokenNormLocal);
        const cssVar = getCssVarFromFigmaVar(rawTokenNormLocal);
        return {
            id: name,
            cssVar,
            cssVarSupport,
        };
    });
    return {
        alias,
        value: value.value,
    };
}

export function getCssVarSupportForToken(token: IFigmaVarRawNorm): TCssVarSupport {
    if (token.hiddenFromPublishing) {
        const cfg = getFigmaVarConfig(token.name);
        return cfg ? cfg.cssVarSupportForUnpublished : 'notSupported';
    } else {
        return 'supported';
    }
}

export function getCssVarFromFigmaVar(token: IFigmaVarRawNorm): TUuiCssVarName | undefined {
    const cssVarSupport = getCssVarSupportForToken(token);
    if (cssVarSupport !== 'notSupported') {
        const config = getFigmaVarConfig(token.name);
        if (config) {
            return config.pathToCssVar(token.name);
        }
    }
}

/**
 * It checks that token is allowed to (potentially) define some "CSS variable"
 * @param params
 */
export function canTokenPotentiallyDefineCssVar(params: { rawTokenNorm: IFigmaVarRawNorm, modes: Record<string, TFigmaThemeName>, theme?: TFigmaThemeName }) {
    const { rawTokenNorm, modes, theme } = params;
    const path = rawTokenNorm.name;
    const config = getFigmaVarConfig(path);
    if (config) {
        return !isTokenExcludedByAliasRef({ rawTokenNorm, modes, theme });
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
    return Object.values(modes).every((themeItem) => {
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

function getFigmaVarConfig(path: string): IFigmaVarConfigValue | undefined {
    const key = path.split('/')[0] + '/';
    return FIGMA_VARS_CFG[key];
}
