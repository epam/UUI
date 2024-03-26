import { buildComparators, composeComparetors } from '../../../helpers';
import { NOT_FOUND_RECORD } from '../../exposed';
import { ItemsAccessor } from '../ItemsAccessor';
import { TreeStructure } from '../TreeStructure';
import { cloneMap, newMap } from './map';
import { PatchItemsIntoTreeStructureOptions } from './types';

function merge<TId>(
    mergeSrcArr: TId[],
    mergeTgArr: TId[],
    compare: (idFromSource: TId, idFromTarget: TId) => number,
    isDeleted?: (id: TId) => boolean,
    initialArr: TId[] = [],
    complexIds?: boolean,
) {
    let srcItemIndex = 0,
        tgItemIndex = 0;

    const updatedItemsToIds = newMap<TId, number>({ complexIds });
    const merged: TId[] = [...initialArr];
    const patchedItems = newMap<TId, boolean>({ complexIds });

    mergeSrcArr.forEach((id) => {
        patchedItems.set(id, true);
    });

    while (srcItemIndex < mergeSrcArr.length || tgItemIndex < mergeTgArr.length) {
        if (srcItemIndex >= mergeSrcArr.length) {
            if (!patchedItems.get(mergeTgArr[tgItemIndex]) && !isDeleted?.(mergeTgArr[tgItemIndex])) {
                merged.push(mergeTgArr[tgItemIndex]);
            }
            tgItemIndex++;
            continue;
        }

        if (tgItemIndex >= mergeTgArr.length) {
            if (!isDeleted?.(mergeSrcArr[srcItemIndex])) {
                merged.push(mergeSrcArr[srcItemIndex]);
            }
            srcItemIndex++;
            continue;
        }

        if (isDeleted?.(mergeSrcArr[srcItemIndex])) {
            srcItemIndex++;
            continue;
        }

        if (isDeleted?.(mergeTgArr[tgItemIndex])) {
            tgItemIndex++;
            continue;
        }

        const patchItemId = mergeSrcArr[srcItemIndex];
        const originalItemId = mergeTgArr[tgItemIndex];
        if (patchItemId === originalItemId) {
            updatedItemsToIds.set(mergeSrcArr[srcItemIndex], tgItemIndex);
        }

        if (patchedItems.has(originalItemId)) {
            tgItemIndex++;
            continue;
        }

        const result = compare(patchItemId, originalItemId);
        if (result === -1 || (result === 0 && updatedItemsToIds.has(patchItemId) && (updatedItemsToIds.get(patchItemId) < tgItemIndex))) {
            merged.push(patchItemId);
            srcItemIndex++;
        } else {
            if (!patchedItems.has(originalItemId) && !isDeleted?.(originalItemId)) {
                merged.push(originalItemId);
            }
            tgItemIndex++;
        }
    }

    return merged;
}

export class PatchHelper {
    public static patchItems<TItem, TId>({
        itemsMap,
        treeStructure,
        sortedPatch,
        patchItemsAtLastSort,
        isDeleted,
        sorting,
        sortBy,
    }: PatchItemsIntoTreeStructureOptions<TItem, TId>) {
        if (!sortedPatch || !sortedPatch.size) return { treeStructure, itemsMap, newItems: [] };

        const newByParentId = cloneMap(treeStructure.byParentId); // shallow clone, still need to copy arrays inside!
        let newItemsMap = itemsMap;
        let newItems: TItem[] = [];
        const comparators = buildComparators({ sorting, sortBy });
        const composedComparator = composeComparetors(comparators);

        const complexIds = treeStructure.getParams().complexIds;

        for (const [patchParentId, sortedPatchItems] of sortedPatch) {
            newItemsMap = newItemsMap.setItems(sortedPatchItems.newItems);
            newItems = newItems.concat(sortedPatchItems.newItems);
            const itemIds = newByParentId.get(patchParentId) ?? [];

            let sortedItems = merge(
                sortedPatchItems.updated,
                itemIds,
                // eslint-disable-next-line no-loop-func
                (patchItemId, itemId) => {
                    const inPatchBeforeSort = patchItemsAtLastSort.has(patchItemId);
                    const inOriginalTree = itemsMap.has(patchItemId);

                    let patchItemToCompare;
                    if (inPatchBeforeSort) {
                        patchItemToCompare = patchItemsAtLastSort.get(patchItemId);
                    } else if (inOriginalTree) {
                        patchItemToCompare = itemsMap.get(patchItemId);
                    } else {
                        patchItemToCompare = newItemsMap.get(patchItemId);
                    }

                    const item = itemsMap.get(itemId);
                    return composedComparator(patchItemToCompare, item);
                },
                // eslint-disable-next-line no-loop-func
                (id) => isDeleted?.(newItemsMap.get(id)) ?? false,
                sortedPatchItems.top,
                complexIds,
            );

            sortedItems = sortedItems.concat(sortedPatchItems.bottom);
            sortedPatchItems.moved.forEach((id) => {
                const item = treeStructure.getById(id);
                if (item !== NOT_FOUND_RECORD) {
                    const parentId = treeStructure.getParams().getParentId?.(item) ?? undefined;
                    const prevItems = newByParentId.get(parentId);
                    newByParentId.set(parentId, prevItems.filter((itemId) => itemId !== id));
                }
            });

            newByParentId.set(patchParentId, sortedItems);
        }

        // if (!isPatched) {
        //     return { treeStructure, itemsMap, newItems };
        // }

        const newNodeInfoById = cloneMap(treeStructure.nodeInfoById);
        for (const [parentId, ids] of newByParentId) {
            if (treeStructure.nodeInfoById.has(parentId)) {
                const prevNodeInfo = treeStructure.nodeInfoById.get(parentId);
                if (prevNodeInfo.count !== undefined) {
                    newNodeInfoById.set(parentId, { ...prevNodeInfo, count: ids.length });
                } else {
                    newNodeInfoById.set(parentId, prevNodeInfo);
                }
            }
        }

        return {
            treeStructure: TreeStructure.create(
                treeStructure.getParams(),
                ItemsAccessor.toItemsAccessor(newItemsMap),
                newByParentId,
                newNodeInfoById,
            ),
            itemsMap: newItemsMap,
            newItems,
        };
    }
}
