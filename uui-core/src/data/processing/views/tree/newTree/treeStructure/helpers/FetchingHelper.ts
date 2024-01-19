import isEqual from 'lodash.isequal';
import { LazyDataSourceApiRequestContext, LazyDataSourceApiRequestRange } from '../../../../../../../types';
import { TreeStructure } from '../TreeStructure';
import { cloneMap } from './map';
import { ItemsAccessor } from '../ItemsAccessor';
import { LoadOptions, LoadAllOptions, LoadItemsOptions, LoadMissingItemsAndParentsOptions } from './types';
import { ItemsMap } from '../../../ItemsMap';

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
        };
    }

    public static async load<TItem, TId, TFilter = any>({
        treeStructure,
        itemsMap,
        options,
        dataSourceState,
        withNestedChildren = true,
    }: LoadOptions<TItem, TId, TFilter>) {
        const { treeStructure: newTreeStructure, itemsMap: newItemsMap } = await this.loadMissing<TItem, TId, TFilter>({
            treeStructure,
            itemsMap,
            options,
            dataSourceState,
            withNestedChildren,
        });

        const updatedItemsMap = await this.loadMissingItemsAndParents<TItem, TId, TFilter>({
            treeStructure: newTreeStructure,
            itemsMap: newItemsMap,
            options,
            itemsToLoad: dataSourceState.checked,
        });

        return {
            itemsMap: updatedItemsMap,
            treeStructure: TreeStructure.create(
                newTreeStructure.params,
                ItemsAccessor.toItemsAccessor(updatedItemsMap),
                newTreeStructure.byParentId,
                newTreeStructure.nodeInfoById,
            ),
        };
    }

    private static async loadMissing<TItem, TId, TFilter = any>({
        treeStructure,
        itemsMap,
        options,
        dataSourceState,
        withNestedChildren = true,
    }: LoadOptions<TItem, TId, TFilter>) {
        const requiredRowsCount = dataSourceState.topIndex + dataSourceState.visibleCount;

        let byParentId = treeStructure.byParentId;
        let nodeInfoById = treeStructure.nodeInfoById;
        let newItemsMap = itemsMap;
        const flatten = dataSourceState.search && options.flattenSearchResults;

        const loadRecursive = async (parentId: TId, parent: TItem, parentLoadAll: boolean, remainingRowsCount: number) => {
            let recursiveLoadedCount = 0;

            const { ids, nodeInfo, loadedItems } = await this.loadItems<TItem, TId, TFilter>({
                treeStructure,
                itemsMap: newItemsMap,
                options,
                parentId,
                parent,
                dataSourceState,
                remainingRowsCount,
                loadAll: parentLoadAll,
            });

            const currentNodeInfo = treeStructure.nodeInfoById.get(parentId);
            const currentIds = byParentId.get(parentId);

            if (ids !== currentIds || nodeInfo !== currentNodeInfo) {
                byParentId = byParentId === treeStructure.byParentId ? cloneMap(byParentId) : byParentId;
                byParentId.set(parentId, ids);
                nodeInfoById = nodeInfoById === treeStructure.nodeInfoById ? cloneMap(nodeInfoById) : nodeInfoById;
                nodeInfoById.set(parentId, nodeInfo);
            }

            recursiveLoadedCount += ids.length;
            if (loadedItems.length > 0) {
                newItemsMap = newItemsMap.setItems(loadedItems);
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

        if (treeStructure.byParentId !== byParentId || treeStructure.nodeInfoById !== nodeInfoById || itemsMap !== newItemsMap) {
            return {
                treeStructure: TreeStructure.create<TItem, TId>(
                    treeStructure.params,
                    ItemsAccessor.toItemsAccessor<TId, TItem>(newItemsMap),
                    byParentId,
                    nodeInfoById,
                ),
                itemsMap: newItemsMap,
            };
        }
        return { treeStructure, itemsMap };
    }

    private static async loadMissingItemsAndParents<TItem, TId, TFilter>({
        treeStructure,
        itemsMap,
        options,
        itemsToLoad,
    }: LoadMissingItemsAndParentsOptions<TItem, TId, TFilter>): Promise<ItemsMap<TId, TItem>> {
        let newItemsMap = itemsMap;
        let iteration = 0;
        let prevMissingIds = new Set<TId>();
        while (true) {
            const missingIds = new Set<TId>();

            if (itemsToLoad && itemsToLoad.length > 0) {
                itemsToLoad.forEach((id) => {
                    if (!itemsMap.has(id)) {
                        missingIds.add(id);
                    }
                });
            }
            if (treeStructure.params.getParentId) {
                itemsMap.forEach((item) => {
                    const parentId = treeStructure.params.getParentId(item);
                    if (parentId != null && !itemsMap.has(parentId)) {
                        missingIds.add(parentId);
                    }
                });
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
                    const id = item ? treeStructure.params.getId(item) : null;
                    return id !== null;
                });

                newItemsMap = newItemsMap.setItems(newItems);

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
        return newItemsMap;
    }

    private static async loadItems<TItem, TId, TFilter>({
        treeStructure,
        options,
        parentId,
        parent,
        dataSourceState,
        remainingRowsCount,
        loadAll,
    }: LoadItemsOptions<TItem, TId, TFilter>) {
        const inputNodeInfo = treeStructure.nodeInfoById.get(parentId);
        const inputIds = treeStructure.byParentId.get(parentId);

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
                    const id = treeStructure.params.getId(item);
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
}
