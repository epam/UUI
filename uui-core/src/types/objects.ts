import { ClassValue } from '../helpers/cx';

/** Defines location within SPA application */
export interface Link {
    pathname: string;
    query?: any;
    search?: string;
    key?: string;
    hash?: string;
    state?: any;
}

// CX type is a union type that represents the valid values to pass CSS classes
export type CX = ClassValue;

export type Icon = React.FC<any>;

export interface IMap<TKey, TValue> extends IBaseMap<TKey, TValue> {
    constructor: Function;
    [Symbol.iterator](): IterableIterator<[TKey, TValue]>;
    set(key: TKey, value: TValue): IMap<TKey, TValue>;
    delete(key: TKey): boolean;
    size: number;
}

export type AnalyticsEvent = {
    /** Name of event */
    name: string;
    /** Any data, which will be sent with event */
    [key: string]: any;
} | null;

export interface IBaseMap<TKey, TValue> {
    constructor: Function;
    [Symbol.iterator](): IterableIterator<[TKey, TValue]>;
    get(key: TKey): TValue;
    set(key: TKey, value?: TValue): IBaseMap<TKey, TValue>;
    has(key: TKey): boolean;
}
