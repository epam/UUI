import { TFigmaThemeName, TFloatValue, TVarType } from './sharedTypes';

export interface IFigmaVarCollection {
    id: string
    name: string
    modes: Record<string, TFigmaThemeName>
    variableIds: string[]
    variables: IFigmaVar[]
}
export type IFigmaVar = IFigmaVarTemplate<TVarType.COLOR, TRgbaValue> | IFigmaVarTemplate<TVarType.FLOAT, TFloatValue>;

export type TRgbaValue = { r: number, g: number, b: number, a: number };

///

type TVarScope = string | 'ALL_SCOPES' | 'STROKE_COLOR' | 'ALL_FILLS';

interface IFigmaVarTemplate<TType, TValue> {
    id: string
    /**
     * It's actually a path (it looks like: "core/semantic/critical-70").
     * Use it to generate the CSS var.
     */
    name: string
    description: string
    type: TType
    valuesByMode: {
        [themeId: string]: { type: 'VARIABLE_ALIAS', id: string } | TValue
    }
    resolvedValuesByMode: {
        [themeId: string]: { resolvedValue: TValue, alias: null } | { resolvedValue: TValue, alias: string, aliasName: string }
    }
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
}
