import { IMap } from '../../../../types';
import { BaseTree } from './BaseTree';
import {
    ItemsComparator, ITree, NOT_FOUND_RECORD, ROOT_ID, TreeNodeInfo,
} from './ITree';
import { CascadeSelection, CascadeSelectionTypes } from '../../../../types';
import { CompositeKeysMap } from './CompositeKeysMap';

export abstract class EditableTree<TItem, TId> extends BaseTree<TItem, TId> {
    public patch(items: TItem[], isDeletedProp?: keyof TItem, comparator?: ItemsComparator<TItem>): ITree<TItem, TId> {
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

            if (isDeletedProp && item[isDeletedProp]) {
                const children = [...(newByParentId.get(parentId) ?? [])];
                newByParentId.set(parentId, this.deleteFromChildren(id, children));
                newByParentId.delete(id);
                newById.delete(id);
                isPatched = true;
                return;
            }

            if (!existingItem || existingItem !== item) {
                newById.set(id, item);
                const existingItemParentId = existingItem ? this.getParentId(existingItem) : undefined;
                if (!existingItem || parentId !== existingItemParentId) {
                    const children = newByParentId.get(parentId) ?? [];

                    newByParentId.set(parentId, this.patchChildren(children, { existingItem, newItem: item }, comparator, newById));

                    if (existingItem && existingItemParentId !== parentId) {
                        const prevParentChildren = this.byParentId.get(existingItemParentId) ?? [];
                        newByParentId.set(existingItemParentId, this.deleteFromChildren(id, prevParentChildren));
                    }
                }
                isPatched = true;
            }
        });

        if (!isPatched) {
            return this;
        }

        const newNodeInfoById = this.newMap<TId, TreeNodeInfo>();

        for (const [parentId, ids] of newByParentId) {
            newNodeInfoById.set(parentId, { count: ids.length });
        }

        return this.newInstance(this.params, newById, newByParentId, newNodeInfoById);
    }

    public mergeItems(tree: ITree<TItem, TId>): ITree<TItem, TId> {
        if (this === tree) {
            return this;
        }

        const newById = this.cloneMap(this.byId);
        tree.forEach((item, id) => {
            if (!newById.has(id) || newById.get(id) !== item) {
                newById.set(id, item);
            }
        });

        return this.newInstance(this.params, newById, this.byParentId, this.nodeInfoById);
    }

    public cascadeSelection(
        currentSelection: TId[],
        selectedId: TId,
        isSelected: boolean,
        options: {
            isSelectable?: (item: TItem) => boolean;
            cascade?: CascadeSelection;
        } = {},
    ) {
        const isImplicitMode = options.cascade === CascadeSelectionTypes.IMPLICIT;
        let selectedIdsMap = this.newMap<TId, boolean>();
        if (!(selectedId === ROOT_ID && isImplicitMode)) {
            currentSelection.forEach((id) => selectedIdsMap.set(id, true));
        }

        const optionsWithDefaults = { isSelectable: BaseTree.truePredicate, cascade: true, ...options };
        if (!optionsWithDefaults.cascade) {
            selectedIdsMap = this.simpleSelection(selectedIdsMap, selectedId, isSelected, optionsWithDefaults.isSelectable);
        }

        if (optionsWithDefaults.cascade === true || optionsWithDefaults.cascade === CascadeSelectionTypes.EXPLICIT) {
            selectedIdsMap = this.explicitCascadeSelection(selectedIdsMap, selectedId, isSelected, optionsWithDefaults.isSelectable);
        }

        if (optionsWithDefaults.cascade === CascadeSelectionTypes.IMPLICIT) {
            selectedIdsMap = this.implicitCascadeSelection(selectedIdsMap, selectedId, isSelected, optionsWithDefaults.isSelectable);
        }

        const result = [];
        for (const [id, value] of selectedIdsMap) {
            value && result.push(id);
        }

        return result;
    }

    private forEachChildren(action: (id: TId) => void, isSelectable: (item: TItem) => boolean, parentId?: TId, includeParent: boolean = true) {
        this.forEach(
            (item, id) => {
                if (item && isSelectable(item)) {
                    action(id);
                }
            },
            { parentId: parentId, includeParent },
        );
    }

    private simpleSelection(
        selectedIdsMap: CompositeKeysMap<TId, boolean> | Map<TId, boolean>,
        selectedId: TId,
        isSelected: boolean,
        isSelectable: (item: TItem) => boolean,
    ) {
        if (isSelected) {
            if (selectedId !== ROOT_ID) {
                selectedIdsMap.set(selectedId, true);
            } else {
                for (const [id, item] of this.byId) {
                    if (isSelectable(item)) {
                        selectedIdsMap.set(id, true);
                    }
                }
            }
            return selectedIdsMap;
        }

        if (selectedId !== ROOT_ID) {
            selectedIdsMap.delete(selectedId);
        } else {
            return this.newMap<TId, boolean>();
        }

        return selectedIdsMap;
    }

    private explicitCascadeSelection(
        selectedIdsMap: CompositeKeysMap<TId, boolean> | Map<TId, boolean>,
        selectedId: TId,
        isSelected: boolean,
        isSelectable: (item: TItem) => boolean,
    ) {
        if (isSelected) {
            if (selectedId !== ROOT_ID) {
                selectedIdsMap.set(selectedId, true);
            }
            // check all children recursively
            this.forEachChildren((id) => id !== ROOT_ID && selectedIdsMap.set(id, true), isSelectable, selectedId);
            return this.checkParentsWithFullCheck(selectedIdsMap, selectedId, isSelectable);
        }

        if (selectedId !== ROOT_ID) {
            selectedIdsMap.delete(selectedId);
        }

        // uncheck all children recursively
        this.forEachChildren((id) => selectedIdsMap.delete(id), isSelectable, selectedId);

        this.getParentIdsRecursive(selectedId).forEach((parentId) => selectedIdsMap.delete(parentId));

        return selectedIdsMap;
    }

    private implicitCascadeSelection(
        selectedIdsMap: CompositeKeysMap<TId, boolean> | Map<TId, boolean>,
        selectedId: TId,
        isSelected: boolean,
        isSelectable: (item: TItem) => boolean,
    ) {
        if (isSelected) {
            if (selectedId !== ROOT_ID) {
                selectedIdsMap.set(selectedId, true);
            }
            // for implicit mode, it is required to remove explicit check from children,
            // if parent is checked
            this.forEachChildren((id) => selectedIdsMap.delete(id), isSelectable, selectedId, false);
            if (selectedId === ROOT_ID) {
                const childrenIds = this.getChildrenIdsByParentId(selectedId);

                // if selectedId is undefined and it is selected, that means selectAll
                childrenIds.forEach((id) => selectedIdsMap.set(id, true));
            }
            // check parents if all children are checked
            return this.checkParentsWithFullCheck(selectedIdsMap, selectedId, isSelectable, true);
        }

        if (selectedId !== ROOT_ID) {
            selectedIdsMap.delete(selectedId);
        }

        const selectNeighboursOnly = (itemId: TId) => {
            const item = this.getById(itemId);
            if (item === NOT_FOUND_RECORD) {
                return;
            }

            const parentId = this.getParentId(item);
            const parents = this.getParentIdsRecursive(itemId);
            // if some parent is checked, it is required to check all children explicitly,
            // except unchecked one.
            const someParentIsChecked = parents.some((parent) => selectedIdsMap.get(parent));
            this.getChildrenIdsByParentId(parentId).forEach((id) => {
                if (itemId !== id && someParentIsChecked) {
                    selectedIdsMap.set(id, true);
                }
            });
            selectedIdsMap.delete(parentId);
        };

        if (selectedId !== ROOT_ID) {
            const parents = this.getParentIdsRecursive(selectedId);
            [selectedId, ...parents.reverse()].forEach(selectNeighboursOnly);
        }
        return selectedIdsMap;
    }

    private checkParentsWithFullCheck(
        selectedIdsMap: CompositeKeysMap<TId, boolean> | Map<TId, boolean>,
        selectedId: TId,
        isSelectable: (item: TItem) => boolean,
        removeExplicitChildrenSelection?: boolean,
    ) {
        this.getParentIdsRecursive(selectedId)
            .reverse()
            .forEach((parentId) => {
                const childrenIds = this.getChildrenIdsByParentId(parentId);
                if (childrenIds && childrenIds.every((childId) => selectedIdsMap.has(childId))) {
                    if (parentId !== ROOT_ID) {
                        selectedIdsMap.set(parentId, true);
                    }
                    if (removeExplicitChildrenSelection) {
                        this.forEachChildren((id) => selectedIdsMap.delete(id), isSelectable, parentId, false);
                    }
                }
            });
        return selectedIdsMap;
    }

    private deleteFromChildren(id: TId, children: TId[]) {
        const foundIndex = children.findIndex((childId) => childId === id);
        if (foundIndex !== -1) {
            children.splice(foundIndex, 1);
        }

        return children;
    }

    private patchChildren(
        children: TId[] | undefined,
        { existingItem, newItem }: { existingItem: TItem | undefined; newItem: TItem },
        comparator: ItemsComparator<TItem>,
        byId: IMap<TId, TItem>,
    ) {
        const id = this.getId(newItem);
        const parentId = this.getParentId(newItem);
        const prevParentId = existingItem ? this.getParentId(existingItem) : undefined;

        if (!children || children === this.byParentId.get(parentId)) {
            children = children ? [...children] : [];
        }

        if ((!existingItem || (existingItem && parentId !== prevParentId)) && comparator) {
            return this.pasteItemIntoChildrenList(newItem, children, comparator, byId);
        }

        children.push(id);
        return children;
    }

    private pasteItemIntoChildrenList(item: TItem, children: TId[], comparator: ItemsComparator<TItem>, byId: IMap<TId, TItem>) {
        const id = this.getId(item);
        if (!children.length) {
            return [id];
        }

        // paste item should be the second argument
        const lessOrEqualPosition = children.findIndex((itemId) => comparator(item, byId.get(itemId)) <= 0);
        const position = lessOrEqualPosition === -1 ? children.length : lessOrEqualPosition;

        children.splice(position, 0, id);
        return children;
    }
}
