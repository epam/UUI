/** Defines a control shape. */
export type ControlShape = 'square' | 'round';

/**
 * Defines the control size.
 */
export type ControlSize = 'none' | '24' | '30' | '36' | '42' | '48';

/**
 * Defines a primary colors.
 */
export type EpamPrimaryColor = 'sky' | 'grass' | 'sun' | 'fire';

/**
 * Defines an additional colors.
 */
export type EpamAdditionalColor = 'cobalt' | 'violet' | 'fuchsia';

/**
 * Represents a size modifier.
 */
export interface SizeMod {
    /** Defines component size. */
    size?: ControlSize;
}
