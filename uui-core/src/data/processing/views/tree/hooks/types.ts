import { ITree } from '../../tree/ITree';
import { CommonDataSourceConfig, LoadMissingRecords, TreeActions, TreeLoadingState, TreeRowsStats } from './strategies/types';

export interface UseTreeResult<TItem, TId, TFilter = any> extends
    CommonDataSourceConfig<TItem, TId, TFilter>,
    TreeLoadingState,
    TreeActions,
    TreeRowsStats,
    LoadMissingRecords<TItem, TId> {

    tree: ITree<TItem, TId>;
    fullTree: ITree<TItem, TId>; // TODO: TB removed
}
