import { DataRowPathItem, IMap } from '../../../../../../types';
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

export interface ITreeStructure<TItem, TId> {
    getRootIds(): TId[];
    getRootItems(): TItem[];
    getChildren(item: TItem): TItem[];
    getChildrenByParentId(parentId: TId): TItem[];
    getChildrenIdsByParentId(parentId: TId): TId[];
    getParentIdsRecursive(id: TId): TId[];
    getParents(id: TId): TItem[];
    getPathById(id: TId): DataRowPathItem<TId, TItem>[];
    getPathItem(item: TItem): DataRowPathItem<TId, TItem>;
    getNodeInfo(id: TId): TreeNodeInfo | {};
    isFlatList(): boolean;
    getTotalRecursiveCount(): number | null;
    forEachChildren(action: (id: TId) => void, isSelectable: (item: TItem) => boolean, parentId?: TId, includeParent?: boolean): void;
    forEach(
        action: (item: TItem, id: TId, parentId: TId, stop: () => void) => void,
        options?: {
            direction?: 'bottom-up' | 'top-down';
            parentId?: TId;
            includeParent?: boolean;
        },
    ): void;
    computeSubtotals<TSubtotals>(
        get: (item: TItem, hasChildren: boolean) => TSubtotals,
        add: (a: TSubtotals, b: TSubtotals) => TSubtotals,
    ): IMap<TId | undefined, TSubtotals>;

    get byParentId(): IMap<TId, TId[]>;
    get nodeInfoById(): IMap<TId, TreeNodeInfo>;
    get params(): TreeParams<TItem, TId>;
    get itemsAccessor(): ItemsAccessor<TItem, TId>;
}
