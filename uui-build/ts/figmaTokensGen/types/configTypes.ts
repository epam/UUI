import { TUuiCssVarName } from './sharedTypes';

export interface ITokensConfig {
    tokens: Record<TUuiCssVarName, ICssTokenConfig>
}
export interface ICssTokenConfig {
    /**
     * This flag defines whether token is supported by UUI app or not.
     * There are cases when token is supported only in Figma, and it's not supported in UUI app.
     *
     * @default true
     */
    supported?: boolean
}
