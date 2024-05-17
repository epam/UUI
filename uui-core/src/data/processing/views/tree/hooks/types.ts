import { ITree } from '../ITree';
import { FlattenSearchResultsConfig, PatchOptions } from '../../../../../types';
import { CommonTreeConfig, GetItemStatus, LoadMissingRecords, ITreeActions, ITreeLoadingState } from './strategies/types';

/**
 * Result of the useTree hook.
 */
export interface UseTreeResult<TItem, TId, TFilter = any> extends
    Omit<CommonTreeConfig<TItem, TId, TFilter>, keyof PatchOptions<TItem, TId>>,
    ITreeLoadingState,
    ITreeActions,
    LoadMissingRecords<TItem, TId>,
    GetItemStatus<TId>,
    FlattenSearchResultsConfig {

    /**
     * Tree-like data, rows to be build from.
     */
    tree: ITree<TItem, TId>;

    /**
     * Tree-like data, selected rows to be build from and cascade selection should be performed on.
     */
    selectionTree: ITree<TItem, TId>;

    /**
     * Version of the tree before applying patch to it.
     */
    treeWithoutPatch: ITree<TItem, TId>;

    /**
     * Total count of the rows.
     */
    totalCount?: number;
}
