import { useMemo } from 'react';
import { NOT_FOUND_RECORD, TreeState, newMap } from '../../newTree';
import { DataSourceState, IImmutableMap, IMap, PatchItemsOptions, SortedPatchByParentId } from '../../../../../../types';
import { SortConfig } from '../strategies/types';
import { buildComparators, composeComparetors } from '../../helpers';
import { PatchOrderingTypes } from '../../PatchOrderingMap';
import { useSimplePrevious } from '../../../../../../hooks';
import { ITree } from '../../newTree/ITree';

export interface UsePatchTreeProps<TItem, TId, TFilter = any> extends PatchItemsOptions<TItem, TId>, SortConfig<TItem> {
    tree: TreeState<TItem, TId>;
    sorting: DataSourceState<TFilter, TId>['sorting'];
}

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

export const sortPatchByParentId = <TItem, TId, TFilter>(
    tree: ITree<TItem, TId>,
    groupedByParentId: IMap<TId, TItem[]>,
    getNewItemPosition: PatchItemsOptions<TItem, TId>['getNewItemPosition'],
    getItemTemporaryOrder: PatchItemsOptions<TItem, TId>['getItemTemporaryOrder'] | undefined,
    patchItemsAtLastSort: IMap<TId, TItem> | IImmutableMap<TId, TItem>,
    sortBy: SortConfig<TItem>['sortBy'],
    sorting: DataSourceState<TFilter, TId>['sorting'],
    isDeleted: undefined | ((item: TItem) => boolean),
    getId: (item: TItem) => TId,
    getParentId: (item: TItem) => TId,
    complexIds?: boolean,
) => {
    const comparators = buildComparators({ sorting, sortBy });
    const composedComparator = composeComparetors(comparators);

    const sorted: SortedPatchByParentId<TItem, TId> = newMap({ complexIds });
    for (const [parentId, items] of groupedByParentId) {
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

                if (position === PatchOrderingTypes.BOTTOM) {
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
                if (position === PatchOrderingTypes.BOTTOM) {
                    bottom.push(id);
                } else {
                    top.unshift(id);
                }

                continue;
            }

            updated.push(id);
        }

        const sortedUpdated = updated.sort((aId, bId) => {
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

        const comparator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' }).compare;
        const sortedWithTempOrder = withTempOrder.sort((aId, bId) => {
            const a = updatedItemsMap.get(aId);
            const b = updatedItemsMap.get(bId);
            return comparator(getItemTemporaryOrder(a), getItemTemporaryOrder((b)));
        });

        sorted.set(parentId, {
            top,
            bottom,
            updated: sortedUpdated,
            moved: movedToOtherParent,
            withTempOrder: sortedWithTempOrder,
            updatedItemsMap,
            newItems,
        });
    }
    return sorted;
};

const getSortedPatchByParentId = <TItem, TId, TFilter>(
    tree: ITree<TItem, TId>,
    patchItems: IMap<TId, TItem> | IImmutableMap<TId, TItem>,
    patchItemsAtLastSort: IMap<TId, TItem> | IImmutableMap<TId, TItem>,
    getNewItemPosition: PatchItemsOptions<TItem, TId>['getNewItemPosition'],
    getItemTemporaryOrder: PatchItemsOptions<TItem, TId>['getItemTemporaryOrder'] | undefined,
    sortBy: SortConfig<TItem>['sortBy'],
    sorting: DataSourceState<TFilter, TId>['sorting'],
    isDeleted?: (item: TItem) => boolean,
    getId?: (item: TItem) => TId,
    getParentId?: (item: TItem) => TId,
    complexIds?: boolean,
) => {
    const grouped = groupByParentId(patchItems, getParentId, complexIds);
    return sortPatchByParentId(tree, grouped, getNewItemPosition, getItemTemporaryOrder, patchItemsAtLastSort, sortBy, sorting, isDeleted, getId, getParentId);
};

export function usePatchTree<TItem, TId, TFilter = any>(
    {
        tree,
        patchItems,
        getNewItemPosition = () => PatchOrderingTypes.TOP,
        getItemTemporaryOrder,
        isDeleted,
        sorting,
        sortBy,
    }: UsePatchTreeProps<TItem, TId, TFilter>,
) {
    const prevPatchItems = useSimplePrevious(patchItems);
    const params = tree.visible.getParams();

    const patchItemsAtLastSort = useMemo(() => {
        return prevPatchItems === null ? newMap<TId, TItem>({ complexIds: params.complexIds }) : patchItems;
    }, [sorting]);

    const sortedPatch = useMemo(
        () => getSortedPatchByParentId(
            tree.visible,
            patchItems,
            patchItemsAtLastSort,
            getNewItemPosition,
            getItemTemporaryOrder,
            sortBy,
            sorting,
            isDeleted,
            params.getId,
            params.getParentId,
            params.complexIds,
        ),
        [patchItems, sorting],
    );

    return useMemo(() => {
        return tree.patchItems({
            sortedPatch,
            patchItemsAtLastSort,
            getItemTemporaryOrder,
            isDeleted,
            sorting,
            sortBy,
            ...tree.visible.getParams(),
        });
    }, [tree, patchItems]);
}
