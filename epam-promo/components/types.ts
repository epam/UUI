/**
 * Defines a control shape.
 */
export type ControlShape = 'square' | 'round';
export const allBorderStyles: ControlShape[] = ['square', 'round'];

/**
 * Defines component fill style.
 */
export type FillStyle = 'solid' | 'white' | 'light' | 'none';
export const allFillStyles: FillStyle[] = [
    'solid', 'white', 'light', 'none',
];

/**
 * Defines the size of a control.
 */
export type ControlSize = 'none' | '24' | '30' | '36' | '42' | '48';
export const allSizes: ControlSize[] = [
    '24', '30', '36', '42', '48',
];

/**
 * Defines a text size.
 */
export type TextSize = 'none' | '18' | '24' | '30' | '36' | '48';
export const allTextSizes: TextSize[] = [
    '18', '24', '30', '36', '48',
];

/**
 * Defines the size of a row.
 */
export type RowSize = null | '24' | '30' | '36' | '42' | '48';
export const allRowSizes: RowSize[] = [
    null, '24', '30', '36', '42', '48',
];

/**
 * Defines the primary colors.
 */
export type EpamPrimaryColor = 'blue' | 'green' | 'amber' | 'red';
export const allEpamPrimaryColors: EpamPrimaryColor[] = [
    'blue', 'green', 'amber', 'red',
];

/**
 * Defines an additional colors.
 */
export type EpamAdditionalColor = EpamPrimaryColor | 'cyan' | 'orange' | 'purple' | 'violet';
export const allEpamAdditionalColors: EpamAdditionalColor[] = [
    ...allEpamPrimaryColors, 'cyan', 'orange', 'purple', 'violet',
];

/**
 * Defines a grayscale colors.
 */
export type EpamGrayscaleColor = 'white' | 'gray5' | 'gray10' | 'gray20' | 'gray30' | 'gray40' | 'gray50' | 'gray60' | 'gray70' | 'gray80' | 'gray90';
export const allEpamGrayscaleColors: EpamGrayscaleColor[] = [
    'white', 'gray5', 'gray10', 'gray20', 'gray30', 'gray40', 'gray50', 'gray60', 'gray70', 'gray80', 'gray90',
];

/**
 * Defines all type of colors: primary & grayscale & additional.
 */
export type EpamColor = EpamPrimaryColor | EpamGrayscaleColor | EpamAdditionalColor;
export const commonControlColors: EpamColor[] = [
    'blue', 'green', 'white',
];

/**
 * Defines a font style.
 */
export type FontStyle = 'sans' | 'sans-semibold' | 'sans-italic' | 'museo-sans' | 'museo-slab';
export const allFontStyles: FontStyle[] = [
    'sans', 'sans-semibold', 'sans-italic', 'museo-sans', 'museo-slab',
];

// Mod interfaces
export interface ColorMod {
    /** Component's base color */
    color?: EpamColor;
}

export interface SizeMod {
    /** Component's size in px. This is 'logical' size, defined in how many pixels components occupies vertically. */
    size?: ControlSize;
}

export interface FontMod {
    /** Font to use for text */
    font?: FontStyle;
}

export interface RowSizeMod {
    /**
     *  Defines the size of a row.
     *  @default '36'
     */
    size?: RowSize;
}

export enum EditMode {
    FORM = 'form',
    CELL = 'cell'
}
