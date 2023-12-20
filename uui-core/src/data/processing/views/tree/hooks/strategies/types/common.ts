import { CascadeSelection, DataRowOptions, DataSourceState } from '../../../../../../../types';

export interface CommonDataSourceConfig<TItem, TId, TFilter = any> {
    dataSourceState: DataSourceState<TFilter, TId>;
    setDataSourceState?: React.Dispatch<React.SetStateAction<DataSourceState<TFilter, TId>>>;

    getId(item: TItem): TId;
    getParentId?(item: TItem): TId | undefined;
    complexIds?: boolean;

    rowOptions?: DataRowOptions<TItem, TId>;
    getRowOptions?(item: TItem, index?: number): DataRowOptions<TItem, TId>;

    isFoldedByDefault?(item: TItem): boolean;
    getChildCount?(item: TItem): number;

    cascadeSelection?: CascadeSelection;
    flattenSearchResults?: boolean;
    selectAll?: boolean;
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
