import { LazyDataSourceApi, PatchOptions } from '../../../../../../../types';
import { STRATEGIES } from '../constants';
import { CommonDataSourceConfig, ItemsStatuses, SharedItemsState } from '../types/common';

/**
 * Get assumed node children count configuration.
 */
export interface GetChildCount<TItem> {
    /**
     * Should return number of children of the item.
     * If it returns > 0, the item is assumed to have children and to be foldable.
     * Usually, this value should be returned from API, as a field of a parent, e.g. { id: 1, name: 'London', childCount: 12 }.
     * In this case, you can implement getChildCount as (i) => i.childCount.
     *
     * If you can't get number of children via API, you can return a guess value (avg number of children for this type of entity).
     * Note, that this can lead to more API calls, and increased load times in the 'parallel' fetch mode.
     */
    getChildCount?(item: TItem): number;
}

export type LazyTreeProps<TItem, TId, TFilter> =
    CommonDataSourceConfig<TItem, TId, TFilter>
    & PatchOptions<TItem, TId>
    & GetChildCount<TItem>
    & SharedItemsState<TItem, TId>
    & ItemsStatuses<TId>
    & {

        /**
         * Type of the tree to be supported.
         */
        type: typeof STRATEGIES.lazy,

        /**
         * A function to retrieve the data, asynchronously.
         * This function usually performs a REST API call.
         * API is used to retrieve lists of items.
         * It is expected to:
         * - be able to handle paging (via from/count params)
         * - be able to retrieve specific items by the list of their ids
         * - be able to retrieve children by parents (when getChildCount is specified, and ctx.parentId is passed)
         */
        api: LazyDataSourceApi<TItem, TId, TFilter>;

        /**
         * A filter to pass to API.
         * Note, that the DataSourceState also has a filter fields. These two filters are merged before API calls.
         * Use this prop if you need to apply some filter in any case.
         * Prefer to use filter in the DataSourceState for end-user editable filters.
         */
        filter?: TFilter;

        /**
         * Defines how to fetch children:
         * sequential (default) - fetch children for each parent one-by-one. Makes minimal over-querying, at cost of some speed.
         * parallel - fetch children for several parents simultaneously. Can make a lot of over-querying for deep trees.
         * Recommended for 2 level trees (grouping), as it makes no over-querying in this case, and is faster than sequential strategy.
         */
        fetchStrategy?: 'sequential' | 'parallel';

        /**
         * Enables background reloading of data on search/sort/filter/reload, which turns off the rows placeholders displaying while data loading.
         * During data reloading, previous data is displayed. To prevent any interaction with visible not actual rows, a blocker/spinner should be displayed.
         * In UUI components, such as `PickerInput`, `PickerList`, `PickerModal` and `DataTable`, blockers are added.
         * It is required to add blockers/spinners to the components, built on your own.
         * If reloading is started, `view.getListProps` returns `isReloading` flag, set to `true`.
         */
        backgroundReload?: boolean;

        /**
         * Falls back to plain list from tree, if there's search.
         * Default is true.
         *
         * If enabled, and search is active:
         * - API will be called with parentId and parent undefined
         * - getChildCount is ignored, all nodes are assumed to have no children
         *
         * See more here: https://github.com/epam/UUI/issues/8
         */
        flattenSearchResults?: boolean;
    };
