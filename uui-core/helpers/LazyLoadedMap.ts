import { batchOnNextTick } from './batchOnNextTick';

interface MapRecord<TValue> {
    status: LoadingStatus;
    value?: TValue | null;
}

/**
 * An callback to pass to LazyLoadedMap constructor
 */
export type LazyLoadedMapLoadCallback<TKey, TValue> = (pending: TKey[]) => Promise<[TKey, TValue][]>;

export const UNKNOWN = Symbol("UNKNOWN");
export const LOADING = Symbol("LOADING");
export const LOADED = Symbol("LOADED");
export const PENDING = Symbol("PENDING");
export const FAILED = Symbol("FAILED");

export type LoadingStatus = (typeof UNKNOWN) | (typeof LOADING) | (typeof PENDING) | (typeof LOADED) | (typeof FAILED);

/**
 * Represents a Map (key/value collection), which can be batch-loaded as required with async requests.
 * TKey is expected to be value type - i.e. can be used as Map key.
 */
export class LazyLoadedMap<TKey, TValue> {
    map: Map<TKey, MapRecord<TValue>> = new Map();

    /**
     * Creates new LazyLoadedMap
     * @param runBatch Will be called with all missing Keys was requested with get() method on previous JS tick.
     * @param onBatchComplete Will be called each time another batch is completed, and result is added to the map.
     */
    constructor(private runBatch: LazyLoadedMapLoadCallback<TKey, TValue>, private onBatchComplete?: () => void) {

    }

    /**
     * Gets an element from map.
     * If the element is missing, it will be scheduled for loading at the next JS tick, and null will be returned.
     * @param key Key to fetch.
     * @param fetchIfAbsent Should we enqueue the key for loading, if it's missing. True by default.
     * Pass false to understand if element is fetched, without forcing it to fetch.
     */
    public get(key: TKey, fetchIfAbsent: boolean = true): TValue | null {
        let item: MapRecord<TValue> = this.map.get(key) || { status: UNKNOWN, value: null };

        if (fetchIfAbsent && item.status === UNKNOWN) {
            item = { status: PENDING, value: null };
            this.map.set(key, item);
            this.fetch();
        }

        return item.value;
    }

    /**
     * Adds an element to the map. Added element can be queried with get() method, no fetch will occur for elements added with set() method.
     * @param key Element's key
     * @param value Element's value
     */
    public set(key: TKey, value: TValue) {
        this.map.set(key, { value, status: LOADED });
    }

    private fetch = batchOnNextTick(() => {
        const keys: any[] = [];
        this.map.forEach((item, key) => {
            if (item.status === PENDING) {
                item.status = LOADING;
                keys.push(key);
            }
        });

        this.runBatch(keys)
            .then(result => {
                result.forEach(entry => {
                    this.set(entry[0], entry[1]);
                });
                this.onBatchComplete && this.onBatchComplete();
            })
            .catch(() => {
                keys.forEach(key => {
                    this.map.set(key, { status: FAILED });
                });
            });
    });
}