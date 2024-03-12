import { ItemsMap, ItemsStorage } from '../../../../../../processing';
import { IMap, PatchItemsOptions, SortingOption } from '../../../../../../../types';
import { STRATEGIES } from '../constants';
import { CommonDataSourceConfig } from '../types/common';
import { RecordStatus } from '../../../types';

/**
 * Async tree hook configuration.
 */
export interface AsyncTreeProps<TItem, TId, TFilter> extends
    CommonDataSourceConfig<TItem, TId, TFilter>,
    PatchItemsOptions<TItem, TId> {

    /**
     * Type of the tree to be supported.
     */
    type: typeof STRATEGIES.async;

    /**
     * Source of records, if are not loaded.
     */
    api(): Promise<TItem[]>;

    /**
     * Already loaded items (if no API call is needed and isLoaded = true).
     */
    items?: TItem[];

    /**
     * Map of loaded/shared items.
     */
    itemsMap?: ItemsMap<TId, TItem>;

    /**
     * Items updating listener, which fires on items loading/reloading/reset.
     */
    setItems?: ItemsStorage<TItem, TId>['setItems'];

    /**
     * Map of items statuses.
     */
    itemsStatusMap?: IMap<TId, RecordStatus>;

    /**
     * A pure function that gets search value for each item.
     * @default (item) => item.name.
     */
    getSearchFields?(item: TItem): string[];

    /**
     * A pure function that gets sorting value for current sorting value
     */
    sortBy?(item: TItem, sorting: SortingOption): any;

    /**
     * A pure function that returns filter callback to be applied for each item.
     * The callback should return true, if item passed the filter.
     */
    getFilter?(filter: TFilter): (item: TItem) => boolean;

    /**
     * Enables sorting of search results by relevance.
     * - The highest priority has records, which have a full match with a search keyword.
     * - The lower one has records, which have a search keyword at the 0 position, but not the full match.
     * - Then, records, which contain a search keyword as a separate word, but not at the beginning.
     * - And the lowest one - any other match of the search keyword.
     *
     * Example:
     * - `search`: 'some'
     * - `record string`: 'some word', `rank` = 4
     * - `record string`: 'someone', `rank` = 3
     * - `record string`: 'I know some guy', `rank` = 2
     * - `record string`: 'awesome', `rank` = 1
     *
     * @default true
     */
    sortSearchByRelevance?: boolean;

    /**
     * Disables loading of records, if isLoaded = true.
     * If isLoaded = true, items are taken either from items or itemsMap.
     */
    isLoaded?: boolean;
}
