import {
    IFigmaVar, IFigmaVarCollection,
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

export function getNormalizedResolvedValueMap(params: { figmaVar: IFigmaVar, modes: IFigmaVarCollection['modes'] }): IThemeVar['value'] {
    const { figmaVar, modes } = params;
    const getFigmaThemeNameById = (id: string) => modes[id] as TFigmaThemeName;

    return Object.keys(figmaVar.resolvedValuesByMode).reduce<IThemeVar['value']>((acc, themeId) => {
        const themeName = getFigmaThemeNameById(themeId);
        acc[themeName] = getNormalizedResolvedValue({ figmaVar, themeId });
        return acc;
    }, {});
}

function getNormalizedResolvedValue(params: { figmaVar: IFigmaVar, themeId: string }): TResolvedValueNorm {
    const ref = getCssVarRefByThemeId(params);
    const value = getResolvedValueByThemeId(params);
    return ref ? { value, ref } : { value };
}

function getResolvedValueByThemeId(params: { figmaVar: IFigmaVar, themeId: string }): TResolvedValueNorm['value'] {
    const { themeId, figmaVar } = params;
    const item = figmaVar.resolvedValuesByMode[themeId];
    switch (figmaVar.type) {
        case TVarType.COLOR: {
            return rgbaToHEXA(item.resolvedValue as TRgbaValue);
        }
        case TVarType.FLOAT: {
            return item.resolvedValue as TFloatValue;
        }
    }
}

function getCssVarRefByThemeId(params: { figmaVar: IFigmaVar, themeId: string }): TCssVarRef | undefined {
    const { themeId, figmaVar } = params;
    const item = figmaVar.resolvedValuesByMode[themeId];

    if (item.alias) {
        const id = (item as { aliasName: string }).aliasName;
        const supported = isCssVarSupportedByUui(id);
        const cssVar = getCssVarFromFigmaVar(id);
        return {
            id,
            cssVar,
            supported,
        };
    }
}
