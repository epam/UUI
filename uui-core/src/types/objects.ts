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
    key?: string;
    hash?: string;
    state?: any;
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

export type Icon = React.FC<any>;

export interface IMap<TKey, TValue> {
    constructor: Function;
    [Symbol.iterator](): IterableIterator<[TKey, TValue]>
    get(key: TKey): TValue;
    set(key: TKey, value: TValue): IMap<TKey, TValue>;
    has(key: TKey): boolean;
    delete(key: TKey): boolean;
    size: number;
}