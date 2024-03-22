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
        const alreadyPushed = newMap({ complexIds: treeStructure.getParams().complexIds });
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
            for (let i = 0, k = 0; i < sortedPatchItems.length; i++) {
                const patchItemId = treeStructure.getParams().getId(sortedPatchItems[i]);
                if (isDeleted?.(sortedPatchItems[i])) {
                    deletedMap.set(patchItemId, true);
                }
                for (let j = k; j < itemIds.length; j ++) {
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

                    if (deletedMap.get(patchItemId)) {
                        isPatched = true;
                        break;
                    }

                    if (isNew) {
                        const position = getNewItemPosition(sortedPatchItems[i]);
                        if (position === PatchOrderingTypes.TOP) {
                            sortedItems.unshift(patchItemId);
                        } else {
                            newBottomItems.push(patchItemId);
                        }
                        isPatched = true;
                        alreadyPushed.set(patchItemId, true);
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

                    if (itemIds[j] === patchItemId) {
                        updatedItemsToIds.set(patchItemId, j);
                        k = j;
                        continue;
                    }
                    const item = itemsMap.get(itemIds[j]);
                    const result = composedComparator(patchItemToCompare, item);
                    if (result === -1 || (result === 0 && updatedItemsToIds.has(patchItemId) && (updatedItemsToIds.get(patchItemId) < j))) {
                        sortedItems.push(patchItemId);
                        alreadyPushed.set(patchItemId, true);

                        isPatched = true;
                        k = j;
                        break;
                    } else {
                        if (!deletedMap.get(itemIds[j])) {
                            if (!alreadyPushed.has(itemIds[j])) {
                                sortedItems.push(itemIds[j]);
                                alreadyPushed.set(itemIds[j], true);
                                k = j;
                            }
                            if (k === itemIds.length - 1) {
                                sortedItems.push(patchItemId);
                                alreadyPushed.set(patchItemId, true);
                                isPatched = true;
                            }
                            k = j;
                        } else {
                            isPatched = true;
                        }
                    }
                }

                if (i === sortedPatchItems.length - 1 && (k === 0 || k !== itemIds.length - 1)) {
                    sortedItems = sortedItems.concat(itemIds.slice(k, itemIds.length).filter((id) => !deletedMap.get(id) && !alreadyPushed.get(id)));
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
