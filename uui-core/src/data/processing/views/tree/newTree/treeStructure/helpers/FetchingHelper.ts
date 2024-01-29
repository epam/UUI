import isEqual from 'lodash.isequal';
import { LazyDataSourceApiRequestContext, LazyDataSourceApiRequestRange } from '../../../../../../../types';
import { TreeStructure } from '../TreeStructure';
import { cloneMap, newMap } from './map';
import { ItemsAccessor } from '../ItemsAccessor';
import { LoadOptions, LoadAllOptions, LoadItemsOptions, LoadMissingItemsAndParentsOptions, LoadOptionsMissing } from './types';
import { TreeNodeInfo } from '../types';
import { NOT_FOUND_RECORD } from '../../constants';

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

        const newItemsMap = itemsMap.setItems(response.items, { reset: true });

        return {
            itemsMap: newItemsMap,
            treeStructure: TreeStructure.createFromItems({
                params: treeStructure.params,
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
        withNestedChildren = true,
    }: LoadOptions<TItem, TId, TFilter>) {
        const { loadedItems: loadedMissingItems, loadedItemsMap, byParentId, nodeInfoById } = await this.loadMissing<TItem, TId, TFilter>({
            tree,
            options,
            dataSourceState,
            withNestedChildren,
        });

        const { loadedItems: loadedMissingItemsAndParents } = await this.loadMissingItemsAndParents<TItem, TId, TFilter>({
            tree,
            newItemsMap: loadedItemsMap,
            options,
            itemsToLoad: dataSourceState.checked,
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
        withNestedChildren = true,
    }: LoadOptionsMissing<TItem, TId, TFilter>) {
        const requiredRowsCount = dataSourceState.topIndex + dataSourceState.visibleCount;

        const byParentId = newMap<TId, TId[]>(tree.params);
        const nodeInfoById = newMap<TId, TreeNodeInfo>(tree.params);

        const newItemsMap = newMap<TId, TItem>(tree.params);
        const flatten = dataSourceState.search && options.flattenSearchResults;

        let newItems: TItem[] = [];
        const loadRecursive = async (parentId: TId, parent: TItem, parentLoadAll: boolean, remainingRowsCount: number) => {
            let recursiveLoadedCount = 0;

            const { ids, nodeInfo, loadedItems } = await this.loadItems<TItem, TId, TFilter>({
                tree,
                options,
                parentId,
                parent,
                dataSourceState,
                remainingRowsCount,
                loadAll: parentLoadAll,
            });

            const { ids: originalIds, ...originalNodeInfo } = tree.getItems(parentId);
            const currentIds = byParentId.has(parentId) ? byParentId.get(parentId) : originalIds;

            // TODO: think how to rewrite to avoid using byParentId and nodeInfoById
            if (ids !== currentIds || nodeInfo.count !== originalNodeInfo.count || nodeInfo.totalCount !== originalNodeInfo.totalCount) {
                byParentId.set(parentId, ids);
                nodeInfoById.set(parentId, nodeInfo);
            }

            recursiveLoadedCount += ids.length;
            // TODO: perform setItems somewhere out of this algorythm
            if (loadedItems.length > 0) {
                loadedItems.forEach((item) => {
                    const id = tree.params.getId(item);
                    newItemsMap.set(id, item);
                });
                newItems = newItems.concat(loadedItems);
            }

            if (!flatten && options.getChildCount) {
                const childrenPromises: Promise<any>[] = [];

                for (let n = 0; n < ids.length; n++) {
                    const id = ids[n];
                    const item = newItemsMap.get(id);

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

        return {
            tree,
            loadedItemsMap: newItemsMap,
            loadedItems: newItems,
            byParentId, // ?
            nodeInfoById, // ?
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

        // TODO: add looping throunh the root level of tree to find elements, which parent is absent.
        while (true) {
            const missingIds = new Set<TId>();
            if (itemsToLoad && itemsToLoad.length > 0) {
                itemsToLoad.forEach((id) => {
                    if (tree.getById(id) === NOT_FOUND_RECORD && !updatedItemsMap.has(id)) {
                        missingIds.add(id);
                    }
                });
            }
            if (tree.params.getParentId) {
                for (const [, item] of updatedItemsMap) {
                    const parentId = tree.params.getParentId(item);
                    if (parentId != null && !updatedItemsMap.has(parentId)) {
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
                    const id = item ? tree.params.getId(item) : null;
                    return id !== null;
                });

                newItems.forEach((item) => {
                    const id = tree.params.getId(item);
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
        parentId,
        parent,
        dataSourceState,
        remainingRowsCount,
        loadAll,
    }: LoadItemsOptions<TItem, TId, TFilter>) {
        const { ids: inputIds, count: childrenCount, totalCount } = tree.getItems(parentId);

        const ids = inputIds ?? [];
        const loadedItems: TItem[] = [];

        const flatten = dataSourceState.search && options.flattenSearchResults;

        // Selection cascading forces to load all nodes under particular node
        if (loadAll) {
            remainingRowsCount = Number.MAX_SAFE_INTEGER;
        }

        const missingCount = remainingRowsCount - ids.length;

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
                nodeInfo: { count: childrenCount, totalCount },
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

        const newIds = [];
        if (response.items.length) {
            newIds.push(...ids);
            for (let n = 0; n < response.items.length; n++) {
                const item = response.items[n];
                loadedItems.push(item);
                const id = tree.params.getId(item);
                newIds[n + from] = id;
            }
        }

        let newNodesCount;

        if (response.count !== null && response.count !== undefined) {
            newNodesCount = response.count;
        } else if (response.items.length < missingCount) {
            newNodesCount = from + response.items.length;
        }
        let nodeInfo = { count: childrenCount, totalCount };
        if (newNodesCount !== childrenCount) {
            nodeInfo = { ...nodeInfo, count: newNodesCount };
        }

        nodeInfo = { ...nodeInfo, totalCount: response.totalCount ?? totalCount };
        return {
            ids: newIds,
            nodeInfo,
            loadedItems,
        };
    }
}
