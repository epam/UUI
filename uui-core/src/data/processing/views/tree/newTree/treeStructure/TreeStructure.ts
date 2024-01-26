import { DataRowPathItem, IMap } from '../../../../../../types';
import { TreeNodeInfo, TreeParams, IItemsAccessor } from './types';
import { PureTreeStructure } from './PureTreeStructure';
import { newMap } from './helpers';
import { EMPTY, FULLY_LOADED, NOT_FOUND_RECORD, PARTIALLY_LOADED } from '../constants';
import { ItemsMap } from '../../ItemsMap';
import { ITree, ItemsInfo, TreeNodeStatus } from '../ITree';

export class TreeStructure<TItem, TId> extends PureTreeStructure<TItem, TId> implements ITree<TItem, TId> {
    constructor(
        _params: TreeParams<TItem, TId>,
        protected readonly _itemsAccessor: IItemsAccessor<TItem, TId>,
        _byParentId?: IMap<TId, TId[]>,
        _nodeInfoById?: IMap<TId, TreeNodeInfo>,
    ) {
        super(_params, _byParentId, _nodeInfoById);
    }

    getMissingParents(): TId[] {
        const missingIds = new Set<TId>();
        this.itemsAccessor.forEach((item) => {
            const parentId = this.params.getParentId(item);
            if (parentId != null && !this.itemsAccessor.get(parentId)) {
                missingIds.add(parentId);
            }
        });

        return Array.from(missingIds);
    }

    public get itemsAccessor() {
        return this._itemsAccessor;
    }

    public get params() {
        return this._params;
    }

    public get byParentId() {
        return this._byParentId;
    }

    public get nodeInfoById() {
        return this._nodeInfoById;
    }

    public getRootIds(): TId[] {
        return this.byParentId.get(undefined) || [];
    }

    public getRootItems() {
        return this.getRootIds()
            .map((id) => this.itemsAccessor.get(id)!)
            .filter<TItem>((item): item is TItem => item !== NOT_FOUND_RECORD);
    }

    public getChildren(item: TItem) {
        const id = this.params.getId(item);
        return this.getChildrenByParentId(id);
    }

    public getById(id: TId) {
        return this.itemsAccessor.get(id);
    }

    public getItems(parentId?: TId): ItemsInfo<TId> {
        const ids = this.byParentId.get(parentId) ?? [];
        const { count, totalCount } = this.getNodeInfo(parentId);

        let status: TreeNodeStatus = count === undefined ? PARTIALLY_LOADED : EMPTY;
        if (count !== 0 && ids.length === count) {
            status = FULLY_LOADED;
        }

        return { ids, count, totalCount, status };
    }

    public getChildrenByParentId(parentId: TId) {
        const ids = this.getChildrenIdsByParentId(parentId);
        const children = ids.map((id) => this.itemsAccessor.get(id));
        return children.filter<TItem>((item): item is TItem => item !== NOT_FOUND_RECORD);
    }

    public getChildrenIdsByParentId(parentId: TId) {
        return this.byParentId.get(parentId) || [];
    }

    public getParentIdsRecursive(id: TId) {
        const parentIds: TId[] = [];
        let parentId = id;
        while (true) {
            const item = this.itemsAccessor.get(parentId);
            if (item === NOT_FOUND_RECORD) {
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
            const item = this.itemsAccessor.get(parentId);
            if (item !== NOT_FOUND_RECORD) {
                parents.push(item);
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

    public getTotalCount() {
        let count = undefined;
        for (const [, info] of this.nodeInfoById) {
            if (info.count == null) {
                // TBD: getTotalCount() is used for totalCount, but we can't have correct count until all branches are loaded
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

    private forEach(
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
                const item = this.itemsAccessor.get(id);
                const parentId = item !== NOT_FOUND_RECORD ? this.params.getParentId?.(item) : undefined;
                walkChildrenRec(item === NOT_FOUND_RECORD ? undefined : item, id, parentId);
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

    public static create<TItem, TId>(
        params: TreeParams<TItem, TId>,
        itemsAccessor: IItemsAccessor<TItem, TId>,
        byParentId?: IMap<TId, TId[]>,
        nodeInfoById?: IMap<TId, TreeNodeInfo>,
    ): TreeStructure<TItem, TId> {
        return new TreeStructure(params, itemsAccessor, byParentId, nodeInfoById);
    }

    public static withNewItemsAccessor<TItem, TId>(itemsAccessor: IItemsAccessor<TItem, TId>, treeStructure: TreeStructure<TItem, TId>) {
        return TreeStructure.create<TItem, TId>(treeStructure.params, itemsAccessor, treeStructure.byParentId, treeStructure.nodeInfoById);
    }

    public static createFromItems<TItem, TId>({
        params,
        items,
        itemsAccessor,
    }: {
        params: TreeParams<TItem, TId>,
        items: TItem[] | ItemsMap<TId, TItem>,
        itemsAccessor: IItemsAccessor<TItem, TId>,
    }) {
        const byParentId = newMap<TId, TId[]>(params);

        items.forEach((item) => {
            const parentId = params.getParentId?.(item) ?? undefined;

            if (!byParentId.has(parentId)) {
                byParentId.set(parentId, []);
            }
            const children = byParentId.get(parentId);
            children.push(params.getId(item));

            byParentId.set(parentId, children);
        });

        const newNodeInfoById = newMap<TId, TreeNodeInfo>(params);
        for (const [parentId, ids] of byParentId) {
            newNodeInfoById.set(parentId, { count: ids.length });
        }

        return this.create<TItem, TId>(params, itemsAccessor, byParentId, newNodeInfoById);
    }

    public static toPureTreeStructure<TItem, TId>(treeStructure: TreeStructure<TItem, TId>): PureTreeStructure<TItem, TId> {
        return new PureTreeStructure(treeStructure.params, treeStructure.byParentId, treeStructure.nodeInfoById);
    }
}
