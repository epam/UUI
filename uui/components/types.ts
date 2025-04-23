/**
 * Defines the size of a control.
 */
export type ControlSize = '24' | '30' | '36' | '42' | '48';

export interface SizeMod {
    /**
     * Defines component size.
     * @default '36'
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
 * Defines the different edit modes.
 */
export enum EditMode {
    /** Defines edit mode for form */
    FORM = 'form',
    /** Defines edit mode for cell in tables */
    CELL = 'cell',
    /** Defines edit mode for inline elements */
    INLINE = 'inline'
}
