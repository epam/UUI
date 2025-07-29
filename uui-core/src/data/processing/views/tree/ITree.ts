import { EMPTY, FULLY_LOADED, NOT_FOUND_RECORD, PARTIALLY_LOADED } from './constants';
import { IItemsAccessor, ITreeNodeInfo, ITreeParams } from './treeStructure/types';

/**
 * ITree node loading/state status.
 */
export type ITreeNodeStatus = typeof FULLY_LOADED | typeof PARTIALLY_LOADED | typeof EMPTY;

/**
 * Items, status and state information, like count/assumedCount/totalCount of the ITree node.
 */
export interface ITreeItemsInfo<TId> extends ITreeNodeInfo {
    /**
     * Tree node IDs.
     */
    ids: TId[];
    /**
     * ITree node loading/state status.
     */
    status: ITreeNodeStatus;
    /**
     * Cursor to the last fetched item, if cursor-based pagination is used.
     */
    cursor?: any;
}

/**
 * Proxy interface for a tree-like structure.
 * It is library/data-structure shape agnostic.
 * It provides a flexible way to represent existing data in a tree-like shape for the UUI internal usage, without repacking data in some specific form.
 */
export interface ITree<TItem, TId> {
    /**
     * Provides a tree configuration.
     */
    getParams(): ITreeParams<TItem, TId>;

    /**
     * Provides item's children and count/totalCount/assumedCount/status of its node.
     * @param parentId - id of an item, which children info should be returned.
     */
    getItems(parentId?: TId): ITreeItemsInfo<TId>;

    /**
     * Item getter. Provides access to the item by its ID.
     * @param id - ID of an item to be returned.
     */
    getById(id: TId): TItem | typeof NOT_FOUND_RECORD;

    /**
     * Accessor to all known items. It may contain records, filtered out of the tree.
     * Items accessor cannot be used to investigate current state of the tree.
     * Instead, use tree.getItems(), in the combination with tree.getById(id).
     */
    getItemsAccessor(): IItemsAccessor<TItem, TId>;
}
