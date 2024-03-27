import { ITree } from '../newTree/exposed';
import { CommonDataSourceConfig, GetItemStatus, LoadMissingRecords, ITreeActions, ITreeLoadingState } from './strategies/types';

/**
 * Result of the useTree hook.
 */
export interface UseTreeResult<TItem, TId, TFilter = any> extends
    CommonDataSourceConfig<TItem, TId, TFilter>,
    ITreeLoadingState,
    ITreeActions,
    LoadMissingRecords<TItem, TId>,
    GetItemStatus<TId> {

    /**
     * Tree-like data, rows to be build from.
     */
    tree: ITree<TItem, TId>;

    /**
     * Tree-like data, selected rows to be build from and cascade selection should be performed on.
     */
    selectionTree: ITree<TItem, TId>;

    treeWithoutPatch: ITree<TItem, TId>;
    /**
     * Total count of the rows.
     */
    totalCount?: number;
}
