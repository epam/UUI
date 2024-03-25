import { PatchOrderingTypes } from '../../../PatchOrderingMap';
import { buildComparators, composeComparetors } from '../../../helpers';
import { ItemsAccessor } from '../ItemsAccessor';
import { TreeStructure } from '../TreeStructure';
import { cloneMap, newMap } from './map';
import { PatchItemsIntoTreeStructureOptions } from './types';

export class PatchHelper {
    public static patchItems<TItem, TId>({
        itemsMap,
        treeStructure,
        sortedPatch,
        patchItemsAtLastSort,
        isDeleted,
        getNewItemPosition = () => PatchOrderingTypes.TOP,
        sorting,
        sortBy,
    }: PatchItemsIntoTreeStructureOptions<TItem, TId>) {
        if (!sortedPatch || !sortedPatch.size) return { treeStructure, itemsMap, newItems: [] };

        const newByParentId = cloneMap(treeStructure.byParentId); // shallow clone, still need to copy arrays inside!

        let isPatched = false;
        let newItemsMap = itemsMap;
        const newItems: TItem[] = [];
        const comparators = buildComparators({ sorting, sortBy });
        const composedComparator = composeComparetors(comparators);

        const deletedMap = newMap({ complexIds: treeStructure.getParams().complexIds });
        const updatedItemsToIds = newMap<TId, number>({ complexIds: treeStructure.getParams().complexIds });

        for (const [patchParentId, sortedPatchItems] of sortedPatch) {
            newItemsMap = newItemsMap.setItems(sortedPatchItems);
            const itemIds = newByParentId.get(patchParentId) ?? [];

            if (!itemIds.length) {
                newByParentId.set(patchParentId, sortedPatchItems.map((item) => treeStructure.getParams().getId(item)));
                newItems.push(...sortedPatchItems);
                continue;
            }
            let sortedItems: TId[] = [];
            const newBottomItems: TId[] = [];
            const patchedItems = newMap<TId, boolean>({ complexIds: treeStructure.getParams().complexIds });
            for (const item of sortedPatchItems) {
                const id = treeStructure.getParams().getId(item);
                if (isDeleted?.(item)) {
                    deletedMap.set(id, true);
                    newByParentId.delete(id);
                }
                patchedItems.set(id, true);
            }

            for (let i = 0, k = 0, lastPushedPatch = null, lastPushedRegular = null; i < sortedPatchItems.length; i++) {
                const patchItemId = treeStructure.getParams().getId(sortedPatchItems[i]);

                for (let j = k; j < itemIds.length; j ++) {
                    if (patchedItems.get(itemIds[j])) {
                        if (itemIds[j] === patchItemId) {
                            updatedItemsToIds.set(patchItemId, j);
                        }

                        if (j === itemIds.length - 1 && !deletedMap.get(patchItemId)) {
                            sortedItems.push(patchItemId);
                            isPatched = true;
                        }

                        if (deletedMap.get(patchItemId)) {
                            isPatched = true;
                        }

                        k = j;
                        lastPushedPatch = i;
                        continue;
                    }

                    if (deletedMap.get(patchItemId)) {
                        isPatched = true;
                        break;
                    }

                    const patchItemParentId = treeStructure.getParams().getParentId?.(sortedPatchItems[i]) ?? undefined;
                    const inOriginalTree = itemsMap.has(patchItemId);
                    const inPatchBeforeSort = patchItemsAtLastSort.has(patchItemId);

                    const prevPatchItemParentId = inPatchBeforeSort
                        ? treeStructure.getParams().getParentId?.(patchItemsAtLastSort.get(patchItemId)) ?? undefined
                        : undefined;
                    const originalItemParentId = inOriginalTree ? treeStructure.getParams().getParentId?.(itemsMap.get(patchItemId)) ?? undefined : undefined;

                    const isNew = (!inPatchBeforeSort && !inOriginalTree)
                        || (inPatchBeforeSort && patchItemParentId !== prevPatchItemParentId)
                        || (inOriginalTree && patchParentId !== originalItemParentId);

                    if (inOriginalTree && patchItemParentId !== originalItemParentId) {
                        const originalItems = newByParentId.get(originalItemParentId);
                        newByParentId.set(originalItemParentId, originalItems.filter((id) => patchItemId !== id));
                    }

                    if (isNew) {
                        const position = getNewItemPosition(sortedPatchItems[i]);
                        if (position === PatchOrderingTypes.TOP) {
                            sortedItems.unshift(patchItemId);
                        } else {
                            newBottomItems.push(patchItemId);
                        }
                        lastPushedPatch = i;
                        isPatched = true;

                        break;
                    }

                    let patchItemToCompare;
                    if (inPatchBeforeSort) {
                        patchItemToCompare = patchItemsAtLastSort.get(patchItemId);
                    } else if (inOriginalTree) {
                        patchItemToCompare = itemsMap.get(patchItemId);
                    } else {
                        patchItemToCompare = sortedPatchItems[i];
                    }

                    const item = itemsMap.get(itemIds[j]);
                    const result = composedComparator(patchItemToCompare, item);
                    if (result === -1 || (result === 0 && updatedItemsToIds.has(patchItemId) && (updatedItemsToIds.get(patchItemId) < j))) {
                        sortedItems.push(patchItemId);
                        lastPushedPatch = i;
                        isPatched = true;
                        k = j;

                        break;
                    } else {
                        if (deletedMap.get(itemIds[j])) {
                            isPatched = true;
                        } else if (!patchedItems.get(itemIds[j])) {
                            sortedItems.push(itemIds[j]);
                        }
                        lastPushedRegular = j;
                        k = j;
                    }
                }

                if (lastPushedRegular === itemIds.length - 1 && (lastPushedPatch === null || lastPushedPatch < sortedPatchItems.length - 1)) {
                    for (let l = (lastPushedPatch ?? -1) + 1; l < sortedPatchItems.length; l ++) {
                        const id = treeStructure.getParams().getId(sortedPatchItems[l]);
                        if (!deletedMap.get(id)) {
                            sortedItems.push(id);
                            isPatched = true;
                        }
                    }
                    break;
                }

                if (i === sortedPatchItems.length - 1 && (lastPushedRegular === null || lastPushedRegular < itemIds.length - 1)) {
                    for (let j = (lastPushedRegular ?? -1) + 1; j < itemIds.length; j ++) {
                        if (!patchedItems.get(itemIds[j]) && !deletedMap.get(itemIds[j])) {
                            sortedItems.push(itemIds[j]);
                        }
                        if (deletedMap.get(itemIds[j])) {
                            isPatched = true;
                        }
                    }
                    break;
                }
            }
            sortedItems = sortedItems.concat(newBottomItems);
            newByParentId.set(patchParentId, sortedItems);
        }

        if (!isPatched) {
            return { treeStructure, itemsMap, newItems };
        }

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
