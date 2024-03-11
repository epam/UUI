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
 * Map interface.
 */
export interface IMap<TKey, TValue> extends IBaseMap<TKey, TValue> {
    /**
     * IMap setter.
     * @param key - key of the map.
     * @param value - value of the map, to be set by key.
     */
    set(key: TKey, value: TValue): IMap<TKey, TValue>;
    /**
     * Removes item with provided key from the map.
     * @param key - key of an item.
     */
    delete(key: TKey): boolean;
    /**
     * Size of the map.
     */
    size: number;
}

export type AnalyticsEvent = {
    /** Name of event */
    name: string;
    /** Any data, which will be sent with event */
    [key: string]: any;
} | null;

/**
 * Base map interface.
 */
export interface IBaseMap<TKey, TValue> {
    /**
     * IBaseMap contructor.
     */
    constructor: Function;
    /**
     * Iterator through items.
     */
    [Symbol.iterator](): IterableIterator<[TKey, TValue]>;
    /**
     * IBaseMap getter.
     * @param key - key of an item.
     */
    get(key: TKey): TValue | undefined;
    /**
     * IBaseMap setter.
     * @param key - key of the map.
     * @param value - value of the map, to be set by key.
     */
    set(key: TKey, value?: TValue): IBaseMap<TKey, TValue>;
    /**
     * Checks if item with provided key is present in the map.
     * @param key - key of an item.
     */
    has(key: TKey): boolean;
}
