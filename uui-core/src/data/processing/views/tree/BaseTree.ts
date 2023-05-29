import { DataSourceState, IMap, DataRowPathItem } from '../../../../types';
import { CompositeKeysMap } from './CompositeKeysMap';
import {
    ApplyFilterOptions, ApplySearchOptions, ApplySortOptions, ITree, LoadTreeOptions, NOT_FOUND_RECORD, TreeNodeInfo,
} from './ITree';
import { TreeParams } from './ITree';

export function newMap<TKey, TValue>(params: TreeParams<any, any>) {
    if (params.complexIds) {
        return new CompositeKeysMap<TKey, TValue>();
    } else {
        return new Map<TKey, TValue>();
    }
}

export abstract class BaseTree<TItem, TId> implements ITree<TItem, TId> {
    protected getId: (item: TItem) => TId;
    protected getParentId: (item: TItem) => TId | undefined;
    protected constructor(
        protected params: TreeParams<TItem, TId>,
        protected readonly byId: IMap<TId, TItem>,
        protected readonly byParentId: IMap<TId, TId[]>,
        protected readonly nodeInfoById: IMap<TId, TreeNodeInfo>,
    ) {
        this.getId = params.getId;
        this.getParentId = (item: TItem) => params.getParentId?.(item);
    }

    public clearStructure(): ITree<TItem, TId> {
        return this.newInstance(
            this.params,
            this.byId,
            this.newMap(), // add empty children list for root to avoid corner-cases
            this.newMap(),
        );
    }

    protected newInstance(
        params: TreeParams<TItem, TId>,
        byId: IMap<TId, TItem>,
        byParentId: IMap<TId, TId[]>,
        nodeInfoById: IMap<TId, TreeNodeInfo>,
    ): ITree<TItem, TId> {
        if (byId === this.byId && byParentId === this.byParentId && nodeInfoById === this.nodeInfoById) {
            return this;
        }

        return new (this.constructor as any)(params, byId, byParentId, nodeInfoById) as ITree<TItem, TId>;
    }

    public getRootIds(): TId[] {
        return this.byParentId.get(undefined) || [];
    }

    protected newMap<TKey, TValue>() {
        return newMap<TKey, TValue>(this.params);
    }

    public getRootItems() {
        return this.getRootIds().map((id) => this.byId.get(id)!);
    }

    public getById(id: TId): TItem | typeof NOT_FOUND_RECORD {
        if (!this.byId.has(id)) {
            return NOT_FOUND_RECORD;
        }

        return this.byId.get(id);
    }

    public getChildren(item: TItem) {
        const id = this.getId(item);
        return this.getChildrenByParentId(id);
    }

    public getChildrenByParentId(parentId: TId) {
        const ids = this.getChildrenIdsByParentId(parentId);
        const children = ids.map((id) => this.byId.get(id));
        return children;
    }

    public getChildrenIdsByParentId(parentId: TId) {
        return this.byParentId.get(parentId) || [];
    }

    public getParentIdsRecursive(id: TId) {
        const parentIds: TId[] = [];
        let parentId = id;
        while (true) {
            const item = this.byId.get(parentId);
            if (!item) {
                break;
            }
            parentId = this.getParentId(item);
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
            if (this.byId.has(parentId)) {
                parents.push(this.byId.get(parentId));
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
        const parentId = this.getParentId?.(item);
        const id = this.getId(item);

        const ids = this.getChildrenIdsByParentId(parentId);
        const nodeInfo = this.getNodeInfo(parentId);
        const lastId = ids[ids.length - 1];

        const isLastChild = lastId !== undefined && lastId === id && nodeInfo.count === ids.length;

        return {
            id: this.getId(item),
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
        let count = 0;
        for (const [, info] of this.nodeInfoById) {
            if (info.count == null) {
                // TBD: getTotalRecursiveCount() is used for totalCount, but we can't have correct count until all branches are loaded
                // return;
            } else {
                count += info.count;
            }
        }
        return count;
    }

    public forEach(
        action: (item: TItem, id: TId, parentId: TId, stop: () => void) => void,
        optionsParam?: {
            direction?: 'bottom-up' | 'top-down';
            parentId?: TId;
            includeParent?: boolean;
        },
    ) {
        let shouldStop = false;
        const stop = () => {
            shouldStop = true;
        };

        const options: {
            direction?: 'bottom-up' | 'top-down';
            parentId?: TId;
            includeParent?: boolean;
        } = { direction: 'top-down', parentId: undefined, ...optionsParam };
        if (options.includeParent == null) {
            options.includeParent = options.parentId != null;
        }

        const iterateNodes = (ids: TId[]) => {
            if (shouldStop) return;
            ids.forEach((id) => {
                if (shouldStop) return;
                const item = this.byId.get(id);
                const parentId = item ? this.getParentId(item) : undefined;
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

    public computeSubtotals<TSubtotals>(get: (item: TItem, hasChildren: boolean) => TSubtotals, add: (a: TSubtotals, b: TSubtotals) => TSubtotals) {
        const subtotalsMap = this.newMap<TId, TSubtotals>();

        this.forEach(
            (item, id, parentId) => {
                let itemSubtotals = get(item, this.byParentId.has(id));

                // add already computed children subtotals
                const stItem = subtotalsMap.has(id) ? subtotalsMap.get(id) : undefined;
                if (stItem !== undefined) {
                    itemSubtotals = add(itemSubtotals, stItem);
                }

                // store
                subtotalsMap.set(id, itemSubtotals);

                // add value to parent
                let parentSubtotals: TSubtotals;
                const stParent = subtotalsMap.has(parentId) ? subtotalsMap.get(parentId) : undefined;
                if (stParent === undefined) {
                    parentSubtotals = itemSubtotals;
                } else {
                    parentSubtotals = add(itemSubtotals, stParent);
                }
                subtotalsMap.set(parentId, parentSubtotals);
            },
            { direction: 'bottom-up' },
        );
        return subtotalsMap;
    }

    protected cloneMap<TKey, TValue>(map: IMap<TKey, TValue>) {
        return new (map.constructor as any)(map) as IMap<TKey, TValue>;
    }

    protected static truePredicate = () => true;
    public static blank<TItem, TId>(params: TreeParams<TItem, TId>) {
        return new (this as any)(
            params,
            newMap(params),
            newMap(params), // add empty children list for root to avoid corner-cases
            newMap(params),
        ) as ITree<TItem, TId>;
    }

    public static create<TItem, TId>(params: TreeParams<TItem, TId>, items: TItem[] | ITree<TItem, TId>): ITree<TItem, TId> {
        if (items instanceof BaseTree) {
            return items;
        } else {
            // TBD: restore this optimization if needed. TBD: compare node index to detect when items are moved without changing
            // const isItemsEqual = (this.props.items.length === this.tree.getTotalRecursiveCount())
            //     && this.props.items.every((value, index) => value === this.tree.getById(this.props.getId(value)));
            return this.blank(params).patch(items as TItem[]);
        }
    }

    abstract patch(items: TItem[], isDeletedProp?: keyof TItem, comparator?: (newItem: TItem, existingItem: TItem) => number): ITree<TItem, TId>;
    abstract cascadeSelection(
        currentSelection: TId[],
        selectedId: TId,
        isSelected: boolean,
        options: {
            isSelectable: (item: TItem) => boolean;
            cascade: boolean;
        }
    ): TId[];

    abstract load<TFilter>(options: LoadTreeOptions<TItem, TId, TFilter>, value: Readonly<DataSourceState>): Promise<ITree<TItem, TId>>;
    abstract loadMissing<TFilter>(options: LoadTreeOptions<TItem, TId, TFilter>, value: Readonly<DataSourceState>): Promise<ITree<TItem, TId>>;
    abstract loadMissingIdsAndParents<TFilter>(options: LoadTreeOptions<TItem, TId, TFilter>, idsToLoad: TId[]): Promise<ITree<TItem, TId>>;
    abstract filter<TFilter>(options: ApplyFilterOptions<TItem, TId, TFilter>): ITree<TItem, TId>;
    abstract search<TFilter>(options: ApplySearchOptions<TItem, TId, TFilter>): ITree<TItem, TId>;
    abstract sort<TFilter>(options: ApplySortOptions<TItem, TId, TFilter>): ITree<TItem, TId>;
}
