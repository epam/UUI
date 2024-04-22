import { NOT_FOUND_RECORD } from '../constants';
import { newMap } from './map';
import { DataSourceState, IImmutableMap, IMap, PatchOptions, SortConfig, SortedPatchByParentId } from '../../../../../types';
import { buildComparators, composeComparators } from '../helpers';
import { PatchOrdering } from '../constants';
import { ITree } from '../ITree';

const groupByParentId = <TItem, TId>(
    patch: IMap<TId, TItem> | IImmutableMap<TId, TItem> | undefined,
    getParentId?: (item: TItem) => TId,
    complexIds?: boolean,
): IMap<TId, TItem[]> => {
    const patchByParentId = newMap<TId, TItem[]>({ getParentId, complexIds });
    if (!patch) {
        return patchByParentId;
    }

    for (const [, item] of patch) {
        const parentId = getParentId?.(item) ?? undefined;
        if (!patchByParentId.has(parentId)) {
            patchByParentId.set(parentId, []);
        }
        const prevItems = patchByParentId.get(parentId);
        patchByParentId.set(parentId, [...prevItems, item]);
    }
    return patchByParentId;
};

const getPatchByCategories = <TItem, TId>(
    items: TItem[],
    tree: ITree<TItem, TId>,
    patchAtLastSort: IMap<TId, TItem> | IImmutableMap<TId, TItem>,
    getNewItemPosition: PatchOptions<TItem, TId>['getNewItemPosition'],
    getItemTemporaryOrder: PatchOptions<TItem, TId>['getItemTemporaryOrder'] | undefined,
    isDeleted: undefined | ((item: TItem) => boolean),
    fixItemBetweenSortings?: boolean,
) => {
    const { getId, getParentId, complexIds } = tree.getParams();
    const top: TId[] = [];
    const bottom: TId[] = [];
    const updated: TId[] = [];
    const movedToOtherParent: TId[] = [];
    const updatedItemsMap: IMap<TId, TItem> = newMap({ complexIds });
    const newItems: TItem[] = [];
    const withTempOrder: TId[] = [];

    for (const item of items) {
        const id = getId(item);
        const itemInOriginalTree = tree.getById(id) !== NOT_FOUND_RECORD;
        const itemInPatchBeforeSort = patchAtLastSort.has(id);
        updatedItemsMap.set(id, item);
        newItems.push(item);
        const tempOrder = getItemTemporaryOrder?.(item);
        const prevItem = patchAtLastSort.get(id) ?? tree.getById(id) as TItem;
        const prevParentId = getParentId?.(prevItem) ?? undefined;
        const newParentId = getParentId?.(item) ?? undefined;
        if (!fixItemBetweenSortings) {
            const realPrevItem = tree.getById(id) as TItem;
            if (realPrevItem !== NOT_FOUND_RECORD) {
                const realPrevParentId = getParentId?.(realPrevItem) ?? undefined;
                if (realPrevParentId !== newParentId) {
                    movedToOtherParent.push(id);
                }
            }
        } else if (prevParentId !== newParentId) {
            movedToOtherParent.push(id);
        }

        if (tempOrder) {
            if (isDeleted?.(item)) {
                continue;
            }
            withTempOrder.push(id);
            continue;
        }

        if (!itemInPatchBeforeSort && !itemInOriginalTree) {
            const position = getNewItemPosition(item);

            if (isDeleted?.(item)) {
                continue;
            }

            if (position === PatchOrdering.BOTTOM) {
                bottom.push(id);
            } else {
                top.unshift(id);
            }
            continue;
        }

        if (prevParentId !== newParentId) {
            const position = getNewItemPosition(item);
            if (position === PatchOrdering.BOTTOM) {
                bottom.push(id);
            } else {
                top.unshift(id);
            }

            continue;
        }

        updated.push(id);
    }

    return { top, bottom, movedToOtherParent, updated, withTempOrder, updatedItemsMap, newItems };
};

const sortUpdatedItems = <TItem, TId>(
    updated: TId[],
    composedComparator: (a: TItem, b: TItem) => number,
    tree: ITree<TItem, TId>,
    patchAtLastSort: IMap<TId, TItem> | IImmutableMap<TId, TItem>,
) => {
    return updated.sort((aId, bId) => {
        const bItem = patchAtLastSort.get(bId) ?? tree.getById(bId) as TItem;
        const aItem = patchAtLastSort.get(aId) ?? tree.getById(aId) as TItem;

        return composedComparator(aItem, bItem);
    });
};

const sortByTemporaryOrder = <TItem, TId>(
    withTempOrder: TId[],
    getItemTemporaryOrder: PatchOptions<TItem, TId>['getItemTemporaryOrder'] | undefined,
    updatedItemsMap: IMap<TId, TItem>,
) => {
    const comparator = (a: string, b: string) => a < b ? -1 : 1;
    return withTempOrder.sort((aId, bId) => {
        const a = updatedItemsMap.get(aId);
        const b = updatedItemsMap.get(bId);
        return comparator(getItemTemporaryOrder(a), getItemTemporaryOrder((b)));
    });
};

const sortPatchByParentId = <TItem, TId, TFilter>(
    tree: ITree<TItem, TId>,
    groupedByParentId: IMap<TId, TItem[]>,
    getNewItemPosition: PatchOptions<TItem, TId>['getNewItemPosition'],
    getItemTemporaryOrder: PatchOptions<TItem, TId>['getItemTemporaryOrder'] | undefined,
    patchAtLastSort: IMap<TId, TItem> | IImmutableMap<TId, TItem>,
    sortBy: SortConfig<TItem>['sortBy'],
    getSortingComparator: SortConfig<TItem>['getSortingComparator'],
    sorting: DataSourceState<TFilter, TId>['sorting'],
    isDeleted: undefined | ((item: TItem) => boolean),
    fixItemBetweenSortings?: boolean,
) => {
    const { complexIds } = tree.getParams();
    const comparators = buildComparators({ sorting, sortBy, getSortingComparator, getId: tree.getParams().getId });
    const composedComparator = composeComparators(comparators, tree.getParams().getId);

    const sorted: SortedPatchByParentId<TItem, TId> = newMap({ complexIds });
    for (const [parentId, items] of groupedByParentId) {
        const { top, bottom, updated, movedToOtherParent, withTempOrder, updatedItemsMap, newItems } = getPatchByCategories(
            items,
            tree,
            patchAtLastSort,
            getNewItemPosition,
            getItemTemporaryOrder,
            isDeleted,
            fixItemBetweenSortings,
        );

        const sortedUpdated = sortUpdatedItems(updated, composedComparator, tree, patchAtLastSort);
        const sortedByTempOrder = sortByTemporaryOrder(withTempOrder, getItemTemporaryOrder, updatedItemsMap);

        sorted.set(parentId, {
            top,
            bottom,
            updated: sortedUpdated,
            moved: movedToOtherParent,
            withTempOrder: sortedByTempOrder,
            updatedItemsMap,
            newItems,
        });
    }
    return sorted;
};

export const getSortedPatchByParentId = <TItem, TId, TFilter>(
    tree: ITree<TItem, TId>,
    patch: IMap<TId, TItem> | IImmutableMap<TId, TItem>,
    patchAtLastSort: IMap<TId, TItem> | IImmutableMap<TId, TItem>,
    getNewItemPosition: PatchOptions<TItem, TId>['getNewItemPosition'],
    getItemTemporaryOrder: PatchOptions<TItem, TId>['getItemTemporaryOrder'] | undefined,
    sortBy: SortConfig<TItem>['sortBy'],
    getSortingComparator: SortConfig<TItem>['getSortingComparator'],
    sorting: DataSourceState<TFilter, TId>['sorting'],
    isDeleted?: (item: TItem) => boolean,
    fixItemBetweenSortings?: boolean,
) => {
    const params = tree.getParams();
    const grouped = groupByParentId(patch, params.getParentId, params.complexIds);
    return sortPatchByParentId(
        tree,
        grouped,
        getNewItemPosition,
        getItemTemporaryOrder,
        patchAtLastSort,
        sortBy,
        getSortingComparator,
        sorting,
        isDeleted,
        fixItemBetweenSortings,
    );
};
