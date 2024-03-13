import { IMap, PatchItemsOptions } from '../../../../../../../types';
import { STRATEGIES } from '../constants';
import { CommonDataSourceConfig, FilterConfig, SearchConfig, SharedItemsState, SortConfig } from '../types/common';
import { RecordStatus } from '../../../types';

/**
 * Async tree hook configuration.
 */
export interface AsyncTreeProps<TItem, TId, TFilter> extends
    CommonDataSourceConfig<TItem, TId, TFilter>,
    PatchItemsOptions<TItem, TId>,
    SharedItemsState<TItem, TId>,
    SearchConfig<TItem>,
    SortConfig<TItem>,
    FilterConfig<TItem, TFilter> {

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
     * Map of items statuses.
     */
    itemsStatusMap?: IMap<TId, RecordStatus>;

    /**
     * Disables loading of records, if isLoaded = true.
     * If isLoaded = true, items are taken either from items or itemsMap.
     */
    isLoaded?: boolean;
}
