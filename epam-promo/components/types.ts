export type ControlShape = 'square' | 'round';
export const allBorderStyles: ControlShape[] = ['square', 'round'];

export type FillStyle = 'solid' | 'white' | 'light' | 'none';
export const allFillStyles: FillStyle[] = [
    'solid', 'white', 'light', 'none',
];

export type ControlSize = 'none' | '24' | '30' | '36' | '42' | '48';
export const allSizes: ControlSize[] = [
    '24', '30', '36', '42', '48',
];

export type TextSize = 'none' | '18' | '24' | '30' | '36' | '48';
export const allTextSizes: TextSize[] = [
    '18', '24', '30', '36', '48',
];

export type RowSize = null | '24' | '30' | '36' | '42' | '48';
export const allRowSizes: RowSize[] = [
    null, '24', '30', '36', '42', '48',
];

export type EpamPrimaryColor = 'blue' | 'green' | 'amber' | 'red';
export const allEpamPrimaryColors: EpamPrimaryColor[] = [
    'blue', 'green', 'amber', 'red',
];

export type EpamAdditionalColor = EpamPrimaryColor | 'yellow'| 'orange' | 'fuchsia' | 'purple' | 'lavanda' | 'cobalt';
export const allEpamAdditionalColors: EpamAdditionalColor[] = [
    ...allEpamPrimaryColors, 'yellow', 'orange', 'fuchsia', 'purple', 'lavanda', 'cobalt',
];

export type EpamGrayscaleColor = 'white' | 'gray5' | 'gray10' | 'gray20' | 'gray30' | 'gray40' | 'gray50' | 'gray60' | 'gray70' | 'gray80' | 'gray90';
export const allEpamGrayscaleColors: EpamGrayscaleColor[] = [
    'white', 'gray5', 'gray10', 'gray20', 'gray30', 'gray40', 'gray50', 'gray60', 'gray70', 'gray80', 'gray90',
];

export type EpamColor = EpamPrimaryColor | EpamGrayscaleColor | EpamAdditionalColor;
export const commonControlColors: EpamColor[] = [
    'blue', 'green', 'white',
];

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
    size?: RowSize;
}

export interface IHasEditMode {
    /** Defines input mode: 'form' is default and usual look, 'cell' is for using components as table cells  */
    mode?: 'form' | 'cell';
}

export enum EditMode {
    FORM = 'form',
    CELL = 'cell'
}
