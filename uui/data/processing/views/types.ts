import { DataRowProps, ICheckable } from "../../../types";

export type IDataSourceView<TItem, TId, TFilter> = {
    getById(id: TId, index: number): DataRowProps<TItem, TId>;
    getListProps(): DataSourceListProps;
    getVisibleRows(): DataRowProps<TItem, TId>[];
    getSelectedRows(): DataRowProps<TItem, TId>[];
    _forceUpdate(): void;
    selectAll?: ICheckable;
};

export type DataSourceListCounts = {
    /**
     * Count of rows, after applying filter, and folding on tree nodes.
     * Obsolete! Please switch to exactRowsCount / knownRowsCount
     */
    rowsCount?: number;

    /** Count of rows, if all rows loaded. Can be null while initial loading, or if API doesn't return count  */
    exactRowsCount?: number;

    /**
     * There's at least knownRowsCount rows. There can be more if list is lazy loaded.
     * Equals to exactRowsCount if all rows are loaded, or if API returns rows count
     * Otherwise, exactRowsCount will be null, and knownRowsCount will specify number of loaded rows.
     */
    knownRowsCount?: number;

    /** Total count of items, before applying the filter. If there's a tree, it counts all nodes, including folded children  */
    totalCount?: number;
};

export interface DataSourceListProps extends DataSourceListCounts {
    selectAll?: ICheckable;
}