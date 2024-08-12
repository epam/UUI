export interface Viewport {
    center: Date;
    pxPerMs: number;
    widthPx: number;
}

/**
 * Viewport time period.
 */
export interface ViewportRange {
    /**
     * Start of time period range.
     */
    from: Date;

    /**
     * End of time period range.
     */
    to: Date;

    /**
     * Timeline width in px.
     */
    widthPx: number;
}

export interface CheckpointDate {
    name: string;
    date: Date;
    colorCircle?: string;
}
