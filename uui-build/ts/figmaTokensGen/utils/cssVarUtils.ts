import {
    IFigmaVar, IFigmaVarCollection, TFigmaVariableAlias,
    TRgbaValue,
} from '../types/sourceTypes';
import { CONFIG } from '../config';
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

export function getCssVarFromFigmaVar(figmaVarPath: string): TUuiCssVarName {
    const tokens = figmaVarPath.split('/');
    const lastToken = tokens[tokens.length - 1];
    return `--uui-${lastToken}`;
}

export function isCssVarSupportedByUui(figmaVarPath: string) {
    const isIgnoredByConvention = figmaVarPath.indexOf('core/') !== 0;
    const cssVarName = getCssVarFromFigmaVar(figmaVarPath);
    const isIgnoredByConfig = CONFIG.tokens[cssVarName]?.supported === false;
    return !isIgnoredByConvention && !isIgnoredByConfig;
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
        const valueChain = getNormalizedResolvedValue({ figmaVar, themeId, figmaVarById, mode: 'chain' });
        const valueDirect = getNormalizedResolvedValue({ figmaVar, themeId, figmaVarById, mode: 'direct' });

        acc[themeName] = {
            valueChain,
            valueDirect,
        };
        return acc;
    }, {});
}

function getNormalizedResolvedValue(
    params: {
        figmaVar: IFigmaVar,
        figmaVarById: Record<string, IFigmaVar>,
        themeId: string,
        mode: 'chain' | 'direct'
    },
): TResolvedValueNorm {
    const { figmaVarById, mode, themeId } = params;
    if (params.mode === 'direct') {
        const item = params.figmaVar.resolvedValuesByMode[params.themeId];
        const value = getNormalizedValue({ type: params.figmaVar.type, value: item.resolvedValue });
        const alias = getNormalizedAlias((item as { aliasName: string })?.aliasName);
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
            const nextVarAlias = getNormalizedAlias(nextVar.name);

            const { value, alias } = getNormalizedResolvedValue({ figmaVar: nextVar, figmaVarById, mode, themeId });
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
function getNormalizedAlias(aliasName: string | undefined): TCssVarRef[] {
    if (aliasName) {
        const supported = isCssVarSupportedByUui(aliasName);
        const cssVar = getCssVarFromFigmaVar(aliasName);
        return [{
            id: aliasName,
            cssVar,
            supported,
        }];
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
