import { useMemo } from 'react';
import { TreeState, cloneMap, newMap } from '../../newTree';
import { DataSourceState, IImmutableMap, IMap, PatchItemsOptions } from '../../../../../../types';
import { SortConfig } from '../strategies/types';
import { buildComparators, buildSorter, composeComparetors } from '../../helpers';
import { PatchOrderingTypes } from '../../PatchOrderingMap';

export interface UsePatchTreeProps<TItem, TId, TFilter = any> extends PatchItemsOptions<TItem, TId>, SortConfig<TItem> {
    tree: TreeState<TItem, TId>;
    sorting: DataSourceState<TFilter, TId>['sorting'];
    complexIds?: boolean;
    getParentId?: (item: TItem) => TId;
    getId: (item: TItem) => TId;
}

const groupByParentId = <TItem, TId>(
    patchItems: IMap<TId, TItem> | IImmutableMap<TId, TItem>,
    getParentId?: (item: TItem) => TId,
    complexIds?: boolean,
): IMap<TId, TItem[]> => {
    const patchByParentId = newMap<TId, TItem[]>({ getParentId, complexIds });
    for (const [, item] of patchItems) {
        const parentId = getParentId?.(item);
        if (!patchByParentId.has(parentId)) {
            patchByParentId.set(parentId, []);
        }
        const prevItems = patchByParentId.get(parentId);
        patchByParentId.set(parentId, [...prevItems, item]);
    }
    return patchByParentId;
};

export const sortPatchByParentId = <TItem, TId, TFilter>(
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

            if (!patchItemsAtLastSort.has(bId) && !patchItemsAtLastSort.has(aId)) {
                const aPosition = getNewItemPosition(b) === PatchOrderingTypes.BOTTOM ? -1 : 1;
                const bPosition = getNewItemPosition(b) === PatchOrderingTypes.BOTTOM ? -1 : 1;
                return (aPosition === bPosition) ? -aPosition : aPosition - bPosition;
            }

            if (!patchItemsAtLastSort.has(bId)) {
                return getNewItemPosition(b) === PatchOrderingTypes.BOTTOM ? -1 : 1;
            }

            if (!patchItemsAtLastSort.has(aId)) {
                return getNewItemPosition(a) === PatchOrderingTypes.BOTTOM ? 1 : -1;
            }
            const prevBParentId = getParentId(patchItemsAtLastSort.get(bId));
            const bParentId = getParentId(b);
            if (prevBParentId !== bParentId) {
                return -1;
            }
            const prevAParentId = getParentId(patchItemsAtLastSort.get(aId));
            const aParentId = getParentId(a);
            if (prevAParentId !== aParentId) {
                return -1;
            }

            const result = composedComparator(patchItemsAtLastSort.get(aId), patchItemsAtLastSort.get(bId));
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
    return sortPatchByParentId(grouped, getNewItemPosition, patchItemsAtLastSort, sortBy, sorting, getId, getParentId);
};

export function usePatchTree<TItem, TId, TFilter = any>(
    { tree, patchItems, getNewItemPosition, isDeleted, getPosition, sorting, sortBy, getId, getParentId, complexIds }: UsePatchTreeProps<TItem, TId, TFilter>,
) {
    const patchItemsAtLastSort = useMemo(() => patchItems, [sorting]);

    const sortedPatch = useMemo(
        () => getSortedPatchByParentId(patchItems, patchItemsAtLastSort, getNewItemPosition, sortBy, sorting, getId, getParentId, complexIds),
        [patchItems, sorting],
    );

    return useMemo(() => {
        return tree.patchItems({ patchItems, isDeleted, getPosition });
    }, [tree, patchItems]);
}
