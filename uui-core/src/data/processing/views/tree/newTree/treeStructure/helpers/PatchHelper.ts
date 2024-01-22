import { TreeNodeInfo } from '../types';
import { ItemsAccessor } from '../ItemsAccessor';
import { TreeStructure } from '../TreeStructure';
import { cloneMap, newMap } from './map';
import { InsertIntoPositionOptions, PasteItemIntoChildrenListOptions, PatchChildrenOptions, PatchItemsOptions, PatchOptions } from './types';

export class PatchHelper {
    public static patch<TItem, TId>({
        treeStructure, itemsMap, items, isDeletedProp, comparator,
    }: PatchOptions<TItem, TId>) {
        if (!items || items.length === 0) {
            return { treeStructure, itemsMap, newItems: [] };
        }

        const newByParentId = cloneMap(treeStructure.byParentId); // shallow clone, still need to copy arrays inside!

        let isPatched = false;
        let newItemsMap = itemsMap;
        const newItems: TItem[] = [];

        items.forEach((item) => {
            const id = treeStructure.params.getId(item);
            const existingItem = newItemsMap.get(id);
            const parentId = treeStructure.params.getParentId?.(item);

            if (isDeletedProp && item[isDeletedProp]) {
                const children = [...(newByParentId.get(parentId) ?? [])];
                newByParentId.set(parentId, this.deleteFromChildren(id, children));
                newByParentId.delete(id);
                isPatched = true;
                return;
            }

            if (!existingItem || existingItem !== item) {
                newItemsMap = itemsMap.set(id, item);
                newItems.push(item);
                const existingItemParentId = existingItem ? treeStructure.params.getParentId?.(existingItem) : undefined;
                if (!existingItem || parentId !== existingItemParentId) {
                    const children = newByParentId.get(parentId) ?? [];

                    newByParentId.set(parentId, this.patchChildren({ treeStructure, children, existingItem, newItem: item, comparator, itemsMap }));

                    if (existingItem && existingItemParentId !== parentId) {
                        const prevParentChildren = treeStructure.byParentId.get(existingItemParentId) ?? [];
                        newByParentId.set(existingItemParentId, this.deleteFromChildren(id, prevParentChildren));
                    }
                }
                isPatched = true;
            }
        });

        if (!isPatched) {
            return { treeStructure, itemsMap };
        }

        const newNodeInfoById = newMap<TId, TreeNodeInfo>(treeStructure.params);

        for (const [parentId, ids] of newByParentId) {
            newNodeInfoById.set(parentId, { count: ids.length });
        }

        return {
            treeStructure: TreeStructure.create(
                treeStructure.params,
                ItemsAccessor.toItemsAccessor(newItemsMap),
                newByParentId,
                newNodeInfoById,
            ),
            itemsMap: newItemsMap,
            newItems,
        };
    }

    public static patchItems<TItem, TId>({
        itemsMap, treeStructure, patchItems, isDeletedProp, getPosition = () => 'initial',
    }: PatchItemsOptions<TItem, TId>) {
        if (!patchItems || !patchItems.size) return { treeStructure, itemsMap, newItems: [] };

        const newByParentId = cloneMap(treeStructure.byParentId); // shallow clone, still need to copy arrays inside!

        let isPatched = false;
        let newItemsMap = itemsMap;
        const newItems: TItem[] = [];
        patchItems.forEach((item, id) => {
            const parentId = treeStructure.params.getParentId?.(item);

            if (isDeletedProp && item[isDeletedProp]) {
                const children = [...(newByParentId.get(parentId) ?? [])];
                newByParentId.set(parentId, this.deleteFromChildren(id, children));
                newByParentId.delete(id);
                isPatched = true;
                return;
            }

            const existingItem = newItemsMap.get(id);
            newItemsMap = newItemsMap.set(id, item);
            newItems.push(item);
            const existingItemParentId = existingItem ? treeStructure.params.getParentId?.(existingItem) : undefined;
            const children = newByParentId.get(parentId) ?? [];

            newByParentId.set(parentId, this.insertIntoPosition({ params: treeStructure.params, item, ids: children, position: getPosition(item) }));

            if (existingItem && existingItemParentId !== parentId) {
                const prevParentChildren = treeStructure.byParentId.get(existingItemParentId) ?? [];
                newByParentId.set(existingItemParentId, this.deleteFromChildren(id, prevParentChildren));
            }
            isPatched = true;
        });

        if (!isPatched) {
            return { treeStructure, itemsMap };
        }

        const newNodeInfoById = newMap<TId, TreeNodeInfo>(treeStructure.params);

        for (const [parentId, ids] of newByParentId) {
            if (treeStructure.nodeInfoById.has(parentId)) {
                const prevNodeInfo = treeStructure.nodeInfoById.get(parentId);
                if (prevNodeInfo.count !== undefined) {
                    newNodeInfoById.set(parentId, { count: ids.length });
                } else {
                    newNodeInfoById.set(parentId, prevNodeInfo);
                }
            }
        }

        return {
            treeStructure: TreeStructure.create(
                treeStructure.params,
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
            children.splice(foundIndex, 1);
        }

        return children;
    }

    private static insertIntoPosition<TItem, TId>({
        params, ids, item, position,
    }: InsertIntoPositionOptions<TItem, TId>) {
        const itemId = params.getId(item);
        const currentItemIndex = ids.findIndex((id) => params.getId(item) === id);
        if (position === 'initial') {
            if (currentItemIndex === -1) {
                return [itemId, ...ids];
            }
            return ids;
        }

        const withoutCurrentItem = [...ids.slice(0, currentItemIndex), ...ids.slice(currentItemIndex + 1)];
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
        const afterIndex = ids.findIndex((id) => id === position.after);
        if (afterIndex === -1) {
            return [itemId, ...ids];
        }

        return [...ids.slice(0, afterIndex + 1), itemId, ...ids.slice(afterIndex + 1)];
    }

    private static patchChildren<TItem, TId>({
        treeStructure, children, existingItem, newItem, comparator, itemsMap,
    }: PatchChildrenOptions<TItem, TId>) {
        const id = treeStructure.params.getId(newItem);
        const parentId = treeStructure.params.getParentId?.(newItem);
        const prevParentId = existingItem ? treeStructure.params.getParentId?.(existingItem) : undefined;

        if (!children || children === treeStructure.getChildrenIdsByParentId(parentId)) {
            children = children ? [...children] : [];
        }

        if ((!existingItem || (existingItem && parentId !== prevParentId)) && comparator) {
            return this.pasteItemIntoChildrenList({
                id: treeStructure.params.getId(newItem),
                item: newItem,
                children,
                comparator,
                itemsMap,
            });
        }

        children.push(id);
        return children;
    }

    private static pasteItemIntoChildrenList<TItem, TId>(
        { id, item, children, comparator, itemsMap }: PasteItemIntoChildrenListOptions<TItem, TId>,
    ) {
        if (!children.length) {
            return [id];
        }

        // paste item should be the second argument
        const lessOrEqualPosition = children.findIndex((itemId) => comparator(item, itemsMap.get(itemId)) <= 0);
        const position = lessOrEqualPosition === -1 ? children.length : lessOrEqualPosition;

        children.splice(position, 0, id);
        return children;
    }
}
