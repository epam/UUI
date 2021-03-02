import { LazyLoadedMap } from '../../helpers';
import { LazyDataSourceApi, LazyDataSourceApiRequestOptions, LazyDataSourceApiRequest } from './types';
import { batchOnNextTick } from '../../helpers/batchOnNextTick';

export interface ListApiSettings<TItem, TId, TFilter> {

    /** Lazy List API used to fetch items */
    api: LazyDataSourceApi<TItem, TId, TFilter>;

    /** Get ID from an item. Id is expected to be value-type, i.e. can be used as Map's key */
    getId: (item: TItem) => TId;

    /** Will be called after new data is fetched into the list */
    onUpdate?: () => void;

    /** If cache size became more than maxCacheSize, the last created item will be removed. Default: 100 */
    maxCacheSize?: number;
}

export interface ListApiResponse<TItem> {
    /** Items according to the request. For items that are not fetched yet, null will be returned. */
    items: TItem[];
    /** Exact count of items in the whole list. Null if exact count is not known yet (list haven't fetched to the end) */
    exactCount?: number;
    /** Count of items already fetched, and known to exist in the list. */
    knownCount: number;
}

interface ListRecord<TItem> {
    map: LazyLoadedMap<number, TItem>;
    minCount: number;
    maxCount?: number;
    exactCount?: number;
    createdWhen?: number;
}

/**
 * List API is an abstract client-server contract described with LazyDataSourceApi.
 * It and looks like this:
 *
 * ({ range: { from, to }, ids: [...list of ids...] }, ...otherOptions) => Promise<{ items: TItem }>
 *
 * The API is capable of
 * - lazily fetching ordered lists of data items, page by page
 * - fetching particular items by their IDs, which is required to retrieve selected items without fetching the whole list
 *
 * The ListApiCache adds a caching and request batching layer on top of the list API.
 */
export class ListApiCache<TItem, TId, TFilter> {
    itemsById: LazyLoadedMap<TId, TItem>;
    itemLists: Map<any, ListRecord<TItem>> = new Map();

    api: LazyDataSourceApi<TItem, TId, TFilter>;
    getId: (item: TItem) => TId;
    maxCacheSize: number;
    onUpdate: () => void;

    constructor(options: ListApiSettings<TItem, TId, TFilter>) {
        this.api = options.api;
        this.getId = options.getId;
        this.onUpdate = batchOnNextTick(() => options.onUpdate && options.onUpdate());
        this.itemsById = new LazyLoadedMap(ids => this.loadByIds(ids), this.onUpdate);
        this.maxCacheSize = options.maxCacheSize || 100;
    }

    /**
     * Gets item by id. If item is not yet fetched, null be returned, and ID be scheduled for fetch on the next tick.
     * @param id Item ID
     * @param fetchIfAbsent Pass false to avoid auto-fetching missing item.
     */
    public byId(id: TId, fetchIfAbsent: boolean = true) {
        return this.itemsById.get(id, fetchIfAbsent);
    }

    /**
     * Query item's list according to the request.
     * Null well be returned for each item which not yet fetched.
     * If there are non-fetched items, fetch will be scheduled.
     * @param request
     * @param fetchIfAbsent Pass false to avoid auto-fetching missing items.
     */
    public query(request: LazyDataSourceApiRequest<TItem, TId, TFilter>, fetchIfAbsent: boolean = true): ListApiResponse<TItem> {
        const listRecord = this.getItemListMap(request);
        const items: TItem[] = [];
        const from = (request && request.range && request.range.from) || 0;
        const count = request && request.range && request.range.count;
        let to = from + count;

        if (listRecord.exactCount !== null) {
            to = Math.min(to, listRecord.exactCount);
        }

        for (let n = from; n < to; n++) {
            items.push(listRecord.map.get(n, fetchIfAbsent));
        }

        return {
            items,
            exactCount: listRecord.exactCount,
            knownCount: listRecord.minCount,
        };
    }

    private getItemListMap(options?: LazyDataSourceApiRequestOptions<TItem, TFilter>) {
        options = options || {};
        // re-create the options object to make sure there are no extra fields
        options = {
            filter: options.filter,
            sorting: options.sorting,
            search: options.search,
        };
        const cacheKey = JSON.stringify(options); // TODO: check performance impact of using JSON as a key

        let listRecord = this.itemLists.get(cacheKey);
        if (!listRecord) {
            listRecord = {
                map: new LazyLoadedMap(indexes => this.loadList(listRecord, indexes, options), this.onUpdate),
                minCount: 0,
                maxCount: null,
                exactCount: null,
                createdWhen: new Date().getTime(),
            };
            this.setListRecord(cacheKey, listRecord);
        }

        return listRecord;
    }

    private setListRecord(cacheKey: string, listRecord: ListRecord<TItem>) {
        if (this.itemLists.size >= this.maxCacheSize) {
            let lastCreatedItemTime: number = null;
            let lastCreatedItemKey = null;

            this.itemLists.forEach((i, key) => {
                if (!lastCreatedItemTime || i.createdWhen < lastCreatedItemTime) {
                    lastCreatedItemTime = i.createdWhen;
                    lastCreatedItemKey = key;
                }
            });

            this.itemLists.delete(lastCreatedItemKey);
        }

        this.itemLists.set(cacheKey, listRecord);
    }

    private loadList(listRecord: ListRecord<TItem>, indexes: number[], requestOptions: LazyDataSourceApiRequestOptions<TItem, TFilter>): Promise<[number, TItem][]> {
        let minRequested: number = Number.MAX_VALUE;
        let maxRequested: number = 0;

        indexes.forEach(idx => {
            minRequested = Math.min(minRequested, idx);
            maxRequested = Math.max(maxRequested, idx);
        });

        const range = { from: minRequested, count: maxRequested - minRequested + 1 };
        const request = { ...requestOptions, range };

        return this.api(request)
            .then(response => {
                const from = (response.from == null) ? range.from : response.from;
                const pairs = response.items
                    .map((item, idx) => [from + idx, item] as [number, TItem]);

                if (response.count !== null && response.count !== undefined) {
                    listRecord.exactCount = response.count;
                    listRecord.maxCount = response.count;
                    listRecord.minCount = response.count;
                } else {
                    if (response.items.length > 0) {
                        listRecord.minCount = Math.max(listRecord.minCount, from + response.items.length);
                    }

                    if (response.items.length < range.count) {
                        listRecord.maxCount = from + response.items.length;
                    }

                    if (listRecord.minCount === listRecord.maxCount) {
                        listRecord.exactCount = listRecord.minCount;
                    }
                }

                response.items.forEach(item => this.itemsById.set(this.getId(item), item));

                return pairs;
            });
    }

    public setItem(item: TItem) {
        this.itemsById.set(this.getId(item), item);
    }

    private loadByIds(ids: TId[]) {
        return this.api({ ids }).then(response => {
            return response.items.map(item => [this.getId(item), item] as [TId, TItem]);
        });
    }
}