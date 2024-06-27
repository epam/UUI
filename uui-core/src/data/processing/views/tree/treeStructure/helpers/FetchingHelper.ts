import isEqual from 'react-fast-compare';
import { LazyDataSourceApiRequestContext, LazyDataSourceApiRequestRange } from '../../../../../../types';
import { TreeStructure } from '../TreeStructure';
import { cloneMap, newMap } from '../../helpers/map';
import { ItemsAccessor } from '../../ItemsAccessor';
import { LoadOptions, LoadAllOptions, LoadItemsOptions, LoadMissingItemsAndParentsOptions, LoadOptionsMissing } from './types';
import { ITreeNodeInfo } from '../types';
import { NOT_FOUND_RECORD } from '../../constants';
import { getSelectedAndChecked } from './checked';
import { LoadAllConfig } from '../../treeState/types';

export class FetchingHelper {
    public static async loadAll<TItem, TId, TFilter>({
        treeStructure,
        itemsMap,
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

        const newItemsMap = itemsMap.clear().setItems(response.items);

        return {
            itemsMap: newItemsMap,
            treeStructure: TreeStructure.createFromItems({
                params: treeStructure.getParams(),
                items: response.items,
                itemsAccessor: ItemsAccessor.toItemsAccessor(newItemsMap),
            }),
            loadedItems: response.items,
        };
    }

    public static async load<TItem, TId, TFilter = any>({
        tree,
        options,
        dataSourceState,
        patch,
    }: LoadOptions<TItem, TId, TFilter>) {
        const { loadedItems: loadedMissingItems, loadedItemsMap, byParentId, nodeInfoById } = await this.loadMissing<TItem, TId, TFilter>({
            tree,
            options,
            dataSourceState,
        });

        const missing = getSelectedAndChecked(dataSourceState, patch);

        const { loadedItems: loadedMissingItemsAndParents } = await this.loadMissingItemsAndParents<TItem, TId, TFilter>({
            tree,
            newItemsMap: loadedItemsMap,
            options,
            itemsToLoad: missing,
        });

        return {
            loadedItems: loadedMissingItems.concat(loadedMissingItemsAndParents),
            byParentId,
            nodeInfoById,
        };
    }

    private static async loadMissing<TItem, TId, TFilter = any>({
        tree,
        options,
        dataSourceState,
    }: LoadOptionsMissing<TItem, TId, TFilter>) {
        const requiredRowsCount = dataSourceState.topIndex + dataSourceState.visibleCount;

        const byParentId = newMap<TId, TId[]>(tree.getParams());
        const nodeInfoById = newMap<TId, ITreeNodeInfo>(tree.getParams());

        const newItemsMap = newMap<TId, TItem>(tree.getParams());
        const flatten = dataSourceState.search && options.flattenSearchResults;
        const loadAllChildren: (id: TId) => LoadAllConfig = options.loadAllChildren ?? (() => ({ nestedChildren: true, children: false }));

        let newItems: TItem[] = [];
        const loadRecursive = async (
            parentId: TId,
            parent: TItem,
            { children: parentLoadAllChildren, nestedChildren: parentLoadAllNestedChildren }: LoadAllConfig,
            remainingRowsCount: number,
        ) => {
            let recursiveLoadedCount = 0;

            const { ids, nodeInfo, loadedItems } = await this.loadItems<TItem, TId, TFilter>({
                tree,
                byParentId,
                options,
                parentId,
                parent,
                dataSourceState,
                remainingRowsCount,
                loadAll: parentLoadAllChildren,
            });

            const { ids: originalIds, ...originalNodeInfo } = tree.getItems(parentId);
            const currentIds = byParentId.has(parentId) ? byParentId.get(parentId) : originalIds;

            if (ids !== currentIds
                    || nodeInfo.count !== originalNodeInfo.count
                    || nodeInfo.totalCount !== originalNodeInfo.totalCount
                    || nodeInfo.assumedCount !== originalNodeInfo.assumedCount) {
                nodeInfoById.set(parentId, nodeInfo);
            }

            byParentId.set(parentId, ids);

            recursiveLoadedCount += ids.length;
            if (loadedItems.length > 0) {
                loadedItems.forEach((item) => {
                    const id = tree.getParams().getId(item);
                    const prevNodeInfo = nodeInfoById.get(id) ?? {};
                    const assumedCount = flatten ? undefined : prevNodeInfo.assumedCount ?? tree.getParams().getChildCount?.(item);
                    nodeInfoById.set(id, { ...prevNodeInfo, ...(tree.getParams().getChildCount ? { assumedCount } : {}) });
                    newItemsMap.set(id, item);
                });
                newItems = newItems.concat(loadedItems);
            }

            if (!flatten && tree.getParams().getChildCount) {
                const childrenPromises: Promise<any>[] = [];

                for (let n = 0; n < ids.length; n++) {
                    const id = ids[n];
                    const itemInTree = tree.getById(id);
                    let item: TItem = itemInTree === NOT_FOUND_RECORD ? undefined : itemInTree;
                    if (newItemsMap.has(id)) {
                        item = newItemsMap.get(id);
                    }

                    let isFolded = false;
                    let hasChildren = false;

                    if (tree.getParams().getChildCount) {
                        // not a root node
                        const childrenCount = tree.getParams().getChildCount(item);
                        if (childrenCount) {
                            // foldable
                            isFolded = options.isFolded(item);
                            hasChildren = true;
                        }
                    }

                    const { nestedChildren, children } = loadAllChildren(id);

                    const shouldLoadAllChildren = hasChildren && children;
                    const loadAll = parentLoadAllNestedChildren ? parentLoadAllChildren || shouldLoadAllChildren : shouldLoadAllChildren;

                    remainingRowsCount--;

                    if (hasChildren && ((!isFolded && remainingRowsCount > 0) || loadAll)) {
                        const childPromise = loadRecursive(id, item, { children: loadAll, nestedChildren }, remainingRowsCount);

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

        await loadRecursive(undefined, undefined, loadAllChildren(undefined), requiredRowsCount);

        return {
            tree,
            loadedItemsMap: newItemsMap,
            loadedItems: newItems,
            byParentId,
            nodeInfoById,
        };
    }

    private static async loadMissingItemsAndParents<TItem, TId, TFilter>({
        tree,
        newItemsMap,
        options,
        itemsToLoad,
    }: LoadMissingItemsAndParentsOptions<TItem, TId, TFilter>) {
        const updatedItemsMap = cloneMap(newItemsMap);
        let iteration = 0;
        let prevMissingIds = new Set<TId>();
        let loadedItems: TItem[] = [];
        const isItemNotLoaded = (id: TId) => tree.getById(id) === NOT_FOUND_RECORD && !updatedItemsMap.has(id);

        while (true) {
            const missingIds = new Set<TId>();
            if (itemsToLoad && itemsToLoad.length > 0) {
                itemsToLoad.forEach((id) => {
                    if (isItemNotLoaded(id)) {
                        missingIds.add(id);
                    }
                });
            }
            if (tree.getParams().getParentId) {
                for (const [, item] of updatedItemsMap) {
                    const parentId = tree.getParams().getParentId(item);
                    if (parentId != null && isItemNotLoaded(parentId)) {
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

                const newItems = response.items.filter((item) => {
                    const id = item ? tree.getParams().getId(item) : null;
                    return id !== null;
                });

                newItems.forEach((item) => {
                    const id = tree.getParams().getId(item);
                    updatedItemsMap.set(id, item);
                });

                loadedItems = loadedItems.concat(newItems);
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
        return { itemsMap: updatedItemsMap, loadedItems };
    }

    private static async loadItems<TItem, TId, TFilter>({
        tree,
        options,
        byParentId,
        parentId,
        parent,
        dataSourceState,
        remainingRowsCount,
        loadAll,
    }: LoadItemsOptions<TItem, TId, TFilter>) {
        const { ids: originalIds, count: childrenCount, totalCount, assumedCount: prevAssumedCount } = tree.getItems(parentId);
        const inputIds = byParentId.has(parentId) ? byParentId.get(parentId) ?? originalIds : originalIds;

        let ids = inputIds ?? [];
        const loadedItems: TItem[] = [];

        const flatten = dataSourceState.search && options.flattenSearchResults;

        // Selection cascading forces to load all nodes under particular node
        if (loadAll) {
            remainingRowsCount = Number.MAX_SAFE_INTEGER;
        }

        const missingCount = Math.max(0, remainingRowsCount - ids.length);

        const availableCount = childrenCount != null ? childrenCount - ids.length : missingCount;

        const range: LazyDataSourceApiRequestRange = { from: ids.length };

        let skipRequest = false;
        if (!loadAll) {
            range.count = missingCount;
            skipRequest = options.isLoadStrict ? true : skipRequest;
        }

        if (missingCount === 0 || availableCount === 0 || skipRequest) {
            return {
                ids,
                nodeInfo: { count: childrenCount, totalCount, assumedCount: prevAssumedCount },
                loadedItems,
            };
        }

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

        if (response.items?.length) {
            ids = [...ids];
            for (let n = 0; n < response.items.length; n++) {
                const item = response.items[n];
                loadedItems.push(item);
                const id = tree.getParams().getId(item);
                ids[n + from] = id;
            }
        }

        let newNodesCount;

        const loadedItemsCount = (response.items?.length ?? 0);
        if (response.count !== null && response.count !== undefined) {
            newNodesCount = response.count;
        } else if (loadedItemsCount < missingCount) {
            newNodesCount = from + loadedItemsCount;
        }

        let assumedCount = undefined;
        if (!flatten && parent && tree.getParams().getChildCount) {
            assumedCount = tree.getParams().getChildCount(parent);
        }

        let nodeInfo = { count: childrenCount, totalCount, assumedCount: prevAssumedCount };
        if (newNodesCount !== childrenCount || assumedCount !== prevAssumedCount) {
            nodeInfo = { ...nodeInfo, count: newNodesCount, assumedCount };
        }

        nodeInfo = { ...nodeInfo, totalCount: response.totalCount ?? totalCount };
        return {
            ids,
            nodeInfo,
            loadedItems,
        };
    }
}
