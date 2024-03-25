import { useMemo } from 'react';
import { NOT_FOUND_RECORD, TreeState, cloneMap, newMap } from '../../newTree';
import { DataSourceState, IImmutableMap, IMap, PatchItemsOptions } from '../../../../../../types';
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
    patchItemsAtLastSort: IMap<TId, TItem> | IImmutableMap<TId, TItem>,
    sortBy: SortConfig<TItem>['sortBy'],
    sorting: DataSourceState<TFilter, TId>['sorting'],
    getId: (item: TItem) => TId,
    getParentId: (item: TItem) => TId,
) => {
    const comparators = buildComparators({ sorting, sortBy });
    const composedComparator = composeComparetors(comparators);

    const sorted = cloneMap(groupedByParentId);
    for (const [parentId, items] of sorted) {
        const indexes = new Map<TItem, number>();
        items.forEach((item, index) => indexes.set(item, index));

        const sortedItems = [...items].sort((a, b) => {
            const aId = getId(a);
            const bId = getId(b);

            const aInOriginalTree = tree.getById(aId) !== NOT_FOUND_RECORD;
            const bInOriginalTree = tree.getById(bId) !== NOT_FOUND_RECORD;
            const aInPatchBeforeSort = patchItemsAtLastSort.has(aId);
            const bInPatchBeforeSort = patchItemsAtLastSort.has(bId);

            if (!bInPatchBeforeSort && !aInPatchBeforeSort && !aInOriginalTree && !bInOriginalTree) {
                const aPosition = getNewItemPosition(a) === PatchOrderingTypes.BOTTOM ? -1 : 1;
                const bPosition = getNewItemPosition(b) === PatchOrderingTypes.BOTTOM ? -1 : 1;
                return (aPosition === bPosition) ? 1 : aPosition - bPosition;
            }

            if (!bInPatchBeforeSort && !aInOriginalTree) {
                return getNewItemPosition(b) === PatchOrderingTypes.BOTTOM ? -1 : 1;
            }

            if (!aInPatchBeforeSort && !aInOriginalTree) {
                return getNewItemPosition(a) === PatchOrderingTypes.BOTTOM ? 1 : -1;
            }

            const bItem = patchItemsAtLastSort.get(bId) ?? tree.getById(bId) as TItem;
            const prevBParentId = getParentId?.(bItem) ?? undefined;
            const bParentId = getParentId?.(b) ?? undefined;
            if (prevBParentId !== bParentId) {
                return getNewItemPosition(b) === PatchOrderingTypes.BOTTOM ? -1 : 1;
            }

            const aItem = patchItemsAtLastSort.get(aId) ?? tree.getById(aId) as TItem;
            const prevAParentId = getParentId?.(aItem) ?? undefined;
            const aParentId = getParentId?.(a) ?? undefined;
            if (prevAParentId !== aParentId) {
                return getNewItemPosition(a) === PatchOrderingTypes.BOTTOM ? 1 : -1;
            }

            const result = composedComparator(aItem, bItem);
            if (result === 0) {
                return indexes.get(a) - indexes.get(b);
            }
            return result;
        });

        sorted.set(parentId, sortedItems);
    }
    return sorted;
};

const getSortedPatchByParentId = <TItem, TId, TFilter>(
    tree: ITree<TItem, TId>,
    patchItems: IMap<TId, TItem> | IImmutableMap<TId, TItem>,
    patchItemsAtLastSort: IMap<TId, TItem> | IImmutableMap<TId, TItem>,
    getNewItemPosition: PatchItemsOptions<TItem, TId>['getNewItemPosition'],
    sortBy: SortConfig<TItem>['sortBy'],
    sorting: DataSourceState<TFilter, TId>['sorting'],
    getId?: (item: TItem) => TId,
    getParentId?: (item: TItem) => TId,
    complexIds?: boolean,
) => {
    const grouped = groupByParentId(patchItems, getParentId, complexIds);
    return sortPatchByParentId(tree, grouped, getNewItemPosition, patchItemsAtLastSort, sortBy, sorting, getId, getParentId);
};

export function usePatchTree<TItem, TId, TFilter = any>(
    {
        tree,
        patchItems,
        getNewItemPosition = () => PatchOrderingTypes.TOP,
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
            sortBy,
            sorting,
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
            getNewItemPosition,
            isDeleted,
            sorting,
            sortBy,
            ...tree.visible.getParams(),
        });
    }, [tree, patchItems]);
}
