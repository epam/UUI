import { NOT_FOUND_RECORD } from '../../constants';

export interface IItemsAccessor<TItem, TId> {
    get: (id: TId) => TItem | typeof NOT_FOUND_RECORD;
    forEach: (action: (item: TItem, id: TId) => void) => void;
}

export interface ITreeParams<TItem, TId> {
    getId(item: TItem): TId;
    getParentId?(item: TItem): TId | undefined;
    getChildCount?(item: TItem): number;
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
