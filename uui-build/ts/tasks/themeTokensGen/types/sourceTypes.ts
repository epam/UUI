import { TFigmaThemeName, TVariableValue, TVarType } from './sharedTypes';

export interface IFigmaVarCollection {
    id: string
    name: string
    modes: Record<string, TFigmaThemeName>
    variableIds: string[]
    variables: IFigmaVarRaw[]
}

export type TRgbaValue = { r: number, g: number, b: number, a: number };

export type TFigmaVariableAlias = { type: 'VARIABLE_ALIAS', id: string };

export type IFigmaVarRawNorm = IFigmaVarTemplateBase & {
    valueByTheme: {
        [themeId: string]: IFigmaVarTemplateNormValue
    }
};

export type IFigmaVarRaw = IFigmaVarTemplateBase & {
    valuesByMode: {
        [themeId: string]: TFigmaVariableAlias | TVariableValue
    }
    resolvedValuesByMode: {
        [themeId: string]: { resolvedValue: TVariableValue, alias: null } | { resolvedValue: TVariableValue, alias: string, aliasName: string }
    }
};

type IFigmaVarTemplateBase = {
    id: string
    /**
     * It's actually a path (it looks like: "core/semantic/critical-70").
     * Use it to generate the CSS var.
     */
    name: string
    description: string
    type: TVarType

    scopes: TVarScope[]
    hiddenFromPublishing: boolean
    codeSyntax: {
        /**
         * take "aliasName" (see above) and convert it to: var(--uui-${name}).
         * E.g.:
         * "core/semantic/critical-70" --> "var(--uui-critical-70)"
         */
        WEB?: string
    }
};

export type IFigmaVarTemplateNormResolvedValue = {
    value: TVariableValue
    alias: { name: string }[],
};

export type IFigmaVarTemplateNormValue = {
    valueChain: IFigmaVarTemplateNormResolvedValue | undefined,
    valueDirect: IFigmaVarTemplateNormResolvedValue | undefined,
};

type TVarScope = string | 'ALL_SCOPES' | 'STROKE_COLOR' | 'ALL_FILLS';
