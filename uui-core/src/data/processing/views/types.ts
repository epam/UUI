import {
    SortingOption, BaseListViewProps, LazyDataSourceApi,
} from '../../../types';

export interface BaseArrayListViewProps<TItem, TId, TFilter> extends BaseListViewProps<TItem, TId, TFilter> {
    /** A pure function that gets search value for each item.
     Default: (item) => item.name.
     */
    getSearchFields?(item: TItem): string[];
    /** A pure function that gets sorting value for current sorting value */
    sortBy?(item: TItem, sorting: SortingOption): any;
    /** A pure function that returns filter callback to be applied for each item.
     * The callback should return true, if item passed the filter.
     *  */
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
}

export interface ArrayListViewProps<TItem, TId, TFilter> extends BaseArrayListViewProps<TItem, TId, TFilter> {
    /** Data, which should be represented by a DataSource. */
    items?: TItem[];
}

export interface AsyncListViewProps<TItem, TId, TFilter> extends BaseArrayListViewProps<TItem, TId, TFilter> {
    /** A function to retrieve the data, asynchronously. This function usually performs a REST API call.
     * Should return the array of items, which will be processed by dataSource.
     * This api called only once during the initialization and assumed to return the full amount of data.
     * For lazy loading cases, use LazyDataSource
     * */
    api(): Promise<TItem[]>;
}

export interface LazyListViewProps<TItem, TId, TFilter> extends BaseListViewProps<TItem, TId, TFilter> {
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
     * Should return number of children of the item.
     * If it returns > 0, the item is assumed to have children and to be foldable.
     * Usually, this value should be returned from API, as a field of a parent, e.g. { id: 1, name: 'London', childCount: 12 }.
     * In this case, you can implement getChildCount as (i) => i.childCount.
     *
     * If you can't get number of children via API, you can return a guess value (avg number of children for this type of entity).
     * Note, that this can lead to more API calls, and increased load times in the 'parallel' fetch mode.
     */
    getChildCount?(item: TItem): number;

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
     *      Recommended for 2 level trees (grouping), as it makes no over-querying in this case, and is faster than sequential strategy.
     */
    fetchStrategy?: 'sequential' | 'parallel';

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

    /**
     * This option is added for the purpose of supporting legacy behavior of fetching data
     * on `getRows` and `getListProps`, not to break users' own implementation of dataSources.
     * @default true
     */
    legacyLoadDataBehavior?: boolean;
}
