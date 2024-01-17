import { NewTree } from '../newTree';
import { CommonDataSourceConfig, LoadMissingRecords, TreeActions, TreeLoadingState, TreeRowsStats } from './strategies/types';

export interface UseTreeResult<TItem, TId, TFilter = any> extends
    CommonDataSourceConfig<TItem, TId, TFilter>,
    TreeLoadingState,
    TreeActions,
    LoadMissingRecords<TItem, TId> {

    tree: NewTree<TItem, TId>;
}
