import { IImmutableMap, IMap } from '../../../../../../types';
import { indexToOrder } from '../../../../../../helpers';
import { buildComparators, composeComparators, simpleComparator } from '../../helpers';
import { NOT_FOUND_RECORD } from '../../exposed';
import { ItemsAccessor } from '../../ItemsAccessor';
import { TreeStructure } from '../TreeStructure';
import { cloneMap, newMap } from '../../helpers/map';
import { merge } from '../../helpers/merge';
import { PatchIntoTreeStructureOptions } from './types';
import { ItemsMap } from '../../ItemsMap';

interface ApplyPatchWithSortingOptions<TItem, TId> {
    comparator: (a: TItem, b: TItem) => number;
    patchAtLastSort: IMap<TId, TItem> | IImmutableMap<TId, TItem>;
    originalItemsMap: ItemsMap<TId, TItem>;
    patchedItemsMap: ItemsMap<TId, TItem>;
    isDeleted: (id: TId) => boolean;
    complexIds?: boolean;
}

interface ApplyPatchTemporaryReorderingOptions<TItem, TId> {
    getItemTemporaryOrder: (item: TItem) => string;
    patchedItemsMap: ItemsMap<TId, TItem>;
    isDeleted: (id: TId) => boolean;
    complexIds?: boolean;
}

export class PatchHelper {
    private static applyPatchWithSorting<TItem, TId>(
        patchIds: TId[],
        originalIds: TId[],
        {
            comparator,
            patchAtLastSort,
            originalItemsMap,
            patchedItemsMap,
            isDeleted,
            complexIds,
        }: ApplyPatchWithSortingOptions<TItem, TId>,
        initialIds: TId[] = [],
    ) {
        return merge(
            patchIds,
            originalIds,
            (patchItemId, itemId) => {
                const inPatchBeforeSort = patchAtLastSort.has(patchItemId);
                const inOriginalTree = originalItemsMap.has(patchItemId);

                let patchItemToCompare;
                if (inPatchBeforeSort) {
                    patchItemToCompare = patchAtLastSort.get(patchItemId);
                } else if (inOriginalTree) {
                    patchItemToCompare = originalItemsMap.get(patchItemId);
                } else {
                    patchItemToCompare = patchedItemsMap.get(patchItemId);
                }

                const item = originalItemsMap.get(itemId);
                return comparator(patchItemToCompare, item);
            },
            initialIds,
            { isDeleted, complexIds },
        );
    }

    private static applyPatchTemporaryReordering<TItem, TId>(
        patchIds: TId[],
        originalIds: TId[],
        {
            getItemTemporaryOrder,
            patchedItemsMap,
            isDeleted,
            complexIds,
        }: ApplyPatchTemporaryReorderingOptions<TItem, TId>,
    ) {
        return merge(
            patchIds,
            originalIds,

            (patchItemId, itemId, _, itemIndex) => {
                const a = patchedItemsMap.get(patchItemId);
                const b = patchedItemsMap.get(itemId);

                const aTempOrder = getItemTemporaryOrder(a);
                const bTempOrder = getItemTemporaryOrder(b) ?? indexToOrder(itemIndex);
                return simpleComparator(aTempOrder, bTempOrder);
            },
            [],
            { isDeleted, complexIds },
        );
    }

    public static patch<TItem, TId>({
        itemsMap: originalItemsMap,
        treeStructure,
        sortedPatch,
        patchAtLastSort,
        getItemTemporaryOrder,
        isDeleted,
        sorting,
        sortBy,
    }: PatchIntoTreeStructureOptions<TItem, TId>) {
        if (!sortedPatch || !sortedPatch.size) return { treeStructure, itemsMap: originalItemsMap, newItems: [] };

        const newByParentId = cloneMap(treeStructure.byParentId); // shallow clone, still need to copy arrays inside!
        let patchedItemsMap = originalItemsMap;
        let newItems: TItem[] = [];
        const comparators = buildComparators({ sorting, sortBy, getId: treeStructure.getParams().getId });
        const composedComparator = composeComparators(comparators, treeStructure.getParams().getId);

        const complexIds = treeStructure.getParams().complexIds;
        const parentsWithNewChildren = newMap<TId, boolean>({ complexIds });
        let isUpdated = false;
        for (const [patchParentId, sorted] of sortedPatch) {
            patchedItemsMap = patchedItemsMap.setItems(sorted.newItems);
            newItems = newItems.concat(sorted.newItems);
            const itemIds = newByParentId.get(patchParentId) ?? [];

            // eslint-disable-next-line no-loop-func
            const isDeletedFn = (id: TId) => isDeleted?.(patchedItemsMap.get(id)) ?? false;

            const [sortedItems, isUpdatedOnPatch] = this.applyPatchWithSorting(
                sorted.updated,
                itemIds,
                {
                    comparator: composedComparator,
                    patchAtLastSort,
                    originalItemsMap,
                    patchedItemsMap,
                    isDeleted: isDeletedFn,
                    complexIds,
                },
                sorted.top,
            );

            const sortedItemsWithBottom = sortedItems.concat(sorted.bottom);

            const [reorderedItems, isUpdatedOnReordering] = this.applyPatchTemporaryReordering(
                sorted.withTempOrder,
                sortedItemsWithBottom,
                {
                    getItemTemporaryOrder,
                    patchedItemsMap,
                    isDeleted: isDeletedFn,
                    complexIds,
                },
            );

            // eslint-disable-next-line no-loop-func
            sorted.moved.forEach((id) => {
                const item = treeStructure.getById(id);
                if (item !== NOT_FOUND_RECORD) {
                    const parentId = treeStructure.getParams().getParentId?.(item) ?? undefined;
                    const prevItems = newByParentId.get(parentId);
                    newByParentId.set(parentId, prevItems.filter((itemId) => itemId !== id));
                }
                const newItem = patchedItemsMap.get(id);
                const newParentId = treeStructure.getParams().getParentId?.(newItem) ?? undefined;
                parentsWithNewChildren.set(newParentId, true);
            });

            newByParentId.set(patchParentId, reorderedItems);
            if (isUpdatedOnReordering || isUpdatedOnPatch || sorted.top.length || sorted.bottom.length || sorted.moved.length) {
                isUpdated = true;
            }
        }

        if (!isUpdated) {
            return { treeStructure, itemsMap: originalItemsMap, newItems };
        }

        const newNodeInfoById = cloneMap(treeStructure.nodeInfoById);
        for (const [parentId, ids] of newByParentId) {
            if (treeStructure.nodeInfoById.has(parentId)) {
                const prevNodeInfo = treeStructure.nodeInfoById.get(parentId);
                if (prevNodeInfo.count !== undefined) {
                    newNodeInfoById.set(parentId, { ...prevNodeInfo, count: ids.length });
                } else if (parentsWithNewChildren.has(parentId) && (prevNodeInfo.count === undefined)) {
                    const { assumedCount, ...prev } = prevNodeInfo;
                    newNodeInfoById.set(parentId, { ...prev, count: ids.length, ...(assumedCount === undefined ? {} : { assumedCount }) });
                }
            } else {
                newNodeInfoById.set(parentId, { count: ids.length });
            }
        }

        return {
            treeStructure: TreeStructure.create(
                treeStructure.getParams(),
                ItemsAccessor.toItemsAccessor(patchedItemsMap),
                newByParentId,
                newNodeInfoById,
            ),
            itemsMap: patchedItemsMap,
            newItems,
        };
    }
}
