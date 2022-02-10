import { DataSourceState, LazyDataSourceApi, LazyDataSourceApiRequestContext, LazyDataSourceApiRequestRange } from '../types';

export type LazyTreeFetchStrategy = 'sequential' | 'parallel'; // TBD: batch mode

export interface LazyTreeParams<TItem, TId, TFilter> {
    api: LazyDataSourceApi<TItem, TId, TFilter>;
    getId?(item: TItem): TId;
    getParentId?(item: TItem): TId;
    filter?: TFilter;
    getChildCount?(item: TItem): number;
    isFolded?: (item: TItem) => boolean;
    fetchStrategy?: LazyTreeFetchStrategy;
    loadAll?: boolean;
    loadAllChildren?(item: LazyTreeItem<TItem, TId>): boolean;
    flattenSearchResults?: boolean;
}

export interface LazyTreeList<TItem, TId> {
    items: LazyTreeItem<TItem, TId>[];
    count?: number;
    recursiveCount?: number;
}

export interface LazyTree<TItem, TId> extends LazyTreeList<TItem, TId> {
    byKey?: Record<string, TItem>;
    byParentKey?: Record<string, TItem[]>;
}

export interface LazyTreeItem<TItem, TId> {
    id: TId;
    item: TItem;
    children?: LazyTreeList<TItem, TId>;
}

export async function loadLazyTree<TItem, TId, TFilter>(
    inputNode: Readonly<LazyTree<TItem, TId>>,
    params: LazyTreeParams<TItem, TId, TFilter>,
    value: Readonly<DataSourceState>,
): Promise<LazyTree<TItem, TId>> {
    params = { fetchStrategy: 'sequential', ...params };
    const requiredRowsCount = value.topIndex + value.visibleCount;
    let isChanged = false;
    let newTree: LazyTree<TItem, TId> = {
        byKey: {},
        byParentKey: {},
        ...inputNode,
    };
    const apiWithCashing: LazyDataSourceApi<TItem, TId, TFilter> = (req, ctx) => params.api(req, ctx).then(res => {
        res.items.forEach(item => {
            const key = JSON.stringify(params.getId(item));
            newTree.byKey[key] = item;

            const parentId = params?.getParentId(item);
            if (parentId) {
                const parentKey = JSON.stringify(parentId);
                newTree.byParentKey[parentKey] = newTree.byParentKey[parentKey] || [];
                newTree.byParentKey[parentKey].push(item);
            }
        });

        isChanged = true;
        return res;
    });

    let newList = await loadNodeRec(inputNode, null, { ...params, api: apiWithCashing }, value, requiredRowsCount, params.loadAll);
    newTree = await loadMissingAndParents(newTree, value.checked, { ...params, api: apiWithCashing });

    if (isChanged) {
        return {
            ...newTree,
            items: newList.items,
            count: newList.count,
            recursiveCount: newList.recursiveCount,
        };
    } else {
        return inputNode;
    }
}

async function loadMissingAndParents<TItem, TId, TFilter>(
    inputNode: Readonly<LazyTree<TItem, TId>>,
    selection: TId[],
    params: LazyTreeParams<TItem, TId, TFilter>,
): Promise<LazyTree<TItem, TId>> {
    const newTree = { ...inputNode };
    const missing = new Set<TId>();

    const nodes = Object.keys(newTree.byKey);

    selection?.forEach(id => {
        !newTree.byKey[JSON.stringify(id)] && missing.add(id);
    });

    nodes?.forEach(i => {
        const node = newTree.byKey[i];
        const parentNodeId = params.getParentId(node);
        const parentNodeKey = JSON.stringify(parentNodeId);

        (parentNodeId && !newTree.byKey[parentNodeKey]) && missing.add(parentNodeId);
    });

    if (missing.size > 0) {
        await params.api({ ids: Array.from(missing) });
        return loadMissingAndParents(newTree, selection, params)
    } else {
        return inputNode;
    }
}

async function loadNodeRec<TItem, TId, TFilter>(
    inputNode: Readonly<LazyTree<TItem, TId>>,
    parent: Readonly<LazyTreeItem<TItem, TId>>,
    params: LazyTreeParams<TItem, TId, TFilter>,
    value: Readonly<DataSourceState>,
    requiredRowsCount: number,
    parentLoadAll: boolean,
) {
    let node: LazyTree<TItem, TId> = inputNode
        ? { ...inputNode, items: [...inputNode.items] }
        : { items: [] };

    const flatten = value.search && params.flattenSearchResults;

    // The function should return the same node, if it haven't changed.
    // I found no good way to do this in pure style, so we just track if there was any change, and return the same node if there's none
    let isChanged = false;

    // Selection cascading forces to load all nodes under particular node
    let loadAll = false;
    if (parentLoadAll) {
        loadAll = true;
        requiredRowsCount = Number.MAX_SAFE_INTEGER;
    }

    let missingCount = requiredRowsCount - node.items.length;

    let availableCount = node.count != null ? (node.count - node.items.length) : missingCount;

    const range: LazyDataSourceApiRequestRange = { from: node.items.length };

    if (!loadAll) {
        range.count = missingCount;
    }

    if (missingCount > 0 && availableCount > 0) {
        // Need to load additional items in the current layer

        let filter = { ...params.filter, ...value.filter };

        let requestContext: LazyDataSourceApiRequestContext<TItem, TId> = {};

        if (!flatten) {
            if (parent != null) {
                requestContext.parentId = parent.id;
                requestContext.parent = parent.item;
            } else {
                requestContext.parentId = null;
                requestContext.parent = null;
            }
        } // in flatten mode, we don't set parent and parentId even for root - as we don't want to limit results to top-level nodes only

        const response = await params.api({
            sorting: value.sorting,
            search: value.search,
            filter,
            range,
        }, requestContext);

        const from = (response.from == null) ? range.from : response.from;

        for (let n = 0; n < response.items.length; n++) {
            const item = response.items[n];
            const id = params.getId(item);
            node.items[n + from] = { id, item };
        }

        if (response.count !== null && response.count !== undefined) {
            node.count = response.count;
        } else if (response.items.length < missingCount) {
            node.count = from + response.items.length;
        }

        isChanged = true;
    }

    if (!flatten && params.getChildCount) {
        // Load children

        const childrenPromises: Promise<any>[] = [];
        let remainingRowsCount = requiredRowsCount;

        for (let n = 0; n < node.items.length; n++) {
            const item = node.items[n];
            let childrenCount = params.getChildCount(item.item);
            let isFoldable = !!childrenCount;

            remainingRowsCount--; // count the row itself

            if (isFoldable) {
                let isFolded = params.isFolded(item.item);

                let loadAll = parentLoadAll || (params.loadAllChildren && params.loadAllChildren(item));

                if ((!isFolded && remainingRowsCount > 0) || loadAll) {
                    const childUpdatePromise = loadNodeRec(item.children, item, params, value, remainingRowsCount, loadAll)
                        .then(updatedChild => {
                            if (updatedChild !== item.children) {
                                item.children = updatedChild;
                                isChanged = true;
                            }
                            childrenPromises.splice(childrenPromises.indexOf(childUpdatePromise), 1);
                        });

                    childrenPromises.push(childUpdatePromise);

                    if (params.fetchStrategy == 'sequential') {
                        await childUpdatePromise;
                    }

                    if (item.children?.recursiveCount != null) {
                        // We loaded all children recursively, so we know exact count
                        remainingRowsCount -= item.children.recursiveCount;
                    } else {
                        // Children are loading, we can only safely assume there was at least childrenCount rows (which is not recursive count)
                        remainingRowsCount -= childrenCount;
                    }
                }
            }
        }

        await Promise.all(childrenPromises);
    }

    let recursiveCount = node.count != null ? node.count : node.items.length;

    for (let n = 0; n < node.items.length; n++) {
        const item = node.items[n];
        if (item.children && item.children.recursiveCount != null) {
            recursiveCount += item.children.recursiveCount;
        }
    }

    if (node.recursiveCount !== recursiveCount) {
        node.recursiveCount = recursiveCount;
        isChanged = true;
    }

    if (isChanged) {
        return node;
    } else {
        return inputNode;
    }
}