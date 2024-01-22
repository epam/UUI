import { NOT_FOUND_RECORD } from '../constants';

export interface ItemsAccessor<TItem, TId> {
    get: (id: TId) => TItem | typeof NOT_FOUND_RECORD;
}

export interface TreeParams<TItem, TId> {
    getId?(item: TItem): TId;
    getParentId?(item: TItem): TId | undefined;
    complexIds?: boolean;
}

export interface TreeNodeInfo {
    count?: number;
    totalCount?: number;
}
