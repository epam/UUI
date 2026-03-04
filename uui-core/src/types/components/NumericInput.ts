export interface NumericInputCoreProps {
    /** Maximum value (default is Number.MAX_SAFE_INTEGER) */
    max?: number;

    /**
     * Minimum value (default is 0)
     * @default 0
     */
    min?: number;

    /** Increase/decrease step on up/down icons clicks and up/down arrow keys */
    step?: number;

    /** HTML ID */
    id?: string;
}
