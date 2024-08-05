import { ITree } from '../ITree';
import { FlattenSearchResultsConfig, IImmutableMap, IMap } from '../../../../../types';
import { CommonTreeConfig, GetItemStatus, LoadMissingRecords, ITreeActions, ITreeLoadingState } from './strategies/types';

/**
 * Result of the useTree hook.
 */
export interface UseTreeResult<TItem, TId, TFilter = any> extends
    Omit<CommonTreeConfig<TItem, TId, TFilter>, 'patch'>,
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

    /**
     * Allows patching an existing tree with updated data multiple times without affecting the original tree.
     * It can be used while adding subtotals or making other changes to the data, based on update results before setting data to the form.
     * @param modifiedItems Map of updated, deleted, or added items to be applied to the existing tree.
     * @returns A new tree patched with the modified items.
     */
    applyPatch: (modifiedItems: IMap<TId, TItem> | IImmutableMap<TId, TItem>) => ITree<TItem, TId>;
}
