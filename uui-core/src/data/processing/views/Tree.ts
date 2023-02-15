import { DataRowPathItem, DataSourceState, IMap, LazyDataSourceApiRequestContext, LazyDataSourceApiRequestRange } from "../../../types";
import { LazyListViewProps } from "./LazyListView";
import { CompositeKeysMap } from './CompositeKeysMap';

export interface TreeParams<TItem, TId> {
    getId?(item: TItem): TId;
    getParentId?(item: TItem): TId | undefined;
    complexIds?: boolean;
}

export interface LoadTreeOptions<TItem, TId, TFilter> extends
    Pick<
        LazyListViewProps<TItem, TId, TFilter>,
        'api' | 'getChildCount' | 'filter' | 'fetchStrategy' | 'flattenSearchResults'
    > {
    loadAllChildren?(id: TId): boolean;
    isFolded?: (item: TItem) => boolean;
}

export interface TreeNodeInfo {
    count?: number;
}

//     <TItem, TId> {
//     api?: LazyDataSourceApi<TItem, TId, TFilter>;
//     filter?: TFilter;
//     page?: number;
//     pageSize?: number;
//     getChildCount?(item: TItem): number | undefined;
//     flattenSearchResults?: boolean;
// }

function newMap<TKey, TValue>(params: TreeParams<any, any>) {
    if (params.complexIds) {
        return new CompositeKeysMap<TKey, TValue>();
    } else {
        return new Map<TKey, TValue>();
    }
}

export class Tree<TItem, TId> {
    private getId: (item: TItem) => TId;
    private getParentId: (item: TItem) => TId;

    private constructor(
        private params: TreeParams<TItem, TId>,
        private readonly byId: IMap<TId, TItem>,
        private readonly byParentId: IMap<TId, TId[]>,
        private readonly nodeInfoById: IMap<TId, TreeNodeInfo>,
    ) {
        this.getId = params.getId;
        this.getParentId = params.getParentId
            ? ((item: TItem) => (params.getParentId(item) ?? undefined))
            : () => undefined;
    }

    public static blank<TItem, TId>(params: TreeParams<TItem, TId>) {
        return new Tree<TItem, TId>(
            params,
            newMap(params),
            newMap(params), // add empty children list for root to avoid corner-cases
            newMap(params),
        );
    }

    public static create<TItem, TId>(params: TreeParams<TItem, TId>, items: TItem[] | Tree<TItem, TId>): Tree<TItem, TId> {
        if (items instanceof Tree) {
            return items;
        } else {
            // TBD: restore this optimization if needed. TBD: compare node index to detect when items are moved without changing
            // const isItemsEqual = (this.props.items.length === this.tree.getTotalRecursiveCount())
            //     && this.props.items.every((value, index) => value === this.tree.getById(this.props.getId(value)));

            return Tree.blank(params).append(items);
        }
    }

    public clearStructure() {
        return new Tree<TItem, TId>(
            this.params,
            this.byId,
            this.newMap(), // add empty children list for root to avoid corner-cases
            this.newMap(),
        );
    }

    public getRootIds() {
        return this.byParentId.get(undefined) || [];
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

    public getNodeInfo(id: TId) {
        return this.nodeInfoById.get(id) || {};
    }

    public getTotalRecursiveCount() {
        let count = 0;
        for (var [id, info] of this.nodeInfoById) {
            if (info.count == null) {
                // TBD: getTotalRecursiveCount() is used for totalCount, but we can't have correct count until all branches are loaded
                // return;
            } else {
                count += info.count;
            }
        }
        return count;
    }

    public getParentIdsRecursive(id: TId) {
        const parentIds: TId[] = [];
        while (true) {
            let item = this.byId.get(id);
            if (!item) {
                break;
            }
            id = this.getParentId(item)
            if (!id) {
                break;
            }
            parentIds.unshift(id);
        };
        return parentIds;
    }

    public forEach(
        action: (item: TItem, id: TId, parentId: TId) => void,
        options?: {
            direction?: 'bottom-up' | 'top-down',
            parentId?: TId,
            includeParent?: boolean,
        }
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
        }

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

    public computeSubtotals<TSubtotals>(
        get: (item: TItem, hasChildren: boolean) => TSubtotals,
        add: (a: TSubtotals, b: TSubtotals) => TSubtotals,
    ) {
        const subtotalsMap = this.newMap<TId | undefined, TSubtotals>();

        this.forEach((item, id, parentId) => {
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
        }, { direction: 'bottom-up' })
        return subtotalsMap;
    }

    public isFlatList() {
        return this.byParentId.size <= 1;
    }

    public append(itemsToAdd: TItem[]) {
        if (!itemsToAdd || itemsToAdd.length === 0) {
            return this;
        }

        const newById = this.cloneMap(this.byId);
        const newByParentId = this.cloneMap(this.byParentId); // shallow clone, still need to copy arrays inside!

        itemsToAdd.forEach((item) => {
            const id = this.getId(item);
            const existingItem = this.byId.get(id);
            if (!existingItem || existingItem !== item) {
                const id = this.getId(item);
                newById.set(id, item);

                const parentId = this.getParentId(item);
                const existingItemParentId = existingItem ? this.getParentId(existingItem) : undefined;

                if (!existingItem || parentId != existingItemParentId) {
                    let list = newByParentId.get(parentId);
                    if (!list) {
                        list = [];
                        newByParentId.set(parentId, list);
                    } else if (list === this.byParentId.get(parentId)) { // need to create shallow copy
                        list = [...list];
                        newByParentId.set(parentId, list);
                    }
                    list.push(id);

                    // TBD: remove item from existing list (if we'll use this method to mutate existing list)
                }
            }
        });
        const newNodeInfoById = this.newMap<TId, TreeNodeInfo>();

        for (let [parentId, ids] of newByParentId) {
            newNodeInfoById.set(parentId, { count: ids.length });
        }

        return new Tree(
            this.params,
            newById,
            newByParentId,
            newNodeInfoById,
        );
    }

    static truePredicate = () => true;

    public cascadeSelection(
        currentSelection: TId[],
        selectedId: TId,
        isSelected: boolean,
        options: {
            isSelectable: (item: TItem) => boolean,
            cascade: boolean,
        }
    ) {
        let selectedIdsMap = this.newMap<TId, boolean>();
        currentSelection.forEach(id => selectedIdsMap.set(id, true));

        options = { isSelectable: Tree.truePredicate, cascade: true, ...options };

        const forEachChildren = (action: (id: TId) => void) => {
            this.forEach((item, id) => {
                if (options.isSelectable(item)) {
                    action(id);
                }
            }, { parentId: selectedId });
        };

        if (isSelected) {
            if (selectedId != null) {
                selectedIdsMap.set(selectedId, true);
            }

            if (options.cascade) {
                // check all children recursively
                forEachChildren(id => selectedIdsMap.set(id, true));

                // check parents if all children is checked
                this.getParentIdsRecursive(selectedId).reverse().forEach(parentId => {
                    const childrenIds = this.getChildrenIdsByParentId(parentId);

                    if (childrenIds && childrenIds.every(childId => selectedIdsMap.has(childId))) {
                        selectedIdsMap.set(parentId, true);
                    }
                });
            }
        } else {
            if (selectedId != null) {
                selectedIdsMap.delete(selectedId);
            }

            if (options.cascade) {
                // uncheck all parents recursively
                this.getParentIdsRecursive(selectedId).forEach(parentId => selectedIdsMap.delete(parentId));
                // uncheck all children recursively
                forEachChildren(id => selectedIdsMap.delete(id));
            }
        }

        const result = [];
        for (var [id, value] of selectedIdsMap) {
            value && result.push(id);
        }

        return result;
    }

    public async load<TFilter>(
        options: LoadTreeOptions<TItem, TId, TFilter>,
        value: Readonly<DataSourceState>,
    ) {
        let tree = await this.loadMissing(options, value);
        tree = await tree.loadMissingIdsAndParents(options, value.checked);
        return tree;
    }

    public async loadMissing<TFilter>(
        options: LoadTreeOptions<TItem, TId, TFilter>,
        value: Readonly<DataSourceState>,
    ) {
        const requiredRowsCount = value.topIndex + value.visibleCount;

        let byId: IMap<TId, TItem> = this.byId;
        let byParentId = this.byParentId;
        let nodeInfoById = this.nodeInfoById;

        const flatten = value.search && options.flattenSearchResults;

        const loadRecursive = async (
            parentId: TId,
            parent: TItem,
            parentLoadAll: boolean,
            remainingRowsCount: number,
        ) => {
            let recursiveLoadedCount = 0;
            const currentIds = byParentId.get(parentId);
            const currentNodeInfo = this.nodeInfoById.get(parentId);
            const { ids, nodeInfo, loadedItems } = await this.loadItems(
                currentIds,
                currentNodeInfo,
                options,
                parentId,
                parent,
                value,
                remainingRowsCount,
                parentLoadAll,
            );

            if (ids != currentIds || nodeInfo != currentNodeInfo) {
                byParentId = (byParentId == this.byParentId) ? this.cloneMap(byParentId) : byParentId;
                byParentId.set(parentId, ids);
                nodeInfoById = (nodeInfoById == this.nodeInfoById) ? this.cloneMap(nodeInfoById) : nodeInfoById;
                nodeInfoById.set(parentId, nodeInfo);
            }

            recursiveLoadedCount += ids.length;

            if (loadedItems.length > 0) {
                // Clone the map if it's not cloned yet
                byId = (byId == this.byId) ? this.cloneMap(byId) : byId;

                loadedItems.forEach(item => {
                    const id = this.getId(item);
                    byId.set(id, item);
                });
            }

            if (!flatten && options.getChildCount) {
                const childrenPromises: Promise<any>[] = [];

                for (let n = 0; n < ids.length; n++) {
                    const id = ids[n];
                    const item = byId.get(id);

                    let isFolded = false;
                    let hasChildren = false;

                    if (options.getChildCount) { // not a root node
                        let childrenCount = options.getChildCount(item);
                        if (childrenCount) { // foldable
                            isFolded = options.isFolded(item);
                            hasChildren = true;
                        }
                    }

                    let loadAll = parentLoadAll || (hasChildren && options.loadAllChildren && options.loadAllChildren(id));

                    remainingRowsCount--;

                    if (hasChildren && ((!isFolded && remainingRowsCount > 0) || loadAll)) {
                        const childPromise = loadRecursive(id, item, loadAll, remainingRowsCount);

                        childrenPromises.push(childPromise);

                        if (options.fetchStrategy == 'sequential') {
                            const loadedCount = await childPromise;
                            remainingRowsCount -= loadedCount;
                            recursiveLoadedCount += loadedCount;
                        }
                    }
                }

                const childCounts = await Promise.all(childrenPromises);
                if (options.fetchStrategy == 'parallel') {
                    const recursiveChildrenCount = childCounts.reduce((a, b) => a + b, 0);
                    recursiveLoadedCount += recursiveChildrenCount;
                    remainingRowsCount -= recursiveChildrenCount;
                }
            }

            return recursiveLoadedCount;
        }

        await loadRecursive(undefined, undefined, options?.loadAllChildren?.(undefined), requiredRowsCount);

        if (byId !== this.byId || byParentId !== this.byParentId || nodeInfoById !== this.nodeInfoById) {
            return new Tree(
                this.params,
                byId,
                byParentId,
                nodeInfoById,
            );
        } else {
            return this;
        }
    }

    private async loadItems<TFilter>(
        inputIds: TId[],
        inputNodeInfo: TreeNodeInfo,
        options: LoadTreeOptions<TItem, TId, TFilter>,
        parentId: TId,
        parent: TItem,
        value: Readonly<DataSourceState>,
        requiredRowsCount: number,
        loadAll: boolean,
    ) {
        let ids = inputIds || [];
        let nodeInfo = inputNodeInfo || {};
        let loadedItems: TItem[] = [];

        const flatten = value.search && options.flattenSearchResults;

        // Selection cascading forces to load all nodes under particular node
        if (loadAll) {
            requiredRowsCount = Number.MAX_SAFE_INTEGER;
        }

        let missingCount = requiredRowsCount - ids.length;

        let availableCount = nodeInfo.count != null ? (nodeInfo.count - ids.length) : missingCount;

        const range: LazyDataSourceApiRequestRange = { from: ids.length };

        if (!loadAll) {
            range.count = missingCount;
        }

        if (missingCount > 0 && availableCount > 0) { // Need to load additional items in the current layer
            let requestContext: LazyDataSourceApiRequestContext<TItem, TId> = {};

            if (!flatten) {
                if (parent != null) {
                    requestContext.parentId = parentId;
                    requestContext.parent = parent;
                } else {
                    // in flatten mode, we don't set parent and parentId even for root - as we don't want to limit results to top-level nodes only
                    requestContext.parentId = null;
                    requestContext.parent = null;
                }
            }

            const response = await options.api({
                sorting: value.sorting,
                search: value.search,
                filter: options.filter,
                range,
                page: value.page,
                pageSize: value.pageSize,
            }, requestContext);

            const from = (response.from == null) ? range.from : response.from;

            if (response.items.length) {
                ids = [...ids];
                for (let n = 0; n < response.items.length; n++) {
                    const item = response.items[n];
                    loadedItems.push(item);
                    const id = this.getId(item);
                    ids[n + from] = id;
                }
            }

            let newNodesCount;

            if (response.count !== null && response.count !== undefined) {
                newNodesCount = response.count;
            } else if (response.items.length < missingCount) {
                newNodesCount = from + response.items.length;
            }

            if (newNodesCount !== nodeInfo.count) {
                nodeInfo = { ...nodeInfo, count: newNodesCount };
            }
        }

        return {
            ids,
            nodeInfo,
            loadedItems,
        }
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

    private async loadMissingIdsAndParents<TFilter>(
        options: LoadTreeOptions<TItem, TId, TFilter>,
        idsToLoad: TId[],
    ): Promise<Tree<TItem, TId>> {
        let byId = this.byId;
        let iteration = 0;
        while (true) {
            let missingIds = new Set<TId>();

            if (idsToLoad && idsToLoad.length > 0) {
                idsToLoad.forEach(id => {
                    if (!byId.has(id)) {
                        missingIds.add(id);
                    }
                })
            }

            if (this.params.getParentId) {
                for (let [, item] of byId) {
                    const parentId = this.getParentId(item);
                    if (parentId != null && !byId.has(parentId)) {
                        missingIds.add(parentId);
                    }
                }
            }

            if (missingIds.size === 0) {
                break;
            } else {
                const ids = Array.from(missingIds);
                const response = await options.api({ ids });
                if (response.items.length != ids.length) {
                    throw new Error("LazyTree: api does not returned requested items. Check that you handle 'ids' argument correctly.");
                }

                // Clone before first update
                byId = (byId == this.byId) ? this.cloneMap(byId) : byId;

                response.items.forEach(item => {
                    byId.set(this.getId(item), item);
                })
            }
            iteration++;

            if (iteration > 1000) {
                throw new Error('LazyTree: More than 1000 iterations are made to load required items and their parents by ID. Check your api implementation');
            }
        }

        if (byId == this.byId) {
            return this;
        } else {
            return new Tree(
                this.params,
                byId,
                this.byParentId,
                this.nodeInfoById,
            )
        }
    }

    private newMap<TKey, TValue>() {
        return newMap<TKey, TValue>(this.params);
    }

    private cloneMap<TKey, TValue>(map: IMap<TKey, TValue>) {
        return new (map.constructor as any)(map) as IMap<TKey, TValue>;
    }
}