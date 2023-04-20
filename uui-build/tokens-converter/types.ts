export type TokenType =
    | 'color'
    | 'borderRadius'
    | 'sizing'
    | 'spacing'
    | 'typography'
    | 'opacity'
    | 'borderWidth'
    | 'boxShadow'
    | 'fontFamilies'
    | 'fontWeights'
    | 'lineHeights'
    | 'fontSizes'
    | 'letterSpacing'
    | 'paragraphSpacing'
    | 'textDecoration'
    | 'textCase';

type ShadowType = 'dropShadow' | 'innerShadow';

export interface ShadowToken {
    color: string;
    type: ShadowType;
    x: string | number;
    y: string | number;
    blur: string | number;
    spread: string | number;
    blendMode?: string;
}

export interface TypographyObject {
    fontFamily?: string;
    fontWeight?: string;
    fontSize?: string;
    lineHeight?: string | number;
    letterSpacing?: string;
    paragraphSpacing?: string;
    textCase?: string;
    textDecoration?: string;
}

export interface TokenObject {
    value?: string | TypographyObject | ShadowToken[] | ShadowToken | number;
    type: TokenType | string | 'undefined';
    description?: string;
}

export interface PaletteToken {
    [key: string]: TokenObject | PaletteToken;
}

export interface CoreTokens {
    [key: string]: TokenObject;
}

export interface ComponentClass {
    [key: string]: TokenObject;
}

export interface UuiComponent {
    [key: string]: ComponentClass;
}

export interface UuiComponentsTokens {
    [key: string]: UuiComponent;
}

export interface BaseTokens {
    palette: PaletteToken;
    core: CoreTokens;
}

export interface TokensObject {
    /**
     * Palette tokens
     */
    palette: PaletteToken;
    /**
     * UUI core tokens
     */
    core: CoreTokens;
    /**
     * UUI component tokens
     */
    [key: string]: UuiComponent | PaletteToken | CoreTokens; // TODO: investigate how to leave only UuiComponent type
}

export interface ThemesObject {
    /**
     * Default UUI theme
     */
    default: TokensObject;
    /**
     * Themes which overwrites fields of default theme
     */
    [key: string]: Partial<TokensObject>;
}
