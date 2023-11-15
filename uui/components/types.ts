export type ButtonFill = 'solid' | 'outline' | 'ghost' | 'none';
export const allButtonFills: ButtonFill[] = [
    'solid', 'outline', 'ghost', 'none',
];

export type FillStyle = ButtonFill;
export const allFillStyles: FillStyle[] = allButtonFills;

export type ControlSize = 'none' | '24' | '30' | '36' | '42' | '48';
export const allSizes: ControlSize[] = [
    '24', '30', '36', '42', '48',
];

export type RowSize = null | '24' | '30' | '36' | '42' | '48';
export const allRowSizes: RowSize[] = [
    null, '24', '30', '36', '42', '48',
];

export type SemanticColor = 'info' | 'success' | 'warning' | 'error';
export const allSemanticColors: SemanticColor[] = [
    'info', 'success', 'warning', 'error',
];

export type EpamBadgeSemanticColor = 'info' | 'success' | 'warning' | 'critical' | 'neutral';
export const allEpamBadgeSemanticColors: EpamBadgeSemanticColor[] = [
    'info', 'success', 'warning', 'critical', 'neutral',
];

export type TextSize = 'none' | '18' | '24' | '30' | '36' | '48';
export const allTextSizes: TextSize[] = [
    '18', '24', '30', '36', '48',
];

export type FontStyle = 'regular' | 'semibold' | 'italic' | 'primary' | 'promo';
export const allFontStyles: FontStyle[] = [
    'regular', 'semibold', 'italic', 'primary', 'promo',
];

export interface ColorMod {
    // TODO remove
    /** Component color */
    color?: SemanticColor;
}

export interface RowSizeMod {
    size?: RowSize;
}

export interface SizeMod {
    size?: ControlSize;
}

/** Component can adjust visuals for different contexts: forms, tables cells, on in WYSIWYG UX */
export interface IHasEditMode {
    /**
     * Visual mode for component:
     * - form: default visuals, to use in forms.
     * - cell: adjust to embed as table cell editor: no borders, no focus (it is applied by DataCell)
     * - inline: adjust for WYSIWYG UX. Backgrounds removed. Borders appear only on hover.
     */
    mode?: 'form' | 'cell' | 'inline';
}

export enum EditMode {
    FORM = 'form',
    CELL = 'cell',
    INLINE = 'inline'
}
