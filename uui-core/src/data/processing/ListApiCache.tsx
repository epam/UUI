import { LazyLoadedMap } from '../../helpers';
import { LazyDataSourceApi } from '../../types';
import { batch } from '../../helpers/batch';

export interface ListApiSettings<TItem, TId, TFilter> {
    /** Lazy List API used to fetch items */
    api: LazyDataSourceApi<TItem, TId, TFilter>;

    /** Get ID from an item. Id is expected to be value-type, i.e. can be used as Map's key */
    getId: (item: TItem) => TId;

    /** Will be called after new data is fetched into the list */
    onUpdate?: () => void;
}

export interface ListApiResponse<TItem> {
    /** Items according to the request. For items that are not fetched yet, null will be returned. */
    items: TItem[];
}

/**
 * Caches items by ID, and can request missing items via API.
 */
export class ListApiCache<TItem, TId, TFilter> {
    itemsById: LazyLoadedMap<string, TItem>;

    api: LazyDataSourceApi<TItem, TId, TFilter>;
    getId: (item: TItem) => TId;
    onUpdate: () => void;

    constructor(options: ListApiSettings<TItem, TId, TFilter>) {
        this.api = options.api;
        this.getId = options.getId;
        this.onUpdate = batch(() => options.onUpdate && options.onUpdate());
        this.itemsById = new LazyLoadedMap((ids) => this.loadByIds(ids), this.onUpdate);
    }

    /**
     * Gets item by id. If item is not yet fetched, null be returned, and ID be scheduled for fetch on the next tick.
     * @param id Item ID
     * @param fetchIfAbsent Pass false to avoid auto-fetching missing item.
     */
    public byId(id: TId, fetchIfAbsent: boolean = true) {
        return this.itemsById.get(JSON.stringify(id), fetchIfAbsent);
    }

    public setItem(item: TItem) {
        const id = this.getId(item);
        this.itemsById.set(JSON.stringify(id), item);
    }

    private loadByIds(keys: string[]) {
        const ids: TId[] = keys.map((key) => JSON.parse(key));
        return this.api({ ids }).then((response) => {
            return response.items.map((item) => [JSON.stringify(this.getId(item)), item] as [string, TItem]);
        });
    }
}
