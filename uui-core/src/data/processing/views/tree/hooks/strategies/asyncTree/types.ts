import { FilterConfig, PatchOptions, SearchConfig, SortConfig } from '../../../../../../../types';
import { STRATEGIES } from '../constants';
import { AsyncDataSourceConfig, CommonTreeConfig, ItemsStatuses, SharedItemsState } from '../types/common';

/**
 * Async tree hook configuration.
 */
export interface AsyncTreeProps<TItem, TId, TFilter> extends
    CommonTreeConfig<TItem, TId, TFilter>,
    PatchOptions<TItem, TId>,
    SharedItemsState<TItem, TId>,
    SearchConfig<TItem>,
    SortConfig<TItem>,
    FilterConfig<TItem, TFilter>,
    ItemsStatuses<TItem, TId, TFilter>,
    AsyncDataSourceConfig<TItem> {

    /**
     * Type of the tree to be supported.
     */
    type: typeof STRATEGIES.async;

    /**
     * Disables loading of records, if isLoaded = true.
     * If isLoaded = true, items are taken from itemsMap.
     * @internal
     */
    isLoaded?: boolean;
}
