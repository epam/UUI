import { EMPTY, FULLY_LOADED, NOT_FOUND_RECORD, PARTIALLY_LOADED } from './constants';
import { TreeParams } from './treeStructure/types';

export type TreeNodeStatus = typeof FULLY_LOADED | typeof PARTIALLY_LOADED | typeof EMPTY;

export interface ItemsInfo<TId> {
    ids: TId[];
    count: null | number;
    totalCount?: number;
    status: TreeNodeStatus;
}

export interface ITree<TItem, TId> {
    getParams(): TreeParams<TItem, TId>;
    getItems(parentId?: TId): ItemsInfo<TId>;
    getById(id: TId): TItem | typeof NOT_FOUND_RECORD;
    getTotalCount(): number | null;
}
