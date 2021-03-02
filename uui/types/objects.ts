/* Common interface for data items */
export interface IdAndName {
    id: string;
    name: string;
}

// Defines location within SPA application
export interface Link {
    pathname: string;
    query?: any;
    search?: string;
}

export interface LayoutLayer {
    id: number;
    depth: number;
    zIndex: number;
}

export interface TimePickerValue {
    hours: number;
    minutes: number;
}

// It's not currently possible to define recursive type in TypeScript, like this:
// type CX = string? | CX[] | { [key: string]: CX };
// So we'll keep this shortcut to 'any' for now, at least this make code more self-explanatory.
export type CX = any;

/* An SVG icon descriptor, as imported via the import directive with webpack svg loader */
export interface SvgDescriptor {
    id: string;
    url: string;
    viewBox: string;
}

export type Icon = SvgDescriptor | React.SFC<any>;


