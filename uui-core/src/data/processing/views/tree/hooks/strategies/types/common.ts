import { CascadeSelection, DataRowOptions, DataSourceState, SetDataSourceState } from '../../../../../../../types';

/**
 * DataSource configuration.
 */
export interface CommonDataSourceConfig<TItem, TId, TFilter = any> {
    /**
     * State of the dataSource.
     */
    dataSourceState: DataSourceState<TFilter, TId>;

    /**
     * DataSource state update handler.
     */
    setDataSourceState: SetDataSourceState<TFilter, TId>;

    /**
     * Record ID getter.
     * @param item - record, which id should be returned.
     * @returns item id.
     */
    getId(item: TItem): TId;

    /**
     * Record parentId getter.
     * @param item - record, which paretnId should be returned.
     * @returns item parentId.
     */
    getParentId?(item: TItem): TId | undefined;

    /**
     * Enables support of complex IDs in DataSources.
     * If enabled, ids of types Object, Array, etc, are supported.
     */
    complexIds?: boolean;

    /**
     * Row props configuration.
     */
    rowOptions?: DataRowOptions<TItem, TId>;

    /**
     * Row props configuration getter.
     * @param item - record, configuration should be returned for.
     * @param index - index of a row. It is optional and should not be expected, that it is provided on every call.
     */
    getRowOptions?(item: TItem, index?: number): DataRowOptions<TItem, TId>;

    /**
     * Provides a default folding behavior for the exact record, if the opposite is not specified in the DataSourceState.
     * @param item - record, folding value should be returned for.
     * @param dataSourceState - dataSource state with current `foldAll` value. It provides the possibility to respect foldAll change, if `isFoldedByDefault` is implemented.
     */
    isFoldedByDefault?(item: TItem, dataSourceState: Pick<DataSourceState<TFilter, TId>, 'foldAll'>): boolean;

    /**
     * Type of an cascade selection algorithm.
     */
    cascadeSelection?: CascadeSelection;

    /**
     * Enables/disables selectAll functionality. If disabled explicitly, `selectAll`, returned from a view is null.
     * @default true
     */
    selectAll?: boolean;

    /**
     * Enables returning only selected rows and loading missing selected/checked rows, if it is required/possible.
     */
    showSelectedOnly?: boolean;
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
