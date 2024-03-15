import { ItemsAccessor } from '../ItemsAccessor';
import { TreeStructure } from '../TreeStructure';
import { cloneMap } from './map';
import { InsertIntoPositionOptions, PatchItemsIntoTreeStructureOptions } from './types';

export class PatchHelper {
    public static patchItems<TItem, TId>({
        itemsMap, treeStructure, patchItems, isDeleted, getPosition = () => 'initial',
    }: PatchItemsIntoTreeStructureOptions<TItem, TId>) {
        if (!patchItems || !patchItems.size) return { treeStructure, itemsMap, newItems: [] };

        const newByParentId = cloneMap(treeStructure.byParentId); // shallow clone, still need to copy arrays inside!

        let isPatched = false;
        let newItemsMap = itemsMap;
        const newItems: TItem[] = [];
        for (const [id, item] of patchItems) {
            const parentId = treeStructure.getParams().getParentId?.(item) ?? undefined;

            if (isDeleted?.(item)) {
                const children = [...(newByParentId.get(parentId) ?? [])];
                newByParentId.set(parentId, this.deleteFromChildren(id, children));
                newByParentId.delete(id);
                isPatched = true;
                return;
            }

            const existingItem = newItemsMap.get(id);
            newItemsMap = newItemsMap.set(id, item);
            newItems.push(item);
            const existingItemParentId = existingItem ? treeStructure.getParams().getParentId?.(existingItem) ?? undefined : undefined;
            const children = newByParentId.get(parentId) ?? [];

            const newChildren = this.insertIntoPosition({ params: treeStructure.getParams(), item, ids: children, position: getPosition(item) });
            newByParentId.set(parentId, newChildren);
            if (existingItem && existingItemParentId !== parentId) {
                const prevParentChildren = treeStructure.byParentId.get(existingItemParentId) ?? [];
                newByParentId.set(existingItemParentId, this.deleteFromChildren(id, prevParentChildren));
            }
            isPatched = true;
        }

        if (!isPatched) {
            return { treeStructure, itemsMap };
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
