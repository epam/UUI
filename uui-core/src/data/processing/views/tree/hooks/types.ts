import { ITree } from '../newTree/exposed';
import { CommonDataSourceConfig, GetItemStatus, LoadMissingRecords, TreeActions, TreeLoadingState } from './strategies/types';
import { PatchItemsOptions } from '../../../../../types';

export interface UseTreeResult<TItem, TId, TFilter = any> extends
    Omit<CommonDataSourceConfig<TItem, TId, TFilter>, keyof PatchItemsOptions<TItem, TId>>,
    TreeLoadingState,
    TreeActions,
    LoadMissingRecords<TItem, TId>,
    GetItemStatus<TId> {

    tree: ITree<TItem, TId>;
    selectionTree: ITree<TItem, TId>;
    totalCount?: number;
}
