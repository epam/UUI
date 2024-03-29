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

/**
 * Mutable map.
 */
export interface IMap<TKey, TValue> {
    /**
     * Must implement multiple constructors:
     * - constructor with empty arguments or initial data (optional);
     * - constructor, which accepts an argument of IMap<TKey, TValue> type and clones its value (mandatory).
     */
    constructor: Function;
    [Symbol.iterator](): IterableIterator<[TKey, TValue]>;
    get(key: TKey): TValue | undefined;

    /**
     * Should set data to the existing map. This operation is mutable.
     * @param key - key of a map.
     * @param value - value, to be set into a map, using the key.
     */
    set(key: TKey, value?: TValue): IMap<TKey, TValue>;

    /**
     * Should delete an element, located in a map by key. This operation is mutable.
     * @param key
     */
    delete(key: TKey): boolean;
    has(key: TKey): boolean;
    size: number;
}

/**
 * Immutable map.
 */
export interface IImmutableMap<TKey, TValue> {
    /**
     * Must implement multiple constructors:
     * - constructor with empty arguments or initial data (optional);
     * - constructor, which accepts an argument of IMap<TKey, TValue> type and clones its value (mandatory).
     * The example of implementation can be found in 'uui-core/src/data/processing/views/tree/ItemsMap.ts'.
     */
    constructor: Function;
    [Symbol.iterator](): IterableIterator<[TKey, TValue]>;
    get(key: TKey): TValue | undefined;

    /**
     * Should return cloned map with new value in it. This operation is immutable.
     * @param key - key of a map.
     * @param value - value, to be set into a map, using the key.
     */
    set(key: TKey, value?: TValue): IImmutableMap<TKey, TValue>;

    /**
     * Should return a cloned map, without data, located by the key. This operation is immutable.
     * @param key
     */
    delete(key: TKey): IImmutableMap<TKey, TValue>;
    has(key: TKey): boolean;
    size: number;
}

export type AnalyticsEvent = {
    /** Name of event */
    name: string;
    /** Any data, which will be sent with event */
    [key: string]: any;
} | null;
