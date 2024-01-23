import { ClassValue } from '../helpers/cx';

/** Defines location within SPA application */
export interface Link {
    /** A URL pathname, beginning with a '/' */
    pathname: string;
    /** Object that will be parsed to the URL search params */
    query?: any;
    /** A URL search string, beginning with a '?' */
    search?: string;
    /** A unique string associated with this location. May be used to safely store
     * and retrieve data in some other storage API, like `localStorage`.
     *
     * Note: This value is always "default" on the initial location.
     */
    key?: string;
    /** A URL fragment identifier, beginning with a '#' */
    hash?: string;
    /** A value of arbitrary data associated with this location */
    state?: any;
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
    /** Name of event */
    name: string;
    /** Any data, which will be sent with event */
    [key: string]: any;
} | null;
