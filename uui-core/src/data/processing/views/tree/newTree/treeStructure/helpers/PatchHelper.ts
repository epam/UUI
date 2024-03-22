import { PatchOrderingTypes } from '../../../PatchOrderingMap';
import { buildComparators, composeComparetors } from '../../../helpers';
import { ItemsAccessor } from '../ItemsAccessor';
import { TreeStructure } from '../TreeStructure';
import { cloneMap, newMap } from './map';
import { InsertIntoPositionOptions, PatchItemsIntoTreeStructureOptions } from './types';

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

        for (const [patchParentId, sortedPatchItems] of sortedPatch) {
            newItemsMap = newItemsMap.setItems(sortedPatchItems);

            if (!newByParentId.has(patchParentId)) {
                newByParentId.set(patchParentId, sortedPatchItems.map((item) => treeStructure.getParams().getId(item)));
                newItems.push(...sortedPatchItems);
                continue;
            }
            let sortedItems: TId[] = [];
            const itemIds = newByParentId.get(patchParentId);
            const newBottomItems: TId[] = [];
            for (let i = 0, k = 0; i < sortedPatchItems.length; i++) {
                const patchItemId = treeStructure.getParams().getId(sortedPatchItems[i]);
                if (isDeleted?.(sortedPatchItems[i])) {
                    deletedMap.set(patchItemId, true);
                }
                for (let j = k; j < itemIds.length; j ++) {
                    const patchItemParentId = treeStructure.getParams().getParentId?.(sortedPatchItems[i]);
                    const inOriginalTree = itemsMap.has(patchItemId);
                    const inPatchBeforeSort = patchItemsAtLastSort.has(patchItemId);

                    const prevPatchItemParentId = inPatchBeforeSort
                        ? treeStructure.getParams().getParentId?.(patchItemsAtLastSort.get(patchItemId))
                        : undefined;
                    const originalItemParentId = inOriginalTree ? treeStructure.getParams().getParentId?.(itemsMap.get(patchItemId)) : undefined;

                    const isNew = (!inPatchBeforeSort && !inOriginalTree)
                        || (inPatchBeforeSort && patchItemParentId !== prevPatchItemParentId)
                        || (inOriginalTree && patchItemId !== originalItemParentId);

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
                        isPatched = true;
                        break;
                    }

                    if (deletedMap.has(patchItemId)) {
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
                    // console.log('patchItemId, itemId', patchItemId, itemIds[j], result);
                    if (result === -1) {
                        sortedItems.push(patchItemId);
                        isPatched = true;
                        k = j;
                        break;
                    } else {
                        if (!deletedMap.has(itemIds[j])) {
                            if (!alreadyPushed.has(itemIds[j])) {
                                sortedItems.push(itemIds[j]);
                                alreadyPushed.set(itemIds[j], true);
                                if (k === itemIds.length - 1 && i === sortedPatchItems.length - 1) {
                                    sortedItems.push(patchItemId);
                                }
                            }
                            if (k === itemIds.length - 1) {
                                sortedItems.push(patchItemId);
                            }
                            k = j;
                        } else {
                            isPatched = true;
                        }
                    }
                }

                if (i === sortedPatchItems.length - 1 && k !== itemIds.length - 1) {
                    sortedItems = sortedItems.concat(itemIds.slice(k, itemIds.length));
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
    // public static patchItems1<TItem, TId>({
    //     itemsMap, treeStructure, patchItems, isDeleted, getPosition = () => 'initial',
    // }: PatchItemsIntoTreeStructureOptions<TItem, TId>) {
    //     if (!patchItems || !patchItems.size) return { treeStructure, itemsMap, newItems: [] };

    //     const newByParentId = cloneMap(treeStructure.byParentId); // shallow clone, still need to copy arrays inside!

    //     let isPatched = false;
    //     let newItemsMap = itemsMap;
    //     const newItems: TItem[] = [];
    //     for (const [id, item] of patchItems) {
    //         const parentId = treeStructure.getParams().getParentId?.(item) ?? undefined;

    //         if (isDeleted?.(item)) {
    //             const children = [...(newByParentId.get(parentId) ?? [])];
    //             newByParentId.set(parentId, this.deleteFromChildren(id, children));
    //             newByParentId.delete(id);
    //             isPatched = true;
    //             return;
    //         }

    //         const existingItem = newItemsMap.get(id);
    //         newItemsMap = newItemsMap.set(id, item);
    //         newItems.push(item);
    //         const existingItemParentId = existingItem ? treeStructure.getParams().getParentId?.(existingItem) ?? undefined : undefined;
    //         const children = newByParentId.get(parentId) ?? [];

    //         const newChildren = this.insertIntoPosition({ params: treeStructure.getParams(), item, ids: children, position: getPosition(item) });
    //         newByParentId.set(parentId, newChildren);
    //         if (existingItem && existingItemParentId !== parentId) {
    //             const prevParentChildren = treeStructure.byParentId.get(existingItemParentId) ?? [];
    //             newByParentId.set(existingItemParentId, this.deleteFromChildren(id, prevParentChildren));
    //         }
    //         isPatched = true;
    //     }

    //     if (!isPatched) {
    //         return { treeStructure, itemsMap };
    //     }

    //     const newNodeInfoById = cloneMap(treeStructure.nodeInfoById);

    //     for (const [parentId, ids] of newByParentId) {
    //         if (treeStructure.nodeInfoById.has(parentId)) {
    //             const prevNodeInfo = treeStructure.nodeInfoById.get(parentId);
    //             if (prevNodeInfo.count !== undefined) {
    //                 newNodeInfoById.set(parentId, { ...prevNodeInfo, count: ids.length });
    //             } else {
    //                 newNodeInfoById.set(parentId, prevNodeInfo);
    //             }
    //         }
    //     }

    //     return {
    //         treeStructure: TreeStructure.create(
    //             treeStructure.getParams(),
    //             ItemsAccessor.toItemsAccessor(newItemsMap),
    //             newByParentId,
    //             newNodeInfoById,
    //         ),
    //         itemsMap: newItemsMap,
    //         newItems,
    //     };
    // }

    private static deleteFromChildren<TId>(id: TId, children: TId[]) {
        const foundIndex = children.findIndex((childId) => childId === id);
        if (foundIndex !== -1) {
            const newChildren = [...children];
            newChildren.splice(foundIndex, 1);
            return newChildren;
        }

        return children;
    }

    private static insertIntoPosition<TItem, TId>({
        params, ids, item, position,
    }: InsertIntoPositionOptions<TItem, TId>) {
        const itemId = params.getId(item);
        if (position === 'initial') {
            const currentItemIndex = ids.findIndex((id) => params.getId(item) === id);
            if (currentItemIndex === -1) {
                return [itemId, ...ids];
            }
            return ids;
        }

        const currentItemIndex = ids.findIndex((id) => params.getId(item) === id);
        const withoutCurrentItem = currentItemIndex === -1 ? ids : [...ids.slice(0, currentItemIndex), ...ids.slice(currentItemIndex + 1)];
        if (position === 'top') {
            if (currentItemIndex === -1) {
                return [itemId, ...ids];
            }
            return [itemId, ...withoutCurrentItem];
        }

        if (position === 'bottom') {
            if (currentItemIndex === -1) {
                return [...ids, itemId];
            }
            return [...withoutCurrentItem, itemId];
        }
        const afterIndex = withoutCurrentItem.findIndex((id) => id === position.after);
        if (afterIndex === -1) {
            return [itemId, ...withoutCurrentItem];
        }

        return [...withoutCurrentItem.slice(0, afterIndex + 1), itemId, ...withoutCurrentItem.slice(afterIndex + 1)];
    }
}
