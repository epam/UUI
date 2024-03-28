import { NOT_FOUND_RECORD } from '../constants';
import { newMap } from './map';
import { DataSourceState, IImmutableMap, IMap, PatchItemsOptions, SortedPatchByParentId } from '../../../../../types';
import { SortConfig } from '../hooks/strategies/types';
import { buildComparators, composeComparetors } from '../helpers';
import { PatchOrdering } from '../PatchOrderingMap';
import { ITree } from '../ITree';

const groupByParentId = <TItem, TId>(
    patchItems: IMap<TId, TItem> | IImmutableMap<TId, TItem> | undefined,
    getParentId?: (item: TItem) => TId,
    complexIds?: boolean,
): IMap<TId, TItem[]> => {
    const patchByParentId = newMap<TId, TItem[]>({ getParentId, complexIds });
    if (!patchItems) {
        return patchByParentId;
    }

    for (const [, item] of patchItems) {
        const parentId = getParentId?.(item) ?? undefined;
        if (!patchByParentId.has(parentId)) {
            patchByParentId.set(parentId, []);
        }
        const prevItems = patchByParentId.get(parentId);
        patchByParentId.set(parentId, [...prevItems, item]);
    }
    return patchByParentId;
};

const getPatchItemsByCategories = <TItem, TId>(
    items: TItem[],
    tree: ITree<TItem, TId>,
    patchItemsAtLastSort: IMap<TId, TItem> | IImmutableMap<TId, TItem>,
    getNewItemPosition: PatchItemsOptions<TItem, TId>['getNewItemPosition'],
    getItemTemporaryOrder: PatchItemsOptions<TItem, TId>['getItemTemporaryOrder'] | undefined,
    isDeleted: undefined | ((item: TItem) => boolean),
) => {
    const { getId, getParentId, complexIds } = tree.getParams();
    const indexes = new Map<TItem, number>();
    items.forEach((item, index) => indexes.set(item, index));

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
        const itemInPatchBeforeSort = patchItemsAtLastSort.has(id);
        updatedItemsMap.set(id, item);
        newItems.push(item);
        const tempOrder = getItemTemporaryOrder?.(item);

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
        const prevItem = patchItemsAtLastSort.get(id) ?? tree.getById(id) as TItem;
        const prevParentId = getParentId?.(prevItem) ?? undefined;
        const newParentId = getParentId?.(item) ?? undefined;
        if (prevParentId !== newParentId) {
            if (itemInOriginalTree) {
                movedToOtherParent.push(id);
            }

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

    return { top, bottom, movedToOtherParent, updated, withTempOrder, updatedItemsMap, newItems, indexes };
};

const sortUpdatedItems = <TItem, TId>(
    updated: TId[],
    composedComparator: (a: TItem, b: TItem) => number,
    tree: ITree<TItem, TId>,
    patchItemsAtLastSort: IMap<TId, TItem> | IImmutableMap<TId, TItem>,
    updatedItemsMap: IMap<TId, TItem>,
    indexes: Map<TItem, number>,
) => {
    return updated.sort((aId, bId) => {
        const a = updatedItemsMap.get(aId);
        const b = updatedItemsMap.get(bId);
        const bItem = patchItemsAtLastSort.get(bId) ?? tree.getById(bId) as TItem;
        const aItem = patchItemsAtLastSort.get(aId) ?? tree.getById(aId) as TItem;

        const result = composedComparator(aItem, bItem);
        if (result === 0) {
            return indexes.get(a) - indexes.get(b);
        }

        return result;
    });
};

const sortByTemporaryOrder = <TItem, TId>(
    withTempOrder: TId[],
    getItemTemporaryOrder: PatchItemsOptions<TItem, TId>['getItemTemporaryOrder'] | undefined,
    updatedItemsMap: IMap<TId, TItem>,
) => {
    const comparator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' }).compare;
    return withTempOrder.sort((aId, bId) => {
        const a = updatedItemsMap.get(aId);
        const b = updatedItemsMap.get(bId);
        return comparator(getItemTemporaryOrder(a), getItemTemporaryOrder((b)));
    });
};

const sortPatchByParentId = <TItem, TId, TFilter>(
    tree: ITree<TItem, TId>,
    groupedByParentId: IMap<TId, TItem[]>,
    getNewItemPosition: PatchItemsOptions<TItem, TId>['getNewItemPosition'],
    getItemTemporaryOrder: PatchItemsOptions<TItem, TId>['getItemTemporaryOrder'] | undefined,
    patchItemsAtLastSort: IMap<TId, TItem> | IImmutableMap<TId, TItem>,
    sortBy: SortConfig<TItem>['sortBy'],
    sorting: DataSourceState<TFilter, TId>['sorting'],
    isDeleted: undefined | ((item: TItem) => boolean),
) => {
    const { complexIds } = tree.getParams();
    const comparators = buildComparators({ sorting, sortBy });
    const composedComparator = composeComparetors(comparators);

    const sorted: SortedPatchByParentId<TItem, TId> = newMap({ complexIds });
    for (const [parentId, items] of groupedByParentId) {
        const { top, bottom, updated, movedToOtherParent, withTempOrder, updatedItemsMap, newItems, indexes } = getPatchItemsByCategories(
            items,
            tree,
            patchItemsAtLastSort,
            getNewItemPosition,
            getItemTemporaryOrder,
            isDeleted,
        );

        const sortedUpdated = sortUpdatedItems(updated, composedComparator, tree, patchItemsAtLastSort, updatedItemsMap, indexes);
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
    patchItems: IMap<TId, TItem> | IImmutableMap<TId, TItem>,
    patchItemsAtLastSort: IMap<TId, TItem> | IImmutableMap<TId, TItem>,
    getNewItemPosition: PatchItemsOptions<TItem, TId>['getNewItemPosition'],
    getItemTemporaryOrder: PatchItemsOptions<TItem, TId>['getItemTemporaryOrder'] | undefined,
    sortBy: SortConfig<TItem>['sortBy'],
    sorting: DataSourceState<TFilter, TId>['sorting'],
    isDeleted?: (item: TItem) => boolean,
) => {
    const params = tree.getParams();
    const grouped = groupByParentId(patchItems, params.getParentId, params.complexIds);
    return sortPatchByParentId(tree, grouped, getNewItemPosition, getItemTemporaryOrder, patchItemsAtLastSort, sortBy, sorting, isDeleted);
};
