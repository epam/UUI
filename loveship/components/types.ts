export type ControlShape = 'square' | 'round';
export const allBorderStyles: ControlShape[] = ['square', 'round'];

export type FillStyle = 'solid' | 'white' | 'light' | 'none';
export const allFillStyles: FillStyle[] = [
    'solid',
    'white',
    'light',
    'none',
];

export type ControlSize = 'none' | '24' | '30' | '36' | '42' | '48';
export const allSizes: ControlSize[] = [
    '24',
    '30',
    '36',
    '42',
    '48',
];

export type TextSize = 'none' | '18' | '24' | '30' | '36' | '42' | '48';
export const allTextSizes: TextSize[] = [
    '18',
    '24',
    '30',
    '36',
    '42',
    '48',
];

export type RowSize = '24' | '30' | '36' | '42' | '48';
export const allRowSizes: RowSize[] = [
    '24',
    '30',
    '36',
    '42',
    '48',
];

export type EpamPrimaryColor = 'sky' | 'grass' | 'sun' | 'fire';
export const allEpamPrimaryColors: EpamPrimaryColor[] = [
    'sky',
    'grass',
    'sun',
    'fire',
];

export type EpamAdditionalColor = 'cobalt' | 'lavanda' | 'fuchsia';
export const allEpamAdditionalColors: EpamAdditionalColor[] = [
    'cobalt',
    'lavanda',
    'fuchsia',
];

export type EpamGrayscaleColor = 'white' | 'night50' | 'night100' | 'night200' | 'night300' | 'night400' | 'night500' | 'night600' | 'night700' | 'night800' | 'night900';
export const allEpamGrayscaleColors: EpamGrayscaleColor[] = [
    'white',
    'night50',
    'night100',
    'night200',
    'night300',
    'night400',
    'night500',
    'night600',
    'night700',
    'night800',
    'night900',
];

export type EpamColor = EpamPrimaryColor | EpamAdditionalColor | EpamGrayscaleColor;
export const commonControlColors: EpamColor[] = [
    ...allEpamPrimaryColors,
    ...allEpamAdditionalColors,
    'white',
    'night200',
    'night300',
    'night400',
    'night500',
    'night600',
];

export type FontStyle = 'sans' | 'sans-semibold' | 'sans-light';
export const allFontStyles: FontStyle[] = [
    'sans',
    'sans-semibold',
    'sans-light',
];

// Mod interfaces
export interface ColorMod {
    /** Component color */
    color?: EpamColor;
}

export interface SizeMod {
    size?: ControlSize;
}

export interface FontMod {
    font?: FontStyle;
}

export interface RowSizeMod {
    size?: RowSize;
}

export interface EditMode {
    // mode?: 'form' | 'inline' | 'cell' | 'none';
    mode?: 'form' | 'cell';
}
