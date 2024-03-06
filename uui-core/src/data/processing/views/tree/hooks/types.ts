import { ITree } from '../newTree/exposed';
import { CommonDataSourceConfig, GetItemStatus, LoadMissingRecords, TreeActions, TreeLoadingState } from './strategies/types';
import { GetChildCount } from '../../../../../types';

export interface UseTreeResult<TItem, TId, TFilter = any> extends
    CommonDataSourceConfig<TItem, TId, TFilter>,
    TreeLoadingState,
    TreeActions,
    LoadMissingRecords<TItem, TId>,
    GetItemStatus<TId>,
    GetChildCount<TItem> {

    tree: ITree<TItem, TId>;
    selectionTree: ITree<TItem, TId>;
    totalCount?: number;
}
