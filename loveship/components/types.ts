/** Represents a control shape that can be used in an application. */
export type ControlShape = 'square' | 'round';
export const allBorderStyles: ControlShape[] = ['square', 'round'];

/** Represents the fill style of a shape. */
export type FillStyle = 'solid' | 'white' | 'light' | 'none';
export const allFillStyles: FillStyle[] = [
    'solid', 'white', 'light', 'none',
];

/**
 * Represents the control size options.
 */
export type ControlSize = 'none' | '24' | '30' | '36' | '42' | '48';
export const allSizes: ControlSize[] = [
    '24', '30', '36', '42', '48',
];

/**
 * Represents the size of a text.
 */
export type TextSize = 'none' | '18' | '24' | '30' | '36' | '42' | '48';
export const allTextSizes: TextSize[] = [
    '18', '24', '30', '36', '42', '48',
];

/**
 * Represents the size of a row in a grid layout.
 */
export type RowSize = '24' | '30' | '36' | '42' | '48';
export const allRowSizes: RowSize[] = [
    '24', '30', '36', '42', '48',
];

/**
 * Represents a primary color used in the loveship Epam design system.
 */
export type EpamPrimaryColor = 'sky' | 'grass' | 'sun' | 'fire';
export const allEpamPrimaryColors: EpamPrimaryColor[] = [
    'sky', 'grass', 'sun', 'fire',
];

/**
 * Represents an additional color used in the loveship Epam system.
 */
export type EpamAdditionalColor = 'cobalt' | 'violet' | 'fuchsia';
export const allEpamAdditionalColors: EpamAdditionalColor[] = [
    'cobalt', 'violet', 'fuchsia',
];

/**
 * Represents a grayscale color from the loveship Epam color palette.
 */
export type EpamGrayscaleColor = 'white' | 'night50' | 'night100' | 'night200' | 'night300' | 'night400' | 'night500' | 'night600' | 'night700' | 'night800' | 'night900';
export const allEpamGrayscaleColors: EpamGrayscaleColor[] = [
    'white', 'night50', 'night100', 'night200', 'night300', 'night400', 'night500', 'night600', 'night700', 'night800', 'night900',
];

/**
 * Represents a color value in the loveship Epam color palette.
 */
export type EpamColor = EpamPrimaryColor | EpamAdditionalColor | EpamGrayscaleColor;
export const commonControlColors: EpamColor[] = [
    ...allEpamPrimaryColors, ...allEpamAdditionalColors, 'white', 'night200', 'night300', 'night400', 'night500', 'night600',
];

/**
 * Represents the font styles available for text rendering.
 */
export type FontStyle = 'sans' | 'sans-semibold' | 'sans-light';
export const allFontStyles: FontStyle[] = [
    'sans', 'sans-semibold', 'sans-light',
];

/**
 * Represents the color modifiers of a component.
 */
export interface ColorMod {
    /**
     * Represents the color of a component.
     */
    color?: EpamColor;
}

/**
 * Represents a size modifier for a control.
 */
export interface SizeMod {
    size?: ControlSize;
}

/**
 * Represents a font customization for a text element.
 */
export interface FontMod {
    font?: FontStyle;
}

/**
 * Defines a row size modification object.
 */
export interface RowSizeMod {
    size?: RowSize;
}
