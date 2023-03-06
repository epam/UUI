import { BaseTree } from "./BaseTree";
import { ITree, TreeNodeInfo } from "./ITree";
import { deleteFromList, patchList } from "./treeHelpers";
import { Tree } from "./Tree";

export abstract class EditableTree<TItem, TId> extends BaseTree<TItem, TId> {
    public patch(
        items: TItem[],
        isDeletedProp?: keyof TItem,
        comparator?: (newItem: TItem, existingItem: TItem) => number,
    ): ITree<TItem, TId> {
        if (!items || items.length === 0) {
            return this;
        }

        const newById = this.cloneMap(this.byId);
        const newByParentId = this.cloneMap(this.byParentId); // shallow clone, still need to copy arrays inside!

        let isPatched = false;
        items.forEach((item) => {
            const id = this.getId(item);
            const existingItem = this.byId.get(id);
            const parentId = this.getParentId(item);
            let list = [...(newByParentId.get(parentId) ?? [])];

            if (isDeletedProp && item[isDeletedProp]) {
                newByParentId.set(parentId, deleteFromList(id, list));
                newByParentId.delete(id);
                newById.delete(id);
                isPatched = true;
                return;
            }

            if (!existingItem || existingItem !== item) {
                const id = this.getId(item);
                newById.set(id, item);

                const existingItemParentId = existingItem ? this.getParentId(existingItem) : undefined;
                if (!existingItem || parentId != existingItemParentId) {
                    newByParentId.set(
                        parentId,
                        patchList(
                            list,
                            { getId: this.getId, getParentId: this.getParentId },
                            { existingItem, newItem: item },
                            { byId: this.byId, byParentId: this.byParentId },
                            comparator,
                        ),
                    );

                    if (existingItem && existingItemParentId !== parentId) {
                        const prevParentChildren = this.byParentId.get(existingItemParentId) ?? [];
                        newByParentId.set(existingItemParentId, deleteFromList(id, prevParentChildren));
                    }
                }
                isPatched = true;
            }
        });

        if (!isPatched) {
            return this;
        }

        const newNodeInfoById = this.newMap<TId, TreeNodeInfo>();

        for (let [parentId, ids] of newByParentId) {
            newNodeInfoById.set(parentId, { count: ids.length });
        }

        return new (this.constructor as any)(
            this.params,
            newById,
            newByParentId,
            newNodeInfoById,
        ) as Tree<TItem, TId>;
    }

    public cascadeSelection(
        currentSelection: TId[],
        selectedId: TId,
        isSelected: boolean,
        options: {
            isSelectable: (item: TItem) => boolean,
            cascade: boolean,
        },
    ) {
        let selectedIdsMap = this.newMap<TId, boolean>();
        currentSelection.forEach(id => selectedIdsMap.set(id, true));

        options = { isSelectable: BaseTree.truePredicate, cascade: true, ...options };

        const forEachChildren = (action: (id: TId) => void) => {
            this.forEach((item, id) => {
                if (options.isSelectable(item)) {
                    action(id);
                }
            }, { parentId: selectedId });
        };

        if (isSelected) {
            if (selectedId != null) {
                selectedIdsMap.set(selectedId, true);
            }
            if (options.cascade) {
                // check all children recursively
                forEachChildren(id => selectedIdsMap.set(id, true));

                // check parents if all children is checked
                this.getParentIdsRecursive(selectedId).reverse().forEach(parentId => {
                    const childrenIds = this.getChildrenIdsByParentId(parentId);

                    if (childrenIds && childrenIds.every(childId => selectedIdsMap.has(childId))) {
                        selectedIdsMap.set(parentId, true);
                    }
                });
            }
        } else {
            if (selectedId != null) {
                selectedIdsMap.delete(selectedId);
            }

            if (options.cascade) {
                // uncheck all parents recursively
                this.getParentIdsRecursive(selectedId).forEach(parentId => selectedIdsMap.delete(parentId));
                // uncheck all children recursively
                forEachChildren(id => selectedIdsMap.delete(id));
            }
        }

        const result = [];
        for (const [id, value] of selectedIdsMap) {
            value && result.push(id);
        }

        return result;
    }
}
