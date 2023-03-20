import { DataSourceState, IMap, DataRowPathItem } from "../../../../types";
import { createSubtotalRecord, SubtotalsConfig, SubtotalsRecord } from "../subtotals";
import { CompositeKeysMap } from "./CompositeKeysMap";
import { ApplyFilterOptions, ApplySearchOptions, ApplySortOptions, ITree, LoadTreeOptions, TreeNodeInfo } from "./ITree";
import { TreeParams } from "./ITree";
import { Tree } from "./Tree";

type ComputedSubtotals<TId, TSubtotals> = CompositeKeysMap<TId, TSubtotals> | Map<TId, TSubtotals>;

export function newMap<TKey, TValue>(params: TreeParams<any, any>) {
    if (params.complexIds) {
        return new CompositeKeysMap<TKey, TValue>();
    } else {
        return new Map<TKey, TValue>();
    }
}

export abstract class BaseTree<TItem, TId, TSubtotals = void> implements ITree<TItem, TId, TSubtotals> {
    protected getId: (item: TItem) => TId;
    protected getParentId: (item: TItem) => TId;

    protected constructor(
        protected params: TreeParams<TItem, TId>,
        public readonly byId: IMap<TId, TItem>,
        protected readonly byParentId: IMap<TId, TId[]>,
        protected readonly nodeInfoById: IMap<TId, TreeNodeInfo>,
        protected readonly subtotals: IMap<TId, SubtotalsRecord<TSubtotals, TId>> | undefined,
    ) {
        this.getId = params.getId;
        this.getParentId = params.getParentId
            ? ((item: TItem) => (params.getParentId(item) ?? undefined))
            : () => undefined;
    }

    public clearStructure(): ITree<TItem, TId, TSubtotals> {
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
        subtotals?: IMap<TId, SubtotalsRecord<TSubtotals, TId>>,
    ): ITree<TItem, TId, TSubtotals> {
        if (
            byId === this.byId
            && byParentId === this.byParentId
            && nodeInfoById === this.nodeInfoById
            && subtotals === this.subtotals
        ) {
            return this;
        }

        return new (this.constructor as any)(
            params, byId, byParentId, nodeInfoById, subtotals,
        ) as ITree<TItem, TId, TSubtotals>;
    }

    public getRootIds(): TId[] {
        return this.byParentId.get(undefined) || [];
    }

    protected newMap<TKey, TValue>() {
        return newMap<TKey, TValue>(this.params);
    }

    public getRootItems() {
        return this.getRootIds().map(id => this.byId.get(id)!);
    }

    public getById(id: TId) {
        return this.byId.get(id);
    }

    public getChildren(item: TItem) {
        const id = this.getId(item);
        return this.getChildrenByParentId(id);
    }

    public getChildrenByParentId(parentId: TId) {
        const ids = this.getChildrenIdsByParentId(parentId);
        const children = ids.map(id => this.byId.get(id));
        return children;
    }

    public getChildrenIdsByParentId(parentId: TId) {
        return this.byParentId.get(parentId) || [];
    }

    public getParentIdsRecursive(id: TId) {
        const parentIds: TId[] = [];
        while (true) {
            let item = this.byId.get(id);
            if (!item) {
                break;
            }
            id = this.getParentId(item);
            if (!id) {
                break;
            }
            parentIds.unshift(id);
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
        const id = this.getId?.(item);

        const ids = this.getChildrenIdsByParentId(parentId);
        const nodeInfo = this.getNodeInfo(parentId);
        const lastId = ids[ids.length - 1];

        const isLastChild =
            lastId !== undefined && lastId === id
            && nodeInfo.count === ids.length;

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
        for (const [id, info] of this.nodeInfoById) {
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
        action: (item: TItem, id: TId, parentId: TId) => void,
        options?: {
            direction?: 'bottom-up' | 'top-down',
            parentId?: TId,
            includeParent?: boolean,
        },
    ) {
        options = { direction: 'top-down', parentId: undefined, ...options };
        if (options.includeParent == null) {
            options.includeParent = options.parentId != null;
        }

        const iterateNodes = (ids: TId[]) => {
            ids.forEach(id => {
                const item = this.byId.get(id);
                const parentId = item ? this.getParentId(item) : undefined;
                walkChildrenRec(item, id, parentId);
            });
        };

        const walkChildrenRec = (item: TItem, id: TId, parentId: TId) => {
            if (options.direction === 'top-down') {
                action(item, id, parentId);
            }
            const childrenIds = this.byParentId.get(id);
            childrenIds && iterateNodes(childrenIds);
            if (options.direction === 'bottom-up') {
                action(item, id, parentId);
            }
        };

        if (options.includeParent) {
            iterateNodes([options.parentId]);
        } else {
            iterateNodes(this.getChildrenIdsByParentId(options.parentId));
        }
    }

    public computeSubtotals(
        get: (item: TItem, hasChildren: boolean) => TSubtotals[keyof TSubtotals],
        add: (a: TSubtotals[keyof TSubtotals], b: TSubtotals[keyof TSubtotals]) => TSubtotals[keyof TSubtotals],
    ): ComputedSubtotals<TId, TSubtotals[keyof TSubtotals]> {
        const subtotalsMap = this.newMap<TId | undefined, TSubtotals[keyof TSubtotals]>();

        this.forEach((item, id, parentId) => {
            let itemSubtotals = get(item, this.byParentId.has(id));

            // add already computed children subtotals
            if (subtotalsMap.has(id)) {
                itemSubtotals = add(itemSubtotals, subtotalsMap.get(id));
            }

            // store
            subtotalsMap.set(id, itemSubtotals);

            // add value to parent
            let parentSubtotals: TSubtotals[keyof TSubtotals];
            if (!subtotalsMap.has(parentId)) {
                parentSubtotals = itemSubtotals;
            } else {
                parentSubtotals = add(itemSubtotals, subtotalsMap.get(parentId));
            }
            subtotalsMap.set(parentId, parentSubtotals);
        }, { direction: 'bottom-up' });
        return subtotalsMap;
    }


    public withSubtotals({ shouldCompute, schema }: SubtotalsConfig<TItem, TSubtotals>) {
        const subtotalProps = Object.keys(schema) as Array<keyof TSubtotals>;
        const computedSubtotals = {} as Record<keyof TSubtotals, ComputedSubtotals<TId, TSubtotals[keyof TSubtotals]>>;

        subtotalProps.forEach((subtotalProp) => {
            computedSubtotals[subtotalProp] = this.computeSubtotals(schema[subtotalProp].get, schema[subtotalProp].compute);
        });

        const subtotalsByParents = this.newMap<TId, SubtotalsRecord<TSubtotals, TId>>();

        for (const [parentId] of this.byParentId) {
            const parent = this.getById(parentId);
            if (shouldCompute?.(parent) ?? true) {
                const subtotalsRecord = {} as TSubtotals;
                subtotalProps.forEach((subtotalProp) => {
                    subtotalsRecord[subtotalProp] = computedSubtotals[subtotalProp].get(parentId);
                });

                if (subtotalsRecord && typeof subtotalsRecord === 'object') {
                    subtotalsByParents.set(parentId, createSubtotalRecord(parentId, subtotalsRecord) as SubtotalsRecord<TSubtotals, TId>);
                }
            }
        }

        return this.newInstance(this.params, this.byId, this.byParentId, this.nodeInfoById, subtotalsByParents);
    }

    protected cloneMap<TKey, TValue>(map: IMap<TKey, TValue>) {
        return new (map.constructor as any)(map) as IMap<TKey, TValue>;
    }

    protected static truePredicate = () => true;

    public static blank<TItem, TId, TSubtotals = void>(params: TreeParams<TItem, TId>) {
        return new (this as any)(
            params,
            newMap(params),
            newMap(params), // add empty children list for root to avoid corner-cases
            newMap(params),
        ) as ITree<TItem, TId, TSubtotals>;
    }

    public setSubtotals(subtotals?: IMap<TId, SubtotalsRecord<TSubtotals, TId>>) {
        return this.newInstance(this.params, this.byId, this.byParentId, this.nodeInfoById, subtotals);
    }

    public getSubtotalRecordByParentId(parentId: TId) {
        return this.subtotals?.has(parentId) ? this.subtotals.get(parentId) : undefined;
    }

    public static create<TItem, TId, TSubtotals = void>(
        params: TreeParams<TItem, TId>,
        items: TItem[] | ITree<TItem, TId, TSubtotals>,
        subtotals?: IMap<TId, SubtotalsRecord<TSubtotals, TId>>,
    ): ITree<TItem, TId, TSubtotals> {
        if (items instanceof Tree) {
            return items as ITree<TItem, TId, TSubtotals>;
        } else {
            // TBD: restore this optimization if needed. TBD: compare node index to detect when items are moved without changing
            // const isItemsEqual = (this.props.items.length === this.tree.getTotalRecursiveCount())
            //     && this.props.items.every((value, index) => value === this.tree.getById(this.props.getId(value)));
            return this.blank<TItem, TId, TSubtotals>(params)
                .setSubtotals(subtotals)
                .patch(items as TItem[]);
        }
    }

    abstract patch(
        items: TItem[],
        isDeletedProp?: keyof TItem,
        comparator?: (newItem: TItem, existingItem: TItem) => number,
    ): ITree<TItem, TId, TSubtotals>;

    abstract cascadeSelection(
        currentSelection: TId[],
        selectedId: TId,
        isSelected: boolean,
        options: {
            isSelectable: (item: TItem) => boolean,
            cascade: boolean,
        },
    ): TId[];

    abstract load<TFilter>(
        options: LoadTreeOptions<TItem, TId, TFilter>,
        value: Readonly<DataSourceState>,
    ): Promise<ITree<TItem, TId, TSubtotals>>;

    abstract loadMissing<TFilter>(
        options: LoadTreeOptions<TItem, TId, TFilter>,
        value: Readonly<DataSourceState>,
    ): Promise<ITree<TItem, TId, TSubtotals>>;

    abstract loadMissingIdsAndParents<TFilter>(
        options: LoadTreeOptions<TItem, TId, TFilter>,
        idsToLoad: TId[],
    ): Promise<ITree<TItem, TId, TSubtotals>>;

    abstract filter<TFilter>(options: ApplyFilterOptions<TItem, TId, TFilter>): ITree<TItem, TId, TSubtotals>;
    abstract search<TFilter>(options: ApplySearchOptions<TItem, TId, TFilter>): ITree<TItem, TId, TSubtotals>;
    abstract sort<TFilter>(options: ApplySortOptions<TItem, TId, TFilter>): ITree<TItem, TId, TSubtotals>;
}