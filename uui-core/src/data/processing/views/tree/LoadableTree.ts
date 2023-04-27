import isEqual from 'lodash.isequal';
import {
    DataSourceState, IMap, LazyDataSourceApiRequestContext, LazyDataSourceApiRequestRange,
} from '../../../../types';
import { EditableTree } from './EditableTree';
import { ITree, LoadTreeOptions, TreeNodeInfo } from './ITree';

export abstract class LoadableTree<TItem, TId> extends EditableTree<TItem, TId> {
    public async load<TFilter>(options: LoadTreeOptions<TItem, TId, TFilter>, value: Readonly<DataSourceState>, withNestedChildren: boolean = true) {
        let tree = await this.loadMissing(options, value, withNestedChildren);
        tree = await tree.loadMissingIdsAndParents(options, value.checked);
        return tree;
    }

    public async loadMissingIdsAndParents<TFilter>(options: LoadTreeOptions<TItem, TId, TFilter>, idsToLoad: TId[]): Promise<ITree<TItem, TId>> {
        let byId = this.byId;
        let iteration = 0;
        let prevMissingIds = new Set<TId>();
        while (true) {
            const missingIds = new Set<TId>();

            if (idsToLoad && idsToLoad.length > 0) {
                idsToLoad.forEach((id) => {
                    if (!byId.has(id)) {
                        missingIds.add(id);
                    }
                });
            }
            if (this.params.getParentId) {
                for (const [, item] of byId) {
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

                if (response.items.length !== ids.length) {
                    console.error(`LazyTree: api does not returned requested items. Check that you handle 'ids' argument correctly.
                        Read more here: https://github.com/epam/UUI/issues/89`);
                }

                // Clone before first update
                byId = byId === this.byId ? this.cloneMap(byId) : byId;

                response.items.forEach((item) => {
                    const id = item ? this.getId(item) : null;
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

        if (byId === this.byId) {
            return this;
        } else {
            return this.newInstance(this.params, byId, this.byParentId, this.nodeInfoById);
        }
    }

    public async loadMissing<TFilter>(
        options: LoadTreeOptions<TItem, TId, TFilter>,
        value: Readonly<DataSourceState>,
        withNestedChildren: boolean = true,
    ): Promise<ITree<TItem, TId>> {
        const requiredRowsCount = value.topIndex + value.visibleCount;

        let byId: IMap<TId, TItem> = this.byId;
        let byParentId = this.byParentId;
        let nodeInfoById = this.nodeInfoById;

        const flatten = value.search && options.flattenSearchResults;

        const loadRecursive = async (parentId: TId, parent: TItem, parentLoadAll: boolean, remainingRowsCount: number) => {
            let recursiveLoadedCount = 0;
            const currentIds = byParentId.get(parentId);
            const currentNodeInfo = this.nodeInfoById.get(parentId);
            const { ids, nodeInfo, loadedItems } = await this.loadItems(currentIds, currentNodeInfo, options, parentId, parent, value, remainingRowsCount, parentLoadAll);

            if (ids !== currentIds || nodeInfo !== currentNodeInfo) {
                byParentId = byParentId === this.byParentId ? this.cloneMap(byParentId) : byParentId;
                byParentId.set(parentId, ids);
                nodeInfoById = nodeInfoById === this.nodeInfoById ? this.cloneMap(nodeInfoById) : nodeInfoById;
                nodeInfoById.set(parentId, nodeInfo);
            }

            recursiveLoadedCount += ids.length;

            if (loadedItems.length > 0) {
                // Clone the map if it's not cloned yet
                byId = byId === this.byId ? this.cloneMap(byId) : byId;

                loadedItems.forEach((item) => {
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

        return this.newInstance(this.params, byId, byParentId, nodeInfoById);
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
        const loadedItems: TItem[] = [];

        const flatten = value.search && options.flattenSearchResults;

        // Selection cascading forces to load all nodes under particular node
        if (loadAll) {
            requiredRowsCount = Number.MAX_SAFE_INTEGER;
        }

        const missingCount = requiredRowsCount - ids.length;

        const availableCount = nodeInfo.count != null ? nodeInfo.count - ids.length : missingCount;

        const range: LazyDataSourceApiRequestRange = { from: ids.length };

        if (!loadAll) {
            range.count = missingCount;
        }

        if (missingCount > 0 && availableCount > 0) {
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
                    sorting: value.sorting,
                    search: value.search,
                    filter: options.filter,
                    range,
                    page: value.page,
                    pageSize: value.pageSize,
                },
                requestContext,
            );

            const from = response.from == null ? range.from : response.from;

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
        };
    }
}
