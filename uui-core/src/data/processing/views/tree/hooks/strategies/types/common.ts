import {
    BaseDataSourceConfig,
    DataSourceState, FlattenSearchResultsConfig, IMap, LazyDataSourceApi,
    SetDataSourceState,
} from '../../../../../../../types';
import { ItemsMap } from '../../../ItemsMap';
import { ItemsStatusCollector } from '../../../ItemsStatusCollector';
import { ItemsStorage } from '../../../ItemsStorage';
import { RecordStatus } from '../../../types';

/**
 * Tree configuration.
 */
export interface CommonTreeConfig<TItem, TId, TFilter = any> extends BaseDataSourceConfig<TItem, TId, TFilter> {
    /**
     * State of the dataSource.
     */
    dataSourceState: DataSourceState<TFilter, TId>;

    /**
     * DataSource state update handler.
     */
    setDataSourceState: SetDataSourceState<TFilter, TId>;
}

/**
 * Loading state of the tree.
 */
export interface ITreeLoadingState {
    /**
     * Are tree records loading silently.
     */
    isFetching?: boolean;
    /**
     * Are tree records loading loadly (show loading placeholders, etc).
     */
    isLoading?: boolean;
}

/**
 * Actions, allowed to be performed on the tree.
 */
export interface ITreeActions {
    /**
     * Tree reloading handler.
     */
    reload(): void;
}

export interface TreeRowsStats {
    completeFlatListRowsCount: number;
    totalCount: number;
}

export interface SharedItemsState<TItem, TId> {
    /**
     * Map of shared items.
     */
    itemsMap?: ItemsMap<TId, TItem>;

    /**
     * Items updating listener, which fires on items loading/reloading/reset.
     */
    setItems?: ItemsStorage<TItem, TId>['setItems'];
}

export interface ItemsStatuses<TItem, TId, TFilter = any> {
    /**
     * Map of items statuses.
     */
    itemsStatusMap?: IMap<TId, RecordStatus>;

    itemsStatusCollector?: ItemsStatusCollector<TItem, TId, TFilter>;
}

export interface LazyDataSourceConfig<TItem, TId, TFilter> extends FlattenSearchResultsConfig {
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
}

export interface AsyncDataSourceConfig<TItem> {
    /**
     * A function to retrieve the data, asynchronously. This function usually performs a REST API call.
     * Should return the array of items, which will be processed by dataSource.
     * This api called only once during the initialization and assumed to return the full amount of data.
     * For lazy loading cases, use LazyDataSource
     */
    api(): Promise<TItem[]>;
}

export interface ArrayDataSourceConfig<TItem> {
    /**
     * Data, which should be represented by a DataSource.
     */
    items?: TItem[];
}
