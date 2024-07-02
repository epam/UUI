export interface Viewport {
    center: Date;
    pxPerMs: number;
    widthPx: number;
}

export interface ViewportRange {
    from: Date;
    to: Date;
    widthPx: number;
}

export interface CheckpointDate {
    name: string;
    date: Date;
    colorCircle?: string;
}
