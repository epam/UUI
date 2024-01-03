import isEqual from 'lodash.isequal';
import sortBy from 'lodash.sortby';
import { CascadeSelectionTypes, IMap, LazyDataSourceApiRequestContext, LazyDataSourceApiRequestRange } from '../../../../../types';
import { getSearchFilter } from '../../../../querying';
import { newMap } from '../BaseTree';
import { ApplySearchOptions, ApplySortOptions, NOT_FOUND_RECORD, ROOT_ID, TreeNodeInfo, TreeParams } from '../ITree';
import {
    ActForCheckableOptions, ApplyFilterToTreeSnapshotOptions, ApplySearchToTreeSnapshotOptions, CascadeSelectionOptions,
    CheckParentsWithFullCheckOptions, FilterOptions, LoadAllOptions, LoadItemsOptions, LoadMissingItemsAndParentsOptions,
    LoadOptions, PasteItemIntoChildrenListOptions, PatchChildrenOptions, PatchOptions, SearchOptions, SelectionOptions, SortOptions,
} from './types';
import { BaseTreeSnapshot } from './BaseTreeSnapshot';

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

    public static filter<TItem, TId, TFilter>({ snapshot, getFilter, filter }: FilterOptions<TItem, TId, TFilter>): TreeSnapshot<TItem, TId> {
        const isMatchingFilter = getFilter?.(filter);
        return this.applyFilterToTreeSnapshot({ snapshot, filter: isMatchingFilter });
    }

    public static search<TItem, TId, TFilter>({ snapshot, ...options }: SearchOptions<TItem, TId, TFilter>): TreeSnapshot<TItem, TId> {
        const search = this.buildSearchFilter(options);
        return this.applySearchToTree({ snapshot, search, sortSearchByRelevance: options.sortSearchByRelevance });
    }

    public static sort<TItem, TId, TFilter>({ snapshot, ...sortOptions }: SortOptions<TItem, TId, TFilter>) {
        const sort = this.buildSorter(sortOptions);
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

    public static patch<TItem, TId>({
        snapshot, items, isDeletedProp, comparator,
    }: PatchOptions<TItem, TId>): TreeSnapshot<TItem, TId> {
        if (!items || items.length === 0) {
            return snapshot;
        }

        const newById = this.cloneMap(snapshot.byId);
        const newByParentId = this.cloneMap(snapshot.byParentId); // shallow clone, still need to copy arrays inside!

        let isPatched = false;
        items.forEach((item) => {
            const id = snapshot.params.getId(item);
            const existingItem = snapshot.byId.get(id);
            const parentId = snapshot.params.getParentId?.(item);

            if (isDeletedProp && item[isDeletedProp]) {
                const children = [...(newByParentId.get(parentId) ?? [])];
                newByParentId.set(parentId, this.deleteFromChildren(id, children));
                newByParentId.delete(id);
                newById.delete(id);
                isPatched = true;
                return;
            }

            if (!existingItem || existingItem !== item) {
                newById.set(id, item);
                const existingItemParentId = existingItem ? snapshot.params.getParentId?.(existingItem) : undefined;
                if (!existingItem || parentId !== existingItemParentId) {
                    const children = newByParentId.get(parentId) ?? [];

                    newByParentId.set(parentId, this.patchChildren({ snapshot, children, existingItem, newItem: item, comparator, byId: newById }));

                    if (existingItem && existingItemParentId !== parentId) {
                        const prevParentChildren = snapshot.byParentId.get(existingItemParentId) ?? [];
                        newByParentId.set(existingItemParentId, this.deleteFromChildren(id, prevParentChildren));
                    }
                }
                isPatched = true;
            }
        });

        if (!isPatched) {
            return snapshot;
        }

        const newNodeInfoById = newMap<TId, TreeNodeInfo>(snapshot.params);

        for (const [parentId, ids] of newByParentId) {
            newNodeInfoById.set(parentId, { count: ids.length });
        }

        return this.newInstance(snapshot.params, newById, newByParentId, newNodeInfoById);
    }

    private static deleteFromChildren<TId>(id: TId, children: TId[]) {
        const foundIndex = children.findIndex((childId) => childId === id);
        if (foundIndex !== -1) {
            children.splice(foundIndex, 1);
        }

        return children;
    }

    private static patchChildren<TItem, TId>({
        snapshot,
        children,
        existingItem,
        newItem,
        comparator,
        byId,
    }: PatchChildrenOptions<TItem, TId>) {
        const id = snapshot.params.getId(newItem);
        const parentId = snapshot.params.getParentId?.(newItem);
        const prevParentId = existingItem ? snapshot.params.getParentId?.(existingItem) : undefined;

        if (!children || children === snapshot.getChildrenIdsByParentId(parentId)) {
            children = children ? [...children] : [];
        }

        if ((!existingItem || (existingItem && parentId !== prevParentId)) && comparator) {
            return this.pasteItemIntoChildrenList({ id: snapshot.params.getId(newItem), item: newItem, children, comparator, byId });
        }

        children.push(id);
        return children;
    }

    private static pasteItemIntoChildrenList<TItem, TId>({ id, item, children, comparator, byId }: PasteItemIntoChildrenListOptions<TItem, TId>) {
        if (!children.length) {
            return [id];
        }

        // paste item should be the second argument
        const lessOrEqualPosition = children.findIndex((itemId) => comparator(item, byId.get(itemId)) <= 0);
        const position = lessOrEqualPosition === -1 ? children.length : lessOrEqualPosition;

        children.splice(position, 0, id);
        return children;
    }

    public static cascadeSelection<TItem, TId>({
        snapshot,
        currentCheckedIds,
        checkedId,
        isChecked,
        isCheckable,
        cascadeSelectionType,
    }: CascadeSelectionOptions<TItem, TId>) {
        const isImplicitMode = cascadeSelectionType === CascadeSelectionTypes.IMPLICIT;
        let checkedIdsMap = newMap<TId, boolean>(snapshot.params);
        if (!(checkedId === ROOT_ID && isImplicitMode)) {
            currentCheckedIds.forEach((id) => checkedIdsMap.set(id, true));
        }

        const optionsWithDefaults = { isCheckable: isCheckable ?? (() => true), cascadeSelectionType: cascadeSelectionType ?? true };
        if (!optionsWithDefaults.cascadeSelectionType) {
            checkedIdsMap = this.simpleSelection({ snapshot, checkedIdsMap, checkedId, isChecked, ...optionsWithDefaults });
        }

        if (optionsWithDefaults.cascadeSelectionType === true || optionsWithDefaults.cascadeSelectionType === CascadeSelectionTypes.EXPLICIT) {
            checkedIdsMap = this.explicitCascadeSelection({ snapshot, checkedIdsMap, checkedId, isChecked, ...optionsWithDefaults });
        }

        if (optionsWithDefaults.cascadeSelectionType === CascadeSelectionTypes.IMPLICIT) {
            checkedIdsMap = this.implicitCascadeSelection({ snapshot, checkedIdsMap, checkedId, isChecked, ...optionsWithDefaults });
        }

        const result = [];
        for (const [id, value] of checkedIdsMap) {
            value && result.push(id);
        }

        return result;
    }

    private static simpleSelection<TItem, TId>({
        snapshot,
        checkedIdsMap,
        checkedId,
        isChecked,
        isCheckable,
    }: SelectionOptions<TItem, TId>) {
        if (isChecked) {
            if (checkedId !== ROOT_ID) {
                checkedIdsMap.set(checkedId, true);
            } else {
                for (const [id, item] of snapshot.byId) {
                    if (isCheckable(item)) {
                        checkedIdsMap.set(id, true);
                    }
                }
            }
            return checkedIdsMap;
        }

        if (checkedId !== ROOT_ID) {
            checkedIdsMap.delete(checkedId);
        } else {
            for (const [checkedItemId, isItemChecked] of checkedIdsMap) {
                if (isItemChecked) {
                    this.actForCheckable({
                        action: (id) => checkedIdsMap.delete(id),
                        snapshot,
                        isCheckable,
                        id: checkedItemId,
                    });
                }
            }
            return checkedIdsMap;
        }

        return checkedIdsMap;
    }

    private static actForCheckable<TItem, TId>({
        snapshot,
        action,
        isCheckable,
        id,
    }: ActForCheckableOptions<TItem, TId>) {
        const item = snapshot.getById(id);
        if (item !== NOT_FOUND_RECORD && isCheckable(item)) {
            action(id);
        }
    }

    private static explicitCascadeSelection<TItem, TId>({
        snapshot,
        checkedIdsMap,
        checkedId,
        isChecked,
        isCheckable,
    }: SelectionOptions<TItem, TId>) {
        if (isChecked) {
            if (checkedId !== ROOT_ID) {
                checkedIdsMap.set(checkedId, true);
            }
            // check all children recursively
            snapshot.forEachChildren((id) => id !== ROOT_ID && checkedIdsMap.set(id, true), isCheckable, checkedId);
            return this.checkParentsWithFullCheck({ snapshot, checkedIdsMap, checkedId, isCheckable });
        }

        if (checkedId !== ROOT_ID) {
            checkedIdsMap.delete(checkedId);
        }

        // uncheck all children recursively
        snapshot.forEachChildren((id) => checkedIdsMap.delete(id), isCheckable, checkedId);

        snapshot.getParentIdsRecursive(checkedId).forEach((parentId) => checkedIdsMap.delete(parentId));

        return checkedIdsMap;
    }

    private static implicitCascadeSelection<TItem, TId>({
        snapshot,
        checkedIdsMap,
        checkedId,
        isChecked,
        isCheckable,
    }: SelectionOptions<TItem, TId>) {
        if (isChecked) {
            if (checkedId !== ROOT_ID) {
                checkedIdsMap.set(checkedId, true);
            }
            // for implicit mode, it is required to remove explicit check from children,
            // if parent is checked
            snapshot.forEachChildren((id) => checkedIdsMap.delete(id), isCheckable, checkedId, false);
            if (checkedId === ROOT_ID) {
                const childrenIds = snapshot.getChildrenIdsByParentId(checkedId);

                // if selectedId is undefined and it is selected, that means selectAll
                childrenIds.forEach((id) => checkedIdsMap.set(id, true));
            }
            // check parents if all children are checked
            return this.checkParentsWithFullCheck({
                snapshot,
                checkedIdsMap,
                checkedId,
                isCheckable,
                removeExplicitChildrenSelection: true,
            });
        }

        if (checkedId !== ROOT_ID) {
            checkedIdsMap.delete(checkedId);
        }

        const selectNeighboursOnly = (itemId: TId) => {
            const item = snapshot.getById(itemId);
            if (item === NOT_FOUND_RECORD) {
                return;
            }

            const parentId = snapshot.params.getParentId?.(item);
            const parents = snapshot.getParentIdsRecursive(itemId);
            // if some parent is checked, it is required to check all children explicitly,
            // except unchecked one.
            const someParentIsChecked = parents.some((parent) => checkedIdsMap.get(parent));
            snapshot.getChildrenIdsByParentId(parentId).forEach((id) => {
                if (itemId !== id && someParentIsChecked) {
                    checkedIdsMap.set(id, true);
                }
            });
            checkedIdsMap.delete(parentId);
        };

        if (checkedId !== ROOT_ID) {
            const parents = snapshot.getParentIdsRecursive(checkedId);
            [checkedId, ...parents.reverse()].forEach(selectNeighboursOnly);
        }
        return checkedIdsMap;
    }

    private static checkParentsWithFullCheck<TItem, TId>({
        snapshot,
        checkedIdsMap,
        checkedId,
        isCheckable,
        removeExplicitChildrenSelection,
    }: CheckParentsWithFullCheckOptions<TItem, TId>) {
        snapshot.getParentIdsRecursive(checkedId)
            .reverse()
            .forEach((parentId) => {
                const childrenIds = snapshot.getChildrenIdsByParentId(parentId);
                if (childrenIds && childrenIds.every((childId) => checkedIdsMap.has(childId))) {
                    if (parentId !== ROOT_ID) {
                        checkedIdsMap.set(parentId, true);
                    }
                    if (removeExplicitChildrenSelection) {
                        snapshot.forEachChildren((id) => checkedIdsMap.delete(id), isCheckable, parentId, false);
                    }
                }
            });
        return checkedIdsMap;
    }
}
