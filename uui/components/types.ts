/**
 * This type defines the size of a control.
 */
export type ControlSize = 'none' | '24' | '30' | '36' | '42' | '48';

export interface SizeMod {
    /**
     * Represents the size of a control.
     */
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

/**
 * Represents the different edit modes available for editing data.
 */
export enum EditMode {
    FORM = 'form',
    CELL = 'cell',
    INLINE = 'inline'
}
