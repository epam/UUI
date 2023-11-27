type TVarModes = Record<string, 'Loveship-Light' | 'Loveship-Dark' | 'Promo' | 'EPAM'>;
type TVarScope = string | 'ALL_SCOPES';
type TVarType = string | 'COLOR';
type TVarValueType = string | 'VARIABLE_ALIAS';
export interface IFigmaVar {
    id: string
    name: string
    description: string
    type: TVarType
    valuesByMode: {
        [modeId: string]: {
            type: TVarValueType
            id: string
        }
    }
    resolvedValuesByMode: {
        [modeId: string]: {
            resolvedValue: {
                r: number
                g: number
                b: number
                a: number
            }
            alias: string
            aliasName: string // use this to generate token (it looks like: "core/semantic/critical-70")
        }
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
export interface IFigmaVarCollection {
    id: string
    name: string
    modes: TVarModes
    variableIds: string[]
    variables: IFigmaVar[]
}

export type TUuiCssToken = `--uui-${string}`;
export interface ITokensConfig {
    sourceFigmaVarCollection: string
    resultsDir: string
    tokens: Record<TUuiCssToken, ICssTokenConfig>
}
export interface ICssTokenConfig {
    /**
     * This flag defines whether token is supported by UUI app or not.
     * There are cases when token is supported only in Figma, and it's not supported in UUI app.
     *
     * @default true
     */
    isSupportedByUUiApp?: boolean
}
