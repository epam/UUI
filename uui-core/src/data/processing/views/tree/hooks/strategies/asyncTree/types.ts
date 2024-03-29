import { PatchOptions } from '../../../../../../../types';
import { STRATEGIES } from '../constants';
import { CommonDataSourceConfig, FilterConfig, ItemsStatuses, SearchConfig, SharedItemsState, SortConfig } from '../types/common';

/**
 * Async tree hook configuration.
 */
export interface AsyncTreeProps<TItem, TId, TFilter> extends
    CommonDataSourceConfig<TItem, TId, TFilter>,
    PatchOptions<TItem, TId>,
    SharedItemsState<TItem, TId>,
    SearchConfig<TItem>,
    SortConfig<TItem>,
    FilterConfig<TItem, TFilter>,
    ItemsStatuses<TId> {

    /**
     * Type of the tree to be supported.
     */
    type: typeof STRATEGIES.async;

    /**
     * Source of records, if are not loaded.
     */
    api(): Promise<TItem[]>;

    /**
     * Disables loading of records, if isLoaded = true.
     * If isLoaded = true, items are taken from itemsMap.
     */
    isLoaded?: boolean;
}
