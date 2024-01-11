import { DataRowPathItem, IMap } from '../../../../../types';
import { ItemsMap } from '../../../ItemsMap';
import { ItemsStorage } from '../../../ItemsStorage';
import { newMap } from '../BaseTree';
import { NOT_FOUND_RECORD, TreeNodeInfo, TreeParams } from '../ITree';

export class BaseTreeSnapshot<TItem, TId> {
    protected constructor(
        protected params: TreeParams<TItem, TId>,
        protected _itemsMap: ItemsMap<TId, TItem>,
        protected setItems: ItemsStorage<TItem, TId>['setItems'],
        protected readonly byParentId?: IMap<TId, TId[]>,
        protected readonly nodeInfoById?: IMap<TId, TreeNodeInfo>,
    ) {
        this.byParentId = byParentId ?? newMap(params);
        this.nodeInfoById = nodeInfoById ?? newMap(params);
    }

    public get itemsMap() {
        return this.itemsMap;
    }

    public set itemsMap(newItemsMap: ItemsMap<TId, TItem>) {
        this._itemsMap = newItemsMap;
    }

    public getRootIds(): TId[] {
        return this.byParentId.get(undefined) || [];
    }

    public getRootItems() {
        return this.getRootIds().map((id) => this._itemsMap.get(id)!);
    }

    public getById(id: TId): TItem | typeof NOT_FOUND_RECORD {
        if (!this._itemsMap.has(id)) {
            return NOT_FOUND_RECORD;
        }

        return this._itemsMap.get(id);
    }

    public getChildren(item: TItem) {
        const id = this.params.getId(item);
        return this.getChildrenByParentId(id);
    }

    public getChildrenByParentId(parentId: TId) {
        const ids = this.getChildrenIdsByParentId(parentId);
        const children = ids.map((id) => this._itemsMap.get(id));
        return children;
    }

    public getChildrenIdsByParentId(parentId: TId) {
        return this.byParentId.get(parentId) || [];
    }

    public getParentIdsRecursive(id: TId) {
        const parentIds: TId[] = [];
        let parentId = id;
        while (true) {
            const item = this._itemsMap.get(parentId);
            if (!item) {
                break;
            }
            parentId = this.params.getParentId?.(item);
            if (!parentId) {
                break;
            }
            parentIds.unshift(parentId);
        }
        return parentIds;
    }

    public getParents(id: TId) {
        const parentIds = this.getParentIdsRecursive(id);
        const parents: TItem[] = [];
        parentIds.forEach((parentId) => {
            if (this._itemsMap.has(parentId)) {
                parents.push(this._itemsMap.get(parentId));
            }
        });

        return parents;
    }

    public getPathById(id: TId): DataRowPathItem<TId, TItem>[] {
        const foundParents = this.getParents(id);
        const path: DataRowPathItem<TId, TItem>[] = [];
        foundParents.forEach((parent) => {
            const pathItem: DataRowPathItem<TId, TItem> = this.getPathItem(parent);
            path.push(pathItem);
        });
        return path;
    }

    public getPathItem(item: TItem): DataRowPathItem<TId, TItem> {
        const parentId = this.params.getParentId?.(item);
        const id = this.params.getId?.(item);

        const ids = this.getChildrenIdsByParentId(parentId);
        const nodeInfo = this.getNodeInfo(parentId);
        const lastId = ids[ids.length - 1];

        const isLastChild = lastId !== undefined && lastId === id && nodeInfo.count === ids.length;

        return {
            id: this.params.getId(item),
            value: item,
            isLastChild,
        };
    }

    public getNodeInfo(id: TId) {
        return this.nodeInfoById.get(id) || {};
    }

    public isFlatList() {
        return this.byParentId.size <= 1;
    }

    public getTotalRecursiveCount() {
        let count = undefined;
        for (const [, info] of this.nodeInfoById) {
            if (info.count == null) {
                // TBD: getTotalRecursiveCount() is used for totalCount, but we can't have correct count until all branches are loaded
                return null;
            } else {
                if (count === undefined) {
                    count = 0;
                }
                count += info.count;
            }
        }
        return count;
    }

    public forEachChildren(action: (id: TId) => void, isSelectable: (item: TItem) => boolean, parentId?: TId, includeParent: boolean = true) {
        this.forEach(
            (item, id) => {
                if (item && isSelectable(item)) {
                    action(id);
                }
            },
            { parentId: parentId, includeParent },
        );
    }

    public forEach(
        action: (item: TItem, id: TId, parentId: TId, stop: () => void) => void,
        options?: {
            direction?: 'bottom-up' | 'top-down';
            parentId?: TId;
            includeParent?: boolean;
        },
    ) {
        let shouldStop = false;
        const stop = () => {
            shouldStop = true;
        };

        options = { direction: 'top-down', parentId: undefined, ...options };
        if (options.includeParent == null) {
            options.includeParent = options.parentId != null;
        }

        const iterateNodes = (ids: TId[]) => {
            if (shouldStop) return;
            ids.forEach((id) => {
                if (shouldStop) return;
                const item = this._itemsMap.get(id);
                const parentId = item ? this.params.getParentId?.(item) : undefined;
                walkChildrenRec(item, id, parentId);
            });
        };

        const walkChildrenRec = (item: TItem, id: TId, parentId: TId) => {
            if (options.direction === 'top-down') {
                action(item, id, parentId, stop);
            }
            const childrenIds = this.byParentId.get(id);
            childrenIds && iterateNodes(childrenIds);
            if (options.direction === 'bottom-up') {
                action(item, id, parentId, stop);
            }
        };

        if (options.includeParent) {
            iterateNodes([options.parentId]);
        } else {
            iterateNodes(this.getChildrenIdsByParentId(options.parentId));
        }
    }

    public forEachItem(action: (item: TItem, id: TId, parentId: TId) => void) {
        this.itemsMap.forEach((item, id) => {
            action(item, id, this.params.getParentId?.(item));
        });
    }

    public computeSubtotals<TSubtotals>(get: (item: TItem, hasChildren: boolean) => TSubtotals, add: (a: TSubtotals, b: TSubtotals) => TSubtotals) {
        const subtotalsMap = newMap<TId | undefined, TSubtotals>(this.params);

        this.forEach(
            (item, id, parentId) => {
                let itemSubtotals = get(item, this.byParentId.has(id));

                // add already computed children subtotals
                if (subtotalsMap.has(id)) {
                    itemSubtotals = add(itemSubtotals, subtotalsMap.get(id));
                }

                // store
                subtotalsMap.set(id, itemSubtotals);

                // add value to parent
                let parentSubtotals: TSubtotals;
                if (!subtotalsMap.has(parentId)) {
                    parentSubtotals = itemSubtotals;
                } else {
                    parentSubtotals = add(itemSubtotals, subtotalsMap.get(parentId));
                }
                subtotalsMap.set(parentId, parentSubtotals);
            },
            { direction: 'bottom-up' },
        );
        return subtotalsMap;
    }
}
