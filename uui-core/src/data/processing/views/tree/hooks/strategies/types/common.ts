import { CascadeSelection, DataRowOptions, DataSourceState, PatchItemsOptions } from '../../../../../../../types';

export interface CommonDataSourceConfig<TItem, TId, TFilter = any> extends PatchItemsOptions<TItem, TId> {
    dataSourceState: DataSourceState<TFilter, TId>;
    setDataSourceState: React.Dispatch<React.SetStateAction<DataSourceState<TFilter, TId>>>;

    getId(item: TItem): TId;
    getParentId?(item: TItem): TId | undefined;
    complexIds?: boolean;

    rowOptions?: DataRowOptions<TItem, TId>;
    getRowOptions?(item: TItem, index?: number): DataRowOptions<TItem, TId>;

    isFoldedByDefault?(item: TItem, dataSourceState: Pick<DataSourceState<TFilter, TId>, 'foldAll'>): boolean;
    getChildCount?(item: TItem): number;

    cascadeSelection?: CascadeSelection;
    selectAll?: boolean;
    showOnlySelected?: boolean;
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
