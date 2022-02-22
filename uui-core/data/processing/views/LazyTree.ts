import { DataSourceState, LazyDataSourceApi, LazyDataSourceApiRequestContext, LazyDataSourceApiRequestRange } from '../types';

export type LazyTreeFetchStrategy = 'sequential' | 'parallel'; // TBD: batch mode

export interface LazyTreeParams<TItem, TId, TFilter> {
    api: LazyDataSourceApi<TItem, TId, TFilter>;
    getId?(item: TItem): TId;
    getParentId?(item: TItem): TId;
    filter?: TFilter;
    getChildCount?(item: TItem): number;
    flattenSearchResults?: boolean;
}

export interface LazyTreeLoadParams<TItem, TId> {
    fetchStrategy?: LazyTreeFetchStrategy;
    loadAll?: boolean;
    loadAllChildren?(item: LazyTreeItem<TItem, TId>): boolean;
    isFolded?: (item: TItem) => boolean;
}

export interface LazyTreeList<TItem, TId> {
    items: LazyTreeItem<TItem, TId>[];
    count?: number;
    recursiveCount?: number;
}

export interface LazyTreeItem<TItem, TId> {
    id: TId;
    item: TItem;
    children?: LazyTreeList<TItem, TId>;
}

export class LazyTree<TItem, TId, TFilter> {

    private constructor(
        private params: LazyTreeParams<TItem, TId, TFilter>,
        public readonly rootList: LazyTreeList<TItem, TId>,
        public readonly byId: Map<TId, TItem> = new Map<TId, TItem>(),
        public readonly byParentId: Map<TId, TItem[]> = new Map<TId, TItem[]>(),
    ) {
        this.params.getId = this.params.getId || ((i: any) => i.id);
    }

    public static blank<TItem, TId, TFilter>(params: LazyTreeParams<TItem, TId, TFilter>) {
        return new LazyTree(params, { items: [] }, new Map<TId, TItem>(), new Map<TId, TItem[]>());
    }

    /** Clears the tree structure, keeping byIds and byParentIds map */
    public clearStructureAndUpdateParams(params: LazyTreeParams<TItem, TId, TFilter>) {
        return new LazyTree(params, { items: [] }, new Map<TId, TItem>(), new Map<TId, TItem[]>());
    }

    public async loadMissing(
        loadParams: LazyTreeLoadParams<TItem, TId>,
        value: Readonly<DataSourceState>,
    ): Promise<LazyTree<TItem, TId, TFilter>> {
        let result = await this.loadNodes(loadParams, value);
        result = await result.loadMissingIdsAndParents(value.checked, true);
        return result;
    }

    private async loadNodes(
        loadParams: LazyTreeLoadParams<TItem, TId>,
        value: Readonly<DataSourceState>,
    ): Promise<LazyTree<TItem, TId, TFilter>> {
        const originalRootList = this.rootList;
        const params = this.params;
        loadParams = { fetchStrategy: 'sequential', ...loadParams };

        const newlyLoadedNodes: TItem[] = [];

        const apiWithCashing: LazyDataSourceApi<TItem, TId, TFilter> = (req, ctx) => params.api(req, ctx).then(res => {
            newlyLoadedNodes.push(...res.items);
            return res;
        });

        const requiredRowsCount = value.topIndex + value.visibleCount;

        let newRootList = await this.loadNodeRec(
            originalRootList,
            apiWithCashing,
            null,
            loadParams,
            value,
            requiredRowsCount,
            loadParams.loadAll
        );

        let result: LazyTree<TItem, TId, TFilter> = this;

        if (newRootList !== originalRootList) {
            result = new LazyTree<TItem, TId, TFilter>(
                this.params,
                newRootList,
                this.byId,
                this.byParentId,
            );
        }

        if (newlyLoadedNodes.length > 0) {
            result = result.appendItemsToByIdMaps(newlyLoadedNodes);
        }

        return result;
    }

    private appendItemsToByIdMaps(itemsToAdd: TItem[]) {
        if (!itemsToAdd || itemsToAdd.length === 0) {
            return this;
        }

        const newById = new Map(this.byId);

        itemsToAdd.forEach(node => {
            const id = this.params.getId(node);
            newById.set(id, node);
        })

        const newByParentId = new Map(this.byParentId); // shallow clone, still need to copy arrays inside!

        if (this.params.getParentId) {
            itemsToAdd.forEach(node => {
                const parentId = this.params.getParentId(node);
                let list = newByParentId.get(parentId);
                if (!list) {
                    list = [];
                    newByParentId.set(parentId, list);
                } else if (list === this.byParentId.get(parentId)) { // need to create shallow copy
                    list = [...list];
                }
                list.push(node);
            });
        }

        return new LazyTree(
            this.params,
            this.rootList,
            newById,
            newByParentId,
        )
    }

    private async loadNodeRec(
        inputNode: Readonly<LazyTreeList<TItem, TId>>,
        api: LazyDataSourceApi<TItem, TId, TFilter>,
        parent: Readonly<LazyTreeItem<TItem, TId>>,
        loadParams: LazyTreeLoadParams<TItem, TId>,
        value: Readonly<DataSourceState>,
        requiredRowsCount: number,
        parentLoadAll: boolean,
    ) {
        let node: LazyTreeList<TItem, TId> = inputNode
            ? { ...inputNode, items: [...inputNode.items] }
            : { items: [] };

        const flatten = value.search && this.params.flattenSearchResults;

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

            let filter = { ...this.params.filter, ...value.filter } as TFilter;

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

            const response = await api({
                sorting: value.sorting,
                search: value.search,
                filter,
                range,
            }, requestContext);

            const from = (response.from == null) ? range.from : response.from;

            for (let n = 0; n < response.items.length; n++) {
                const item = response.items[n];
                const id = this.params.getId(item);
                node.items[n + from] = { id, item };
            }

            if (response.count !== null && response.count !== undefined) {
                node.count = response.count;
            } else if (response.items.length < missingCount) {
                node.count = from + response.items.length;
            }

            isChanged = true;
        }

        if (!flatten && this.params.getChildCount) {
            // Load children

            const childrenPromises: Promise<any>[] = [];
            let remainingRowsCount = requiredRowsCount;

            for (let n = 0; n < node.items.length; n++) {
                const item = node.items[n];
                let childrenCount = this.params.getChildCount(item.item);
                let isFoldable = !!childrenCount;

                remainingRowsCount--; // count the row itself

                if (isFoldable) {
                    let isFolded = loadParams.isFolded(item.item);

                    let loadAll = parentLoadAll || (loadParams.loadAllChildren && loadParams.loadAllChildren(item));

                    if ((!isFolded && remainingRowsCount > 0) || loadAll) {
                        const childUpdatePromise = this.loadNodeRec(item.children, api, item, loadParams, value, remainingRowsCount, loadAll)
                            .then(updatedChild => {
                                if (updatedChild !== item.children) {
                                    item.children = updatedChild;
                                    isChanged = true;
                                }
                                childrenPromises.splice(childrenPromises.indexOf(childUpdatePromise), 1);
                            });

                        childrenPromises.push(childUpdatePromise);

                        if (loadParams.fetchStrategy == 'sequential') {
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

    private async loadMissingIdsAndParents(
        idsToLoad: TId[],
        loadMissingParents: boolean,
    ): Promise<LazyTree<TItem, TId, TFilter>> {
        let result: LazyTree<TItem, TId, TFilter> = this;
        let iteration = 0;
        while(true) {
            let missingIds = new Set<TId>();

            if (idsToLoad && idsToLoad.length > 0) {
                idsToLoad.forEach(id => {
                    if (!result.byId.has(id)) {
                        missingIds.add(id);
                    }
                })
            }

            if (this.params.getParentId && loadMissingParents) {
                result.byId.forEach((item, key) => {
                    const parentId = this.params.getParentId(item);
                    if (parentId != null && !result.byId.has(parentId)) {
                        missingIds.add(parentId);
                    }
                });
            }

            if (missingIds.size === 0) {
                return result;
            } else {
                const ids = Array.from(missingIds);
                const response = await this.params.api({ ids });
                if (response.items.length != ids.length) {
                    throw new Error("LazyTree: api does not returned requested items. Check that you handle 'ids' argument correctly.");
                }
                result = result.appendItemsToByIdMaps(response.items);
            }
            iteration++;

            if (iteration > 1000) {
                throw new Error('LazyTree: More than 1000 iterations are made to load required items and their parents by ID. Check your api implementation');
            }
        }
    }
}