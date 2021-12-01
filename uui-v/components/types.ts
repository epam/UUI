export type FillStyle = 'solid' | 'white' | 'light' | 'none';
export const allFillStyles: FillStyle[] = ['solid', 'white', 'light', 'none'];

export type ControlSize = 'none' | '24' | '30' | '36' | '42' | '48';
export const allSizes: ControlSize[] = ['24', '30', '36', '42', '48'];

export type RowSize = null | '24' | '30' | '36' | '42' | '48';
export const allRowSizes: RowSize[] = [null, '24', '30', '36', '42', '48'];

export type EpamSemanticColor = 'accent' | 'primary' | 'secondary' | 'negative';
export const allEpamSemanticColors: EpamSemanticColor[] = ['accent', 'primary', 'secondary', 'negative'];

export interface ColorMod {
    color?: EpamSemanticColor;
}

export interface RowSizeMod {
    size?: RowSize;
}

export interface SizeMod {
    size?: ControlSize;
}

export interface IHasEditMode {
    mode?: 'form' | 'cell';
}

export enum EditMode {
    FORM = 'form',
    CELL = 'cell',
}