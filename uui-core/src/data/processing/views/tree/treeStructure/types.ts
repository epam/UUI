import { NOT_FOUND_RECORD } from '../constants';

export interface IItemsAccessor<TItem, TId> {
    get: (id: TId) => TItem | typeof NOT_FOUND_RECORD;
    forEach: (action: (item: TItem, id: TId) => void) => void;
}

/**
 * ITree configuration.
 */
export interface ITreeParams<TItem, TId> {
    /**
     * Item ID getter.
     */
    getId(item: TItem): TId;
    /**
     * Item parent ID getter.
     */
    getParentId?(item: TItem): TId | undefined;
    /**
     * Item child count getter.
     * @param item - item, which children count should be returned.
     * @returns assumed children count. If unknown, it is better to return 1.
     */
    getChildCount?(item: TItem): number;
    /**
     * Enables support of ids of types Object, Array, etc.
     */
    complexIds?: boolean;
}
/**
 * Info of the tree node.
 */
export interface ITreeNodeInfo {
    /**
     * Count of the records, returned from server or explicitly counted from data.
     * If undefined, not all data is loaded from server.
     */
    count?: number;
    /**
     * Total count of the records. Usually, is returned from server on a root node fetch.
     */
    totalCount?: number;
    /**
     * Assumed count, got from the `getChildCount` result.
     */
    assumedCount?: number;
}
