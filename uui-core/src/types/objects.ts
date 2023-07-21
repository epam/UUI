import { ClassValue } from '../helpers/cx';

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

// CX type is a union type that represents the valid values to pass CSS classes
export type CX = ClassValue;

export type Icon = React.FC<any>;

export interface IMap<TKey, TValue> {
    constructor: Function;
    [Symbol.iterator](): IterableIterator<[TKey, TValue]>;
    get(key: TKey): TValue;
    set(key: TKey, value: TValue): IMap<TKey, TValue>;
    has(key: TKey): boolean;
    delete(key: TKey): boolean;
    size: number;
}

export type AnalyticsEvent = {
    name: string;
    [key: string]: any;
} | null;
