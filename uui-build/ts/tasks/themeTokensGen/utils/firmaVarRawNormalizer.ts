import {
    IFigmaVarRaw,
    IFigmaVarRawNorm, IFigmaVarTemplateNormResolvedValue,
    IFigmaVarTemplateNormValue,
    TFigmaVariableAlias,
    TRgbaValue,
} from '../types/sourceTypes';
import { TFigmaThemeName, TVarType } from '../types/sharedTypes';
import { rgbaToHEXA } from './colorUtils';

export function normalizeFigmaVarRawMap(
    params: {
        rawVarsById: Record<string, IFigmaVarRaw | undefined>,
        modes: Record<string, TFigmaThemeName>
    },
): Record<string, IFigmaVarRawNorm | undefined> {
    const { rawVarsById, modes } = params;
    return Object.keys(rawVarsById).reduce<Record<string, IFigmaVarRawNorm>>((acc, id) => {
        const figmaVar = rawVarsById[id] as IFigmaVarRaw;
        const { resolvedValuesByMode, valuesByMode, ...rest } = figmaVar;
        acc[figmaVar.name] = {
            ...rest,
            valueByTheme: Object.keys(modes).reduce<Record<string, IFigmaVarTemplateNormValue>>(
                (accNested, themeId) => {
                    const valueChain = getRawNormValue({ figmaVar, rawVarsById, themeId, mode: 'chain' });
                    const valueDirect = getRawNormValue({ figmaVar, rawVarsById, themeId, mode: 'direct' });
                    if (valueChain && valueDirect) {
                        accNested[themeId] = {
                            valueChain,
                            valueDirect,
                        };
                    } else {
                        // console.debug(`The variable ${figmaVar.name} refers to some non-existent variables. So, it's value cannot be found for themeId=${themeId}.`);
                    }
                    return accNested;
                },
                {},
            ),
        };
        return acc;
    }, {});
}

/**
 * NOTE: the entire chain will be discarded if it contains reference to non-existing variable id.
 * @param params
 */
function getRawNormValue(
    params: {
        figmaVar: IFigmaVarRaw,
        rawVarsById: Record<string, IFigmaVarRaw | undefined>,
        themeId: string,
        mode: 'chain' | 'direct'
    },
): IFigmaVarTemplateNormResolvedValue | undefined {
    const { rawVarsById, mode, themeId } = params;
    if (params.mode === 'direct') {
        const item = params.figmaVar.resolvedValuesByMode[params.themeId];
        const value = getNormalizedValue({ type: params.figmaVar.type, value: item.resolvedValue });

        const itemCast = item as { aliasName: string, alias: string };
        const aliasPath = itemCast?.aliasName;
        const alias = getNormalizedAlias({ name: aliasPath });
        return {
            alias,
            value,
        };
    }
    if (params.mode === 'chain') {
        const item = params.figmaVar.valuesByMode[params.themeId];
        if ((item as TFigmaVariableAlias).type) {
            const { id } = item as TFigmaVariableAlias;
            const nextVar = rawVarsById[id];
            if (nextVar) {
                const nextVarAlias = getNormalizedAlias({ name: nextVar.name });
                const nextResult = getRawNormValue({ figmaVar: nextVar, rawVarsById, mode, themeId });
                if (nextResult) {
                    return {
                        value: nextResult.value,
                        alias: nextVarAlias.concat(nextResult.alias),
                    };
                } else {
                    return undefined;
                }
            } else {
                // console.debug(`Unable to build alias chain (${params.figmaVar.name}). Reason: chain element references unknown variable: id: "${id}", type: "${type}"`);
                return undefined;
            }
        }
        return {
            alias: [],
            value: getNormalizedValue({ type: params.figmaVar.type, value: item }),
        };
    }
    throw new Error('Unknown mode');
}

function getNormalizedValue(params: { type: TVarType, value: unknown }) {
    switch (params.type) {
        case TVarType.COLOR: {
            return rgbaToHEXA(params.value as TRgbaValue);
        }
        case TVarType.FLOAT: {
            return params.value as number;
        }
    }
}

// aliasName is a path
function getNormalizedAlias(params: { name: string | undefined }): { name: string }[] {
    const { name } = params;
    if (name) {
        return [{
            name,
        }];
    }
    return [];
}
