import { DataSourceState, LazyDataSourceApi } from '../types';

export interface LazyTreeParams<TItem, TId, TFilter> {
    api: LazyDataSourceApi<TItem, TId, TFilter>;
    getId?(item: TItem): TId;
    filter?: TFilter;
    isFolded?: (item: TItem) => boolean;
    getChildCount?(item: TItem): number;
    loadAll?: boolean;
    loadAllChildren?(item: LazyTreeItem<TItem, TId>): boolean;
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

export async function loadLazyTree<TItem, TId, TFilter>(
    node: Readonly<LazyTreeList<TItem, TId>>,
    params: LazyTreeParams<TItem, TId, TFilter>,
    value: Readonly<DataSourceState>,
) {
    const requiredRowsCount = value.topIndex + value.visibleCount;
    return loadNodeRec(node, null, params, value, requiredRowsCount, params.loadAll);
}

async function loadNodeRec<TItem, TId, TFilter>(
    inputNode: Readonly<LazyTreeList<TItem, TId>>,
    parent: Readonly<LazyTreeItem<TItem, TId>>,
    params: LazyTreeParams<TItem, TId, TFilter>,
    value: Readonly<DataSourceState>,
    requiredRowsCount: number,
    parentLoadAll: boolean,
) {
    if (parentLoadAll) {
        requiredRowsCount = 100500;
    }

    let node: LazyTreeList<TItem, TId> = inputNode
        ? { ...inputNode, items: [ ...inputNode.items ] }
        : { items: [] };

    let isChanged = false;

    let missingCount = requiredRowsCount - node.items.length;

    let availableCount = node.count != null ? (node.count - node.items.length) : missingCount;

    const range = { from: node.items.length, count: missingCount };

    if (missingCount > 0 && availableCount > 0) {

        let filter = { ...params.filter, ...value.filter };

        const response = await params.api({
            sorting: value.sorting,
            search: value.search,
            filter,
            range,
        }, {
            parentId: parent?.id,
            parent: parent?.item,
        });

        const from = (response.from == null) ? range.from : response.from;

        for (let n = 0; n < response.items.length; n++) {
            const item = response.items[n];
            const id = params.getId(item);
            node.items[n + from] = { id, item };
        }

        if (response.count !== null && response.count !== undefined) {
            node.count = response.count;
        } else if (response.items.length < range.count) {
            node.count = from + response.items.length;
        }

        isChanged = true;
    }

    if (params.getChildCount) {
        const childrenPromises: Promise<any>[] = [];
        let remainingRowsCount = requiredRowsCount;

        for (let n = 0; n < node.items.length; n++) {
            const item = node.items[n];
            let childrenCount = params.getChildCount(item.item);
            let isFoldable = !!childrenCount;

            remainingRowsCount--;

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
                        });

                    childrenPromises.push(childUpdatePromise);
                    if (item.children?.recursiveCount != null) {
                        remainingRowsCount -= item.children.recursiveCount;
                    } else {
                        remainingRowsCount -= childrenCount;
                    }
                }
            }
        }

        if (childrenPromises.length > 0) {
            await Promise.all(childrenPromises);
        }
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