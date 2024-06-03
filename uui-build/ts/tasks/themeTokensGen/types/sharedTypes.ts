/**
 * NOTE: Types in this file are shared with front-end and must be copied as-is.
 * From: uui-build/ts/tasks/themeTokensGen/types/sharedTypes.ts --> To: app/src/sandbox/tokens/palette/types/sharedTypes.ts
 *
 * Please make sure that this file has no dependencies to any other files.
 */
//

export type TFigmaThemeName = string;
export type TVariableValue = unknown;

export type TUuiCssVarName = `--${string}`;
export enum TVarType {
    COLOR = 'COLOR',
    FLOAT = 'FLOAT'
}

export type TCssVarSupport = 'supported' | 'notSupported' | 'notDecided' | 'supportedExceptFigma';

export type TCssVarRef = {
    id: IThemeVar['id'],
    cssVar: TUuiCssVarName | undefined;
    cssVarSupport: TCssVarSupport
};

export type TResolvedValueNorm = {
    /* it's always final resolved value, like HEX or etc. */
    value: TVariableValue,
    alias: TCssVarRef[],
};
export type TValueByThemeValue = {
    valueChain: TResolvedValueNorm | undefined,
    valueDirect: TResolvedValueNorm | undefined,
};

export interface IThemeVar {
    /** Figma path which can be used as a unique ID */
    id: string,
    type: TVarType,
    description: string,
    useCases: string,
    cssVar: TUuiCssVarName | undefined,
    cssVarSupport: TCssVarSupport,
    /** resolvedValue in this map is taken from Figma. It can be used to compare with actual rendered value in browser */
    valueByTheme: {
        [themeName in TFigmaThemeName]?: TValueByThemeValue
    },
}
export interface IUuiTokensCollection {
    modes: Record<string, TFigmaThemeName>;
    exposedTokens: IThemeVar[]
}
