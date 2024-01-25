import { ITree } from '../newTree/exposed';
import { CommonDataSourceConfig, LoadMissingRecords, TreeActions, TreeLoadingState } from './strategies/types';

export interface UseTreeResult<TItem, TId, TFilter = any> extends
    CommonDataSourceConfig<TItem, TId, TFilter>,
    TreeLoadingState,
    TreeActions,
    LoadMissingRecords<TItem, TId> {

    tree: ITree<TItem, TId>;
    selectionTree: ITree<TItem, TId>;
}
