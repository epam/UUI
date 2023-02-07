export type ButtonMode = 'solid' | 'outline' | 'ghost' | 'none';
export const allButtonModes: ButtonMode[] = ['solid', 'outline', 'ghost', 'none'];

export type ControlSize = 'none' | '24' | '30' | '36' | '42' | '48';
export const allSizes: ControlSize[] = ['24', '30', '36', '42', '48'];

export type RowSize = null | '24' | '30' | '36' | '42' | '48';
export const allRowSizes: RowSize[] = [null, '24', '30', '36', '42', '48'];

export type EpamSemanticColor = 'accent' | 'primary' | 'secondary' | 'negative';
export const allEpamSemanticColors: EpamSemanticColor[] = ['accent', 'primary', 'secondary', 'negative'];

export type TextSize = 'none' | '18' | '24' | '30' | '36' | '48';
export const allTextSizes: TextSize[] = ['18', '24', '30', '36', '48'];

export type FontStyle = 'regular' | 'semibold' | 'italic' | 'primary' | 'promo';
export const allFontStyles: FontStyle[] = ['regular', 'semibold', 'italic', 'primary', 'promo'];

export interface ColorMod {
    /** Component color */
    color?: EpamSemanticColor;
}

export interface RowSizeMod {
    size?: RowSize;
}

export interface SizeMod {
    size?: ControlSize;
}

export interface IHasEditMode {
    mode?: 'form' | 'cell' | 'inline';
}

export enum EditMode {
    FORM = 'form',
    CELL = 'cell',
    INLINE = 'inline',
}
