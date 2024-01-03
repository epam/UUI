import {
    IFigmaVar, IFigmaVarCollection, TFigmaVariableAlias,
    TRgbaValue,
} from '../types/sourceTypes';
import { rgbaToHEXA } from './colorUtils';
import {
    IThemeVar,
    TCssVarRef,
    TFigmaThemeName,
    TFloatValue,
    TResolvedValueNorm,
    TUuiCssVarName,
    TVarType,
} from '../types/sharedTypes';
import { FIGMA_VARS_CFG, IFigmaVarConfigValue } from '../config';

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
export function isFigmaVarSupported(params: { path: string, theme?: TFigmaThemeName }) {
    const { path, theme } = params;
    const config = getFigmaVarConfig(path);
    if (config) {
        const { blacklist, whitelist } = config;
        let isIncludedByWhiteList = true;
        if (whitelist) {
            const wlItem = whitelist[path];
            if (wlItem) {
                if (theme) {
                    isIncludedByWhiteList = wlItem.indexOf(theme) !== -1;
                } else {
                    isIncludedByWhiteList = Object.values(TFigmaThemeName).some((themeItem) => {
                        return wlItem.indexOf(themeItem) !== -1;
                    });
                }
            } else {
                isIncludedByWhiteList = false;
            }
        }
        let isIncludedByBlackList = true;
        if (blacklist) {
            const blItem = blacklist[path];
            if (blItem) {
                isIncludedByBlackList = Object.values(TFigmaThemeName).some((themeItem) => {
                    return blItem.indexOf(themeItem) === -1;
                });
            }
        }
        return isIncludedByWhiteList && isIncludedByBlackList;
    }
    return false;
}

export function getNormalizedResolvedValueMap(
    params: {
        figmaVar: IFigmaVar,
        modes: IFigmaVarCollection['modes'],
        figmaVarById: Record<string, IFigmaVar>
    },
): IThemeVar['valueByTheme'] {
    const { figmaVar, modes, figmaVarById } = params;
    const themeIdArr = Object.keys(modes);

    return themeIdArr.reduce<IThemeVar['valueByTheme']>((acc, themeId) => {
        const themeName = modes[themeId] as TFigmaThemeName;
        const supported = isFigmaVarSupported({ path: figmaVar.name, theme: themeName });
        if (supported) {
            const valueChain = getNormalizedResolvedValue({ figmaVar, themeId, theme: themeName, figmaVarById, mode: 'chain' });
            const valueDirect = getNormalizedResolvedValue({ figmaVar, themeId, theme: themeName, figmaVarById, mode: 'direct' });
            acc[themeName] = {
                valueChain,
                valueDirect,
            };
        }
        return acc;
    }, {});
}

function getNormalizedResolvedValue(
    params: {
        figmaVar: IFigmaVar,
        figmaVarById: Record<string, IFigmaVar>,
        themeId: string,
        theme: TFigmaThemeName,
        mode: 'chain' | 'direct'
    },
): TResolvedValueNorm {
    const { figmaVarById, mode, themeId, theme } = params;
    if (params.mode === 'direct') {
        const item = params.figmaVar.resolvedValuesByMode[params.themeId];
        const value = getNormalizedValue({ type: params.figmaVar.type, value: item.resolvedValue });
        const aliasPath = (item as { aliasName: string })?.aliasName;
        const alias = getNormalizedAlias({ path: aliasPath, theme });
        return {
            alias,
            value,
        };
    }
    if (params.mode === 'chain') {
        const item = params.figmaVar.valuesByMode[params.themeId];
        if ((item as TFigmaVariableAlias).type) {
            const { id } = item as TFigmaVariableAlias;
            const nextVar = params.figmaVarById[id];
            const nextVarAlias = getNormalizedAlias({ path: nextVar.name, theme });

            const { value, alias } = getNormalizedResolvedValue({ figmaVar: nextVar, figmaVarById, mode, themeId, theme });
            return {
                value,
                alias: nextVarAlias.concat(alias),
            };
        } else {
            return {
                alias: [],
                value: getNormalizedValue({ type: params.figmaVar.type, value: item }),
            };
        }
    }
    throw new Error('Unknown mode');
}

// aliasName is a path
function getNormalizedAlias(params: { path: string | undefined, theme: TFigmaThemeName }): TCssVarRef[] {
    const { path, theme } = params;
    if (path) {
        const supported = isFigmaVarSupported({ path, theme });
        if (supported) {
            const cssVar = getCssVarFromFigmaVar(path) as TUuiCssVarName;
            return [{
                id: path,
                cssVar,
                supported: true,
            }];
        } else {
            return [{
                id: path,
                supported: false,
            }];
        }
    }
    return [];
}

function getNormalizedValue(params: { type: TVarType, value: unknown }) {
    switch (params.type) {
        case TVarType.COLOR: {
            return rgbaToHEXA(params.value as TRgbaValue);
        }
        case TVarType.FLOAT: {
            return params.value as TFloatValue;
        }
    }
}

function getFigmaVarConfig(path: string): IFigmaVarConfigValue | undefined {
    const key = path.split('/')[0] + '/';
    return FIGMA_VARS_CFG[key];
}
