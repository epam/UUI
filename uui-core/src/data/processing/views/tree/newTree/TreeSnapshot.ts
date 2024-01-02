import isEqual from 'lodash.isequal';
import sortBy from 'lodash.sortby';
import { DataRowPathItem, DataSourceState, IMap, LazyDataSourceApiRequestContext, LazyDataSourceApiRequestRange } from '../../../../../types';
import { getSearchFilter } from '../../../../querying';
import { newMap } from '../BaseTree';
import { ApplyFilterOptions, ApplySearchOptions, ApplySortOptions, LoadAllTreeOptions, LoadTreeOptions, NOT_FOUND_RECORD, TreeNodeInfo, TreeParams } from '../ITree';

interface LoadOptions<TItem, TId, TFilter = any> {
    snapshot: TreeSnapshot<TItem, TId>;
    options: LoadTreeOptions<TItem, TId, TFilter>;
    dataSourceState: Readonly<DataSourceState>;
    withNestedChildren: boolean;
}

interface LoadItemsOptions<TItem, TId, TFilter = any> {
    snapshot: TreeSnapshot<TItem, TId>;
    options: LoadTreeOptions<TItem, TId, TFilter>,
    parentId: TId,
    parent: TItem,
    dataSourceState: Readonly<DataSourceState>,
    remainingRowsCount: number,
    loadAll: boolean,
}

interface LoadMissingItemsAndParentsOptions<TItem, TId, TFilter = any> {
    snapshot: TreeSnapshot<TItem, TId>;
    options: LoadTreeOptions<TItem, TId, TFilter>;
    itemsToLoad: TId[];
}

interface LoadAllOptions<TItem, TId, TFilter = any> {
    snapshot: TreeSnapshot<TItem, TId>;
    options: LoadAllTreeOptions<TItem, TId, TFilter>;
    dataSourceState: DataSourceState;
}

interface FilterOptions<TItem, TId, TFilter = any> {
    snapshot: TreeSnapshot<TItem, TId>;
    options: ApplyFilterOptions<TItem, TId, TFilter>;
}

interface ApplyFilterToTreeSnapshotOptions<TItem, TId> {
    snapshot: TreeSnapshot<TItem, TId>;
    filter: undefined | ((item: TItem) => number | boolean);
}

interface SearchOptions<TItem, TId, TFilter> {
    snapshot: TreeSnapshot<TItem, TId>;
    options: ApplySearchOptions<TItem, TId, TFilter>;
}

interface ApplySearchToTreeSnapshotOptions<TItem, TId> {
    snapshot: TreeSnapshot<TItem, TId>;
    search: undefined | ((item: TItem) => number | boolean);
    sortSearchByRelevance?: boolean;
}

interface SortOptions<TItem, TId, TFilter> {
    snapshot: TreeSnapshot<TItem, TId>;
    options: ApplySortOptions<TItem, TId, TFilter>;
}

class BaseTreeSnapshot<TItem, TId> {
    constructor(
        protected params: TreeParams<TItem, TId>,
        protected _byId: IMap<TId, TItem>,
        protected readonly byParentId?: IMap<TId, TId[]>,
        protected readonly nodeInfoById?: IMap<TId, TreeNodeInfo>,
    ) {
        this.byParentId = byParentId ?? newMap(params);
        this.nodeInfoById = nodeInfoById ?? newMap(params);
    }

    public get byId() {
        return this._byId;
    }

    public set byId(newById: IMap<TId, TItem>) {
        this._byId = newById;
    }

    public getRootIds(): TId[] {
        return this.byParentId.get(undefined) || [];
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
        const id = this.params.getId(item);
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
                const item = this.byId.get(id);
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
        for (const [id, item] of this.byId) {
            action(item, id, this.params.getParentId?.(item));
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
}

export class TreeSnapshot<TItem, TId> extends BaseTreeSnapshot<TItem, TId> {
    public static async load<TItem, TId, TFilter = any>({
        snapshot,
        options,
        dataSourceState,
        withNestedChildren = true,
    }: LoadOptions<TItem, TId, TFilter>) {
        const treeSnapshot = await this.loadMissing({ snapshot, options, dataSourceState, withNestedChildren });
        return await this.loadMissingItemsAndParents({ snapshot: treeSnapshot, options, itemsToLoad: dataSourceState.checked });
    }

    private static async loadMissing<TItem, TId, TFilter = any>({
        snapshot,
        options,
        dataSourceState,
        withNestedChildren = true,
    }: LoadOptions<TItem, TId, TFilter>): Promise<TreeSnapshot<TItem, TId>> {
        const requiredRowsCount = dataSourceState.topIndex + dataSourceState.visibleCount;

        let byId: IMap<TId, TItem> = snapshot.byId;
        let byParentId = snapshot.byParentId;
        let nodeInfoById = snapshot.nodeInfoById;

        const flatten = dataSourceState.search && options.flattenSearchResults;

        const loadRecursive = async (parentId: TId, parent: TItem, parentLoadAll: boolean, remainingRowsCount: number) => {
            let recursiveLoadedCount = 0;

            const { ids, nodeInfo, loadedItems } = await this.loadItems<TItem, TId, TFilter>({
                snapshot,
                options,
                parentId,
                parent,
                dataSourceState,
                remainingRowsCount,
                loadAll: parentLoadAll,
            });

            const currentNodeInfo = snapshot.nodeInfoById.get(parentId);
            const currentIds = byParentId.get(parentId);

            if (ids !== currentIds || nodeInfo !== currentNodeInfo) {
                byParentId = byParentId === snapshot.byParentId ? this.cloneMap(byParentId) : byParentId;
                byParentId.set(parentId, ids);
                nodeInfoById = nodeInfoById === snapshot.nodeInfoById ? this.cloneMap(nodeInfoById) : nodeInfoById;
                nodeInfoById.set(parentId, nodeInfo);
            }

            recursiveLoadedCount += ids.length;

            if (loadedItems.length > 0) {
                // Clone the map if it's not cloned yet
                byId = byId === snapshot.byId ? this.cloneMap(byId) : byId;

                loadedItems.forEach((item) => {
                    const id = snapshot.params.getId(item);
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

                    if (options.getChildCount) {
                        // not a root node
                        const childrenCount = options.getChildCount(item);
                        if (childrenCount) {
                            // foldable
                            isFolded = options.isFolded(item);
                            hasChildren = true;
                        }
                    }

                    const loadAllChildren = hasChildren && options.loadAllChildren && options.loadAllChildren(id);
                    const loadAll = withNestedChildren ? parentLoadAll || loadAllChildren : loadAllChildren;
                    remainingRowsCount--;

                    if (hasChildren && ((!isFolded && remainingRowsCount > 0) || loadAll)) {
                        const childPromise = loadRecursive(id, item, loadAll, remainingRowsCount);

                        childrenPromises.push(childPromise);

                        if (options.fetchStrategy === 'sequential') {
                            const loadedCount = await childPromise;
                            remainingRowsCount -= loadedCount;
                            recursiveLoadedCount += loadedCount;
                        }
                    }
                }

                const childCounts = await Promise.all(childrenPromises);
                if (options.fetchStrategy === 'parallel') {
                    const recursiveChildrenCount = childCounts.reduce((a, b) => a + b, 0);
                    recursiveLoadedCount += recursiveChildrenCount;
                    remainingRowsCount -= recursiveChildrenCount;
                }
            }

            return recursiveLoadedCount;
        };

        await loadRecursive(undefined, undefined, options?.loadAllChildren?.(undefined), requiredRowsCount);

        return this.newInstance(snapshot.params, byId, byParentId, nodeInfoById);
    }

    private static async loadMissingItemsAndParents<TItem, TId, TFilter>({
        snapshot,
        options,
        itemsToLoad,
    }: LoadMissingItemsAndParentsOptions<TItem, TId, TFilter>): Promise<TreeSnapshot<TItem, TId>> {
        let byId = snapshot.byId;
        let iteration = 0;
        let prevMissingIds = new Set<TId>();
        while (true) {
            const missingIds = new Set<TId>();

            if (itemsToLoad && itemsToLoad.length > 0) {
                itemsToLoad.forEach((id) => {
                    if (!byId.has(id)) {
                        missingIds.add(id);
                    }
                });
            }
            if (snapshot.params.getParentId) {
                for (const [, item] of byId) {
                    const parentId = snapshot.params.getParentId(item);
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

                if (response.items.length !== ids.length) {
                    console.error(`LazyTree: api does not returned requested items. Check that you handle 'ids' argument correctly.
                        Read more here: https://github.com/epam/UUI/issues/89`);
                }

                // Clone before first update
                byId = byId === snapshot.byId ? TreeSnapshot.cloneMap(byId) : byId;

                response.items.forEach((item) => {
                    const id = item ? snapshot.params.getId(item) : null;
                    if (id !== null) {
                        byId.set(id, item);
                    }
                });

                if (prevMissingIds.size === missingIds.size && isEqual(prevMissingIds, missingIds)) {
                    break;
                }

                prevMissingIds = new Set([...missingIds]);
            }
            iteration++;

            if (iteration > 1000) {
                throw new Error('LazyTree: More than 1000 iterations are made to load required items and their parents by ID. Check your api implementation');
            }
        }
        if (byId === snapshot.byId) {
            return snapshot;
        } else {
            return this.newInstance(snapshot.params, byId, snapshot.byParentId, snapshot.nodeInfoById);
        }
    }

    private static newInstance<TItem, TId>(
        params: TreeParams<TItem, TId>,
        byId: IMap<TId, TItem>,
        byParentId: IMap<TId, TId[]>,
        nodeInfoById: IMap<TId, TreeNodeInfo>,
    ) {
        return new TreeSnapshot(
            params,
            byId,
            byParentId,
            nodeInfoById,
        );
    }

    private static async loadItems<TItem, TId, TFilter>({
        snapshot,
        options,
        parentId,
        parent,
        dataSourceState,
        remainingRowsCount,
        loadAll,
    }: LoadItemsOptions<TItem, TId, TFilter>) {
        const inputNodeInfo = snapshot.nodeInfoById.get(parentId);
        const inputIds = snapshot.byParentId.get(parentId);

        let ids = inputIds || [];
        let nodeInfo = inputNodeInfo || {};
        const loadedItems: TItem[] = [];

        const flatten = dataSourceState.search && options.flattenSearchResults;

        // Selection cascading forces to load all nodes under particular node
        if (loadAll) {
            remainingRowsCount = Number.MAX_SAFE_INTEGER;
        }

        const missingCount = remainingRowsCount - ids.length;

        const availableCount = nodeInfo.count != null ? nodeInfo.count - ids.length : missingCount;

        const range: LazyDataSourceApiRequestRange = { from: ids.length };

        let skipRequest = false;
        if (!loadAll) {
            range.count = missingCount;
            skipRequest = options.isLoadStrict ? true : skipRequest;
        }

        if (missingCount > 0 && availableCount > 0 && !skipRequest) {
            // Need to load additional items in the current layer
            const requestContext: LazyDataSourceApiRequestContext<TItem, TId> = {};

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

            const response = await options.api(
                {
                    sorting: dataSourceState.sorting,
                    search: dataSourceState.search,
                    filter: options.filter,
                    range,
                    page: dataSourceState.page,
                    pageSize: dataSourceState.pageSize,
                },
                requestContext,
            );

            const from = response.from == null ? range.from : response.from;

            if (response.items.length) {
                ids = [...ids];
                for (let n = 0; n < response.items.length; n++) {
                    const item = response.items[n];
                    loadedItems.push(item);
                    const id = snapshot.params.getId(item);
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

            nodeInfo = { ...nodeInfo, totalCount: response.totalCount };
        }

        return {
            ids,
            nodeInfo,
            loadedItems,
        };
    }

    public static async loadAll<TItem, TId, TFilter>({
        snapshot,
        options,
        dataSourceState,
    }: LoadAllOptions<TItem, TId, TFilter>) {
        const response = await options.api(
            {
                sorting: dataSourceState.sorting,
                search: dataSourceState.search,
                filter: options.filter,
                page: dataSourceState.page,
                pageSize: dataSourceState.pageSize,
            },
        );

        return this.create(snapshot.params, response.items);
    }

    private static create<TItem, TId>(params: TreeParams<TItem, TId>, items: TItem[]) {
        const byId = newMap<TId, TItem>(params);
        const byParentId = newMap<TId, TId[]>(params);

        items.forEach((item) => {
            byId.set(params.getId(item), item);
            const parentId = params.getParentId?.(item);

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

        return this.newInstance(params, byId, byParentId, newNodeInfoById);
    }

    protected static cloneMap<TKey, TValue>(map: IMap<TKey, TValue>) {
        return new (map.constructor as any)(map) as IMap<TKey, TValue>;
    }

    public static filter<TItem, TId, TFilter>({ snapshot, options }: FilterOptions<TItem, TId, TFilter>): TreeSnapshot<TItem, TId> {
        const filter = options.getFilter?.(options.filter);
        return this.applyFilterToTreeSnapshot({ snapshot, filter });
    }

    public static search<TItem, TId, TFilter>({ snapshot, options }: SearchOptions<TItem, TId, TFilter>): TreeSnapshot<TItem, TId> {
        const search = this.buildSearchFilter(options);
        return this.applySearchToTree({ snapshot, search, sortSearchByRelevance: options.sortSearchByRelevance });
    }

    public static sort<TItem, TId, TFilter>({ snapshot, options }: SortOptions<TItem, TId, TFilter>) {
        const sort = this.buildSorter(options);
        const sortedItems: TItem[] = [];
        const sortRec = (items: TItem[]) => {
            sortedItems.push(...sort(items));
            items.forEach((item) => {
                const children = snapshot.getChildren(item);
                sortRec(children);
            });
        };

        sortRec(snapshot.getRootItems());
        return this.create({ ...snapshot.params }, sortedItems);
    }

    private static buildSearchFilter<TItem, TId, TFilter>({ search, getSearchFields }: ApplySearchOptions<TItem, TId, TFilter>) {
        if (!search) return null;

        if (!getSearchFields) {
            console.warn('[Tree] Search value is set, but options.getSearchField is not specified. Nothing to search on.');
            return null;
        }
        const searchFilter = getSearchFilter(search);
        return (i: TItem) => searchFilter(getSearchFields(i));
    }

    private static buildSorter<TItem, TId, TFilter>(options: ApplySortOptions<TItem, TId, TFilter>) {
        const compareScalars = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' }).compare;
        const comparers: ((a: TItem, b: TItem) => number)[] = [];

        if (options.sorting) {
            options.sorting.forEach((sortingOption) => {
                const sortByFn = options.sortBy || ((i: TItem) => i[sortingOption.field as keyof TItem] || '');
                const sign = sortingOption.direction === 'desc' ? -1 : 1;
                comparers.push((a, b) => sign * compareScalars(sortByFn(a, sortingOption) + '', sortByFn(b, sortingOption) + ''));
            });
        }

        return (items: TItem[]) => {
            if (comparers.length === 0) {
                return items;
            }

            const indexes = new Map<TItem, number>();
            items.forEach((item, index) => indexes.set(item, index));

            const comparer = (a: TItem, b: TItem) => {
                for (let n = 0; n < comparers.length; n++) {
                    const compare = comparers[n];
                    const result = compare(a, b);
                    if (result !== 0) {
                        return result;
                    }
                }

                // to make sort stable, compare items indices if other comparers return 0 (equal)
                return indexes.get(a) - indexes.get(b);
            };

            items = [...items];
            items.sort(comparer);
            return items;
        };
    }

    private static applyFilterToTreeSnapshot<TItem, TId>({ filter, snapshot }: ApplyFilterToTreeSnapshotOptions<TItem, TId>) {
        if (!filter) return snapshot;

        const matchedItems: TItem[] = [];
        const applyFilterRec = (items: TItem[]) => {
            let isSomeMatching: number | boolean = false;
            items.forEach((item) => {
                const isItemMatching = filter(item);
                const isSomeChildMatching = applyFilterRec(snapshot.getChildren(item));
                const isMatching = isItemMatching || isSomeChildMatching;
                if (isMatching) {
                    matchedItems.push(item);
                }

                if (!isSomeMatching) {
                    isSomeMatching = isMatching;
                }
            });

            return isSomeMatching;
        };

        applyFilterRec(snapshot.getRootItems());
        return this.create({ ...snapshot.params }, matchedItems);
    }

    private static applySearchToTree<TItem, TId>({ snapshot, search, sortSearchByRelevance }: ApplySearchToTreeSnapshotOptions<TItem, TId>) {
        if (!search) return snapshot;

        const matchedItems: TItem[] = [];
        const ranks: Map<TId, number> = new Map();
        const applySearchRec = (items: TItem[]) => {
            let isSomeMatching: number | boolean = false;
            items.forEach((item) => {
                const isItemMatching = search(item);
                const isSomeChildMatching = applySearchRec(snapshot.getChildren(item));
                const isMatching = isItemMatching || isSomeChildMatching;
                if (isMatching !== false) {
                    matchedItems.push(item);
                    if (typeof isMatching !== 'boolean') {
                        const id = snapshot.params.getId(item);
                        const rank = ranks.has(id) ? Math.max(ranks.get(id), isMatching) : isMatching;
                        ranks.set(snapshot.params.getId(item), rank);
                    }
                }

                if (!isSomeMatching) {
                    isSomeMatching = isMatching;
                } else if (typeof isMatching === 'number') {
                    isSomeMatching = typeof isSomeMatching === 'number'
                        ? Math.max(isMatching, isSomeMatching)
                        : isMatching;
                }
            });

            return isSomeMatching;
        };

        applySearchRec(snapshot.getRootItems());
        return this.create(
            { ...snapshot.params },
            sortSearchByRelevance ? this.sortByRanks(matchedItems, ranks, snapshot.params.getId) : matchedItems,
        );
    }

    private static sortByRanks<TItem, TId>(items: TItem[], ranks: Map<TId, number>, getId: (item: TItem) => TId) {
        if (ranks.size === 0) {
            return items;
        }
        const itemsToSort = [...items];

        return sortBy(itemsToSort, (item) => {
            const id = getId(item);
            if (!ranks.has(id)) {
                return 0;
            }
            return ranks.get(id) * -1;
        });
    }
}
