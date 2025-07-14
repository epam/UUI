import { IMap } from '../../../../../types';
import { ITreeNodeInfo, ITreeParams, IItemsAccessor } from './types';
import { newMap } from '../helpers/map';
import { EMPTY, FULLY_LOADED, NOT_FOUND_RECORD, PARTIALLY_LOADED } from '../constants';
import { ItemsMap } from '../ItemsMap';
import { ITree, ITreeItemsInfo, ITreeNodeStatus } from '../ITree';
import { Tree } from '../Tree';

export class TreeStructure<TItem, TId> implements ITree<TItem, TId> {
    constructor(
        private _params: ITreeParams<TItem, TId>,
        private readonly _itemsAccessor: IItemsAccessor<TItem, TId>,
        protected readonly _byParentId: IMap<TId, TId[]> = newMap(_params),
        protected readonly _nodeInfoById: IMap<TId, ITreeNodeInfo> = newMap(_params),
    ) {}

    getItemsAccessor(): IItemsAccessor<TItem, TId> {
        return this.itemsAccessor;
    }

    public get itemsAccessor() {
        return this._itemsAccessor;
    }

    public getParams() {
        return this._params;
    }

    public get byParentId() {
        return this._byParentId;
    }

    public get nodeInfoById() {
        return this._nodeInfoById;
    }

    public getRootItems() {
        return this.getItems(undefined).ids
            .map((id) => this.itemsAccessor.get(id)!)
            .filter<TItem>((item): item is TItem => item !== NOT_FOUND_RECORD);
    }

    public getById(id: TId) {
        return this.itemsAccessor.get(id);
    }

    public getItems(parentId?: TId): ITreeItemsInfo<TId> {
        const currentParentId = parentId ?? undefined;
        const ids = this.byParentId.get(currentParentId) ?? [];
        const { count, ...restNodeInfo } = this.nodeInfoById.get(currentParentId) || {};

        let status: ITreeNodeStatus = count === undefined ? PARTIALLY_LOADED : EMPTY;
        if (count !== 0 && ids.length === count) {
            status = FULLY_LOADED;
        }

        return { ids, count, status, ...restNodeInfo };
    }

    public getChildren(parentId: TId) {
        const { ids } = this.getItems(parentId);
        const children = ids.map((id) => this.itemsAccessor.get(id));
        return children.filter<TItem>((item): item is TItem => item !== NOT_FOUND_RECORD);
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

    public computeSubtotals<TSubtotals>(get: (item: TItem, hasChildren: boolean) => TSubtotals, add: (a: TSubtotals, b: TSubtotals) => TSubtotals) {
        const subtotalsMap = newMap<TId | undefined, TSubtotals>(this.getParams());

        Tree.forEach(
            this,
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
        params: ITreeParams<TItem, TId>,
        itemsAccessor: IItemsAccessor<TItem, TId>,
        byParentId?: IMap<TId, TId[]>,
        nodeInfoById?: IMap<TId, ITreeNodeInfo>,
    ): TreeStructure<TItem, TId> {
        return new TreeStructure(params, itemsAccessor, byParentId, nodeInfoById);
    }

    public static withNewItemsAccessor<TItem, TId>(itemsAccessor: IItemsAccessor<TItem, TId>, treeStructure: TreeStructure<TItem, TId>) {
        return TreeStructure.create<TItem, TId>(treeStructure.getParams(), itemsAccessor, treeStructure.byParentId, treeStructure.nodeInfoById);
    }

    public static createFromItems<TItem, TId>({
        params,
        items,
        itemsAccessor,
    }: {
        params: ITreeParams<TItem, TId>,
        items: TItem[] | ItemsMap<TId, TItem>,
        itemsAccessor: IItemsAccessor<TItem, TId>,
    }) {
        const byParentId = newMap<TId, TId[]>(params);

        const itemsMap = newMap<TId, TItem>(params);

        items.forEach((item) => {
            const parentId = params.getParentId?.(item) ?? undefined;

            if (!byParentId.has(parentId)) {
                byParentId.set(parentId, []);
            }
            const children = byParentId.get(parentId);
            children.push(params.getId(item));

            byParentId.set(parentId, children);
            itemsMap.set(parentId, item);
        });

        const newNodeInfoById = newMap<TId, ITreeNodeInfo>(params);
        for (const [parentId, ids] of byParentId) {
            const assumedCount = itemsMap.has(parentId) ? params.getChildCount?.(itemsMap.get(parentId)) : undefined;
            newNodeInfoById.set(parentId, { count: ids.length, ...(params.getChildCount ? { assumedCount } : {}) });
        }

        // if items is empty, count should be defined, otherwise, loading placeholders will be rendered.
        if (!newNodeInfoById.size) {
            newNodeInfoById.set(undefined, { count: 0 });
        }

        return this.create<TItem, TId>(params, itemsAccessor, byParentId, newNodeInfoById);
    }
}
