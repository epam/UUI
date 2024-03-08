import { CascadeSelection, DataRowOptions, DataSourceState, SetDataSourceState } from '../../../../../../../types';

export interface CommonDataSourceConfig<TItem, TId, TFilter = any> {
    dataSourceState: DataSourceState<TFilter, TId>;
    setDataSourceState: SetDataSourceState<TFilter, TId>;

    getId(item: TItem): TId;
    getParentId?(item: TItem): TId | undefined;
    complexIds?: boolean;

    rowOptions?: DataRowOptions<TItem, TId>;
    getRowOptions?(item: TItem, index?: number): DataRowOptions<TItem, TId>;

    isFoldedByDefault?(item: TItem, dataSourceState: Pick<DataSourceState<TFilter, TId>, 'foldAll'>): boolean;

    cascadeSelection?: CascadeSelection;
    selectAll?: boolean;
    showSelectedOnly?: boolean;
}

export interface TreeLoadingState {
    isFetching?: boolean;
    isLoading?: boolean;
}

export interface TreeActions {
    reload(): void;
}

export interface TreeRowsStats {
    completeFlatListRowsCount: number;
    totalCount: number;
}
