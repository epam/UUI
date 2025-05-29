import isEqual from 'react-fast-compare';
import { CascadeSelection, CascadeSelectionTypes, DataRowPathItem, DataSourceState, IMap, LazyDataSourceApi } from '../../../../types';
import { ITree } from './ITree';
import { FULLY_LOADED, NOT_FOUND_RECORD, ROOT_ID } from './constants';
import { FetchingHelper } from './treeStructure/helpers/FetchingHelper';
import { ITreeNodeInfo, ITreeParams } from './treeStructure/types';
import { TreeStructure } from './treeStructure';
import { ItemsMap } from './ItemsMap';
import { ItemsAccessor } from './ItemsAccessor';
import { newMap } from './helpers';

export interface LoadOptions<TItem, TId, TFilter = any> {
    tree: ITree<TItem, TId>;
    api: LazyDataSourceApi<TItem, TId, TFilter>;
    getChildCount?(item: TItem): number;
    isFolded?: (item: TItem) => boolean;
    dataSourceState: DataSourceState<TFilter, TId>;
    filter?: TFilter;
}

export interface LoadMissingOnCheckOptions<TItem, TId, TFilter = any> extends Omit<LoadOptions<TItem, TId, TFilter>, 'withNestedChildren'> {
    cascadeSelection?: CascadeSelection;
    checkedId?: TId;
    isRoot: boolean;
    isChecked: boolean;
}

/**
 * Structured result of tree records loading.
 */
export interface ITreeLoadResult<TItem, TId> {
    /**
     * Loaded records.
     */
    loadedItems: TItem[];
    /**
     * Loaded records, structured by parents IDs.
     */
    byParentId: IMap<TId, TId[]>;
    /**
     * Loading node info, like count/assumedCount/totalCount, by IDs.
     */
    nodeInfoById: IMap<TId, ITreeNodeInfo>;
}

export class Tree {
    public static createFromItems<TItem, TId>({ params, items }: {
        params: ITreeParams<TItem, TId>,
        items: TItem[],
    }) {
        const itemsMap = ItemsMap.blank<TId, TItem>(params);
        const itemsAccessor = ItemsAccessor.toItemsAccessor(itemsMap.setItems(items));
        return TreeStructure.createFromItems({ params, items, itemsAccessor });
    }

    public static getParents<TItem, TId>(id: TId, tree: ITree<TItem, TId>) {
        const parentIds: TId[] = [];
        let parentId = id;
        while (true) {
            const item = tree.getById(parentId);
            if (item === NOT_FOUND_RECORD) {
                break;
            }
            parentId = tree.getParams().getParentId?.(item);
            if (parentId === undefined || parentId === null) {
                break;
            }
            parentIds.unshift(parentId);
        }
        return parentIds;
    }

    public static getPathById<TItem, TId>(id: TId, tree: ITree<TItem, TId>): DataRowPathItem<TId, TItem>[] {
        const foundParents = this.getParents(id, tree);
        const path: DataRowPathItem<TId, TItem>[] = [];
        foundParents.forEach((parentId) => {
            const parent = tree.getById(parentId);
            if (parent === NOT_FOUND_RECORD) {
                return;
            }
            const pathItem: DataRowPathItem<TId, TItem> = this.getPathItem(parent, tree);
            path.push(pathItem);
        });
        return path;
    }

    public static getPathItem<TItem, TId>(item: TItem, tree: ITree<TItem, TId>): DataRowPathItem<TId, TItem> {
        const parentId = tree.getParams().getParentId?.(item);
        const id = tree.getParams().getId(item);

        const { ids, count, status } = tree.getItems(parentId);
        const lastId = ids[ids.length - 1];

        const isLastChild = lastId !== undefined
            && lastId === id
            && status === FULLY_LOADED
            && count === ids.length;

        return {
            id: tree.getParams().getId(item),
            value: item,
            isLastChild,
        };
    }

    public static forEach<TItem, TId>(
        tree: ITree<TItem, TId>,
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
                const item = tree.getById(id);
                const parentId = item !== NOT_FOUND_RECORD ? tree.getParams().getParentId?.(item) : undefined;
                walkChildrenRec(item === NOT_FOUND_RECORD ? undefined : item, id, parentId);
            });
        };

        const walkChildrenRec = (item: TItem, id: TId, parentId: TId) => {
            if (options.direction === 'top-down') {
                action(item, id, parentId, stop);
            }
            const { ids: childrenIds } = tree.getItems(id);
            childrenIds && iterateNodes(childrenIds);
            if (options.direction === 'bottom-up') {
                action(item, id, parentId, stop);
            }
        };

        if (options.includeParent) {
            iterateNodes([options.parentId]);
        } else {
            iterateNodes(tree.getItems(options.parentId).ids);
        }
    }

    public static forEachChildren<TItem, TId>(
        tree: ITree<TItem, TId>,
        action: (id: TId) => void,
        isSelectable: (id: TId, item: TItem | typeof NOT_FOUND_RECORD) => boolean,
        parentId?: TId,
        includeParent: boolean = true,
    ) {
        this.forEach(
            tree,
            (item, id) => {
                if (item && isSelectable(id, item)) {
                    action(id);
                }
            },
            { parentId: parentId, includeParent },
        );
    }

    public static async load<TItem, TId, TFilter = any>({
        tree,
        dataSourceState,
        api,
        getChildCount,
        isFolded,
        filter,
    }: LoadOptions<TItem, TId, TFilter>): Promise<ITreeLoadResult<TItem, TId>> {
        return await FetchingHelper.load<TItem, TId, TFilter>({
            tree,
            options: {
                api,
                getChildCount,
                isFolded,
                filter: { ...dataSourceState?.filter, ...filter },
            },
            dataSourceState,
        });
    }

    public static async loadMissingOnCheck<TItem, TId, TFilter = any>({
        tree,
        dataSourceState,
        api,
        getChildCount,
        isFolded,
        filter,
        cascadeSelection,
        isRoot,
        isChecked,
        checkedId,
    }: LoadMissingOnCheckOptions<TItem, TId, TFilter>): Promise<ITree<TItem, TId> | ITreeLoadResult<TItem, TId>> {
        const isImplicitMode = cascadeSelection === CascadeSelectionTypes.IMPLICIT;

        if (!cascadeSelection && !isRoot) {
            return tree;
        }

        const parents = this.getParents(checkedId, tree);
        return await FetchingHelper.load<TItem, TId, TFilter>({
            tree,
            options: {
                api,
                getChildCount,
                isFolded,
                filter: { ...dataSourceState?.filter, ...filter },
                loadAllChildren: (itemId) => {
                    const loadAllConfig = { nestedChildren: !isImplicitMode, children: false };
                    if (!cascadeSelection) {
                        return { ...loadAllConfig, children: isChecked && isRoot };
                    }

                    if (!isChecked && isRoot) {
                        return { ...loadAllConfig, children: false };
                    }

                    if (isImplicitMode) {
                        return { ...loadAllConfig, children: itemId === ROOT_ID || parents.some((parent) => isEqual(parent, itemId)) };
                    }

                    const { ids } = tree.getItems(undefined);
                    const rootIsNotLoaded = ids.length === 0;

                    const shouldLoadChildrenAfterSearch = (!!dataSourceState.search?.length
                        && (parents.some((parent) => isEqual(parent, itemId))
                        || (itemId === ROOT_ID && rootIsNotLoaded)));

                    // `isEqual` is used, because complex ids can be recreated after fetching of parents.
                    // So, they should be compared not by reference, but by value.
                    const shouldLoadAllChildren = isRoot
                        || isEqual(itemId, checkedId)
                        || shouldLoadChildrenAfterSearch;

                    return { children: shouldLoadAllChildren, nestedChildren: !shouldLoadChildrenAfterSearch };
                },
                isLoadStrict: true,
            },
            dataSourceState: { ...dataSourceState, search: null },
        });
    }

    public static computeSubtotals<TItem, TId, TSubtotals>(
        tree: ITree<TItem, TId>,
        get: (item: TItem, hasChildren: boolean) => TSubtotals,
        add: (a: TSubtotals, b: TSubtotals) => TSubtotals,
    ): IMap<TId, TSubtotals> {
        const subtotalsMap = newMap<TId | undefined, TSubtotals>(tree.getParams());

        Tree.forEach(
            tree,
            (item, id, parentId) => {
                const { ids } = tree.getItems(id);
                const hasChildren = ids.length > 0;
                let itemSubtotals = get(item, hasChildren);

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
