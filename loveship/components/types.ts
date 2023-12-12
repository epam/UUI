/** Defines a control shape. */
export type ControlShape = 'square' | 'round';
export const allBorderStyles: ControlShape[] = ['square', 'round'];

/** Defines component fill style. */
export type FillStyle = 'solid' | 'white' | 'light' | 'none';
export const allFillStyles: FillStyle[] = [
    'solid', 'white', 'light', 'none',
];

/**
 * Defines the control size.
 */
export type ControlSize = 'none' | '24' | '30' | '36' | '42' | '48';
export const allSizes: ControlSize[] = [
    '24', '30', '36', '42', '48',
];

/**
 * Defines the size of a text.
 */
export type TextSize = 'none' | '18' | '24' | '30' | '36' | '42' | '48';
export const allTextSizes: TextSize[] = [
    '18', '24', '30', '36', '42', '48',
];

/**
 * Defines the size of a row.
 */
export type RowSize = '24' | '30' | '36' | '42' | '48';
export const allRowSizes: RowSize[] = [
    '24', '30', '36', '42', '48',
];

/**
 * Defines a primary colors.
 */
export type EpamPrimaryColor = 'sky' | 'grass' | 'sun' | 'fire';
export const allEpamPrimaryColors: EpamPrimaryColor[] = [
    'sky', 'grass', 'sun', 'fire',
];

/**
 * Defines an additional colors.
 */
export type EpamAdditionalColor = 'cobalt' | 'violet' | 'fuchsia';
export const allEpamAdditionalColors: EpamAdditionalColor[] = [
    'cobalt', 'violet', 'fuchsia',
];

/**
 * Defines a grayscale colors.
 */
export type EpamGrayscaleColor = 'white' | 'night50' | 'night100' | 'night200' | 'night300' | 'night400' | 'night500' | 'night600' | 'night700' | 'night800' | 'night900';
export const allEpamGrayscaleColors: EpamGrayscaleColor[] = [
    'white', 'night50', 'night100', 'night200', 'night300', 'night400', 'night500', 'night600', 'night700', 'night800', 'night900',
];

/**
 * Defines all types of colors: primary & additional & grayscale.
 */
export type EpamColor = EpamPrimaryColor | EpamAdditionalColor | EpamGrayscaleColor;
export const commonControlColors: EpamColor[] = [
    ...allEpamPrimaryColors, ...allEpamAdditionalColors, 'white', 'night200', 'night300', 'night400', 'night500', 'night600',
];

/**
 * Defines the font styles.
 */
export type FontStyle = 'sans' | 'sans-semibold' | 'sans-light';
export const allFontStyles: FontStyle[] = [
    'sans', 'sans-semibold', 'sans-light',
];

/**
 * Defines the color modifiers of a component.
 */
export interface ColorMod {
    /**
     * Defines component color.
     */
    color?: EpamColor;
}

/**
 * Represents a size modifier.
 */
export interface SizeMod {
    /** Defines component size. */
    size?: ControlSize;
}

/**
 * Represents a font customization for a text element.
 */
export interface FontMod {
    /** Defines component font. */
    font?: FontStyle;
}

/**
 * Defines component row size modifier.
 */
export interface RowSizeMod {
    /** Defines component row size. */
    size?: RowSize;
}
