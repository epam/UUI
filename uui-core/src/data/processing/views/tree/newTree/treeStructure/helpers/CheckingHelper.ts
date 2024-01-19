import { CascadeSelectionTypes } from '../../../../../../../types';
import { ROOT_ID } from '../../constants';
import { newMap } from './map';
import { ActForCheckableOptions, CascadeSelectionOptions, CheckParentsWithFullCheckOptions, SelectionOptions } from './types';

export class CheckingHelper {
    public static cascadeSelection<TItem, TId>({
        treeStructure,
        itemsMap,
        currentCheckedIds,
        checkedId,
        isChecked,
        isCheckable,
        cascadeSelectionType,
    }: CascadeSelectionOptions<TItem, TId>) {
        const isImplicitMode = cascadeSelectionType === CascadeSelectionTypes.IMPLICIT;
        let checkedIdsMap = newMap<TId, boolean>(treeStructure.params);
        if (!(checkedId === ROOT_ID && isImplicitMode)) {
            currentCheckedIds.forEach((id) => checkedIdsMap.set(id, true));
        }

        const optionsWithDefaults = { isCheckable: isCheckable ?? (() => true), cascadeSelectionType: cascadeSelectionType ?? true };
        if (!optionsWithDefaults.cascadeSelectionType) {
            checkedIdsMap = this.simpleSelection({
                treeStructure,
                itemsMap,
                checkedIdsMap,
                checkedId,
                isChecked,
                ...optionsWithDefaults,
            });
        }

        if (optionsWithDefaults.cascadeSelectionType === true || optionsWithDefaults.cascadeSelectionType === CascadeSelectionTypes.EXPLICIT) {
            checkedIdsMap = this.explicitCascadeSelection({
                treeStructure,
                itemsMap,
                checkedIdsMap,
                checkedId,
                isChecked,
                ...optionsWithDefaults,
            });
        }

        if (optionsWithDefaults.cascadeSelectionType === CascadeSelectionTypes.IMPLICIT) {
            checkedIdsMap = this.implicitCascadeSelection({
                treeStructure,
                itemsMap,
                checkedIdsMap,
                checkedId,
                isChecked,
                ...optionsWithDefaults,
            });
        }

        const result = [];
        for (const [id, value] of checkedIdsMap) {
            value && result.push(id);
        }

        return result;
    }

    private static simpleSelection<TItem, TId>({
        itemsMap,
        checkedIdsMap,
        checkedId,
        isChecked,
        isCheckable,
    }: SelectionOptions<TItem, TId>) {
        if (isChecked) {
            if (checkedId !== ROOT_ID) {
                checkedIdsMap.set(checkedId, true);
            } else {
                itemsMap.forEach((item, id) => {
                    if (isCheckable(item)) {
                        checkedIdsMap.set(id, true);
                    }
                });
            }
            return checkedIdsMap;
        }

        if (checkedId !== ROOT_ID) {
            checkedIdsMap.delete(checkedId);
        } else {
            for (const [checkedItemId, isItemChecked] of checkedIdsMap) {
                if (isItemChecked) {
                    this.actForCheckable({
                        itemsMap,
                        action: (id) => checkedIdsMap.delete(id),
                        isCheckable,
                        id: checkedItemId,
                    });
                }
            }
            return checkedIdsMap;
        }

        return checkedIdsMap;
    }

    private static actForCheckable<TItem, TId>({
        itemsMap,
        action,
        isCheckable,
        id,
    }: ActForCheckableOptions<TItem, TId>) {
        const item = itemsMap.get(id);
        if (itemsMap.has(id) && isCheckable(item)) {
            action(id);
        }
    }

    private static explicitCascadeSelection<TItem, TId>({
        treeStructure,
        checkedIdsMap,
        checkedId,
        isChecked,
        isCheckable,
    }: SelectionOptions<TItem, TId>) {
        if (isChecked) {
            if (checkedId !== ROOT_ID) {
                checkedIdsMap.set(checkedId, true);
            }
            // check all children recursively
            treeStructure.forEachChildren((id) => id !== ROOT_ID && checkedIdsMap.set(id, true), isCheckable, checkedId);
            return this.checkParentsWithFullCheck({ treeStructure, checkedIdsMap, checkedId, isCheckable });
        }

        if (checkedId !== ROOT_ID) {
            checkedIdsMap.delete(checkedId);
        }

        // uncheck all children recursively
        treeStructure.forEachChildren((id) => checkedIdsMap.delete(id), isCheckable, checkedId);

        treeStructure.getParentIdsRecursive(checkedId).forEach((parentId) => checkedIdsMap.delete(parentId));

        return checkedIdsMap;
    }

    private static implicitCascadeSelection<TItem, TId>({
        treeStructure,
        itemsMap,
        checkedIdsMap,
        checkedId,
        isChecked,
        isCheckable,
    }: SelectionOptions<TItem, TId>) {
        if (isChecked) {
            if (checkedId !== ROOT_ID) {
                checkedIdsMap.set(checkedId, true);
            }
            // for implicit mode, it is required to remove explicit check from children,
            // if parent is checked
            treeStructure.forEachChildren((id) => checkedIdsMap.delete(id), isCheckable, checkedId, false);
            if (checkedId === ROOT_ID) {
                const childrenIds = treeStructure.getChildrenIdsByParentId(checkedId);

                // if selectedId is undefined and it is selected, that means selectAll
                childrenIds.forEach((id) => checkedIdsMap.set(id, true));
            }
            // check parents if all children are checked
            return this.checkParentsWithFullCheck({
                treeStructure,
                checkedIdsMap,
                checkedId,
                isCheckable,
                removeExplicitChildrenSelection: true,
            });
        }

        if (checkedId !== ROOT_ID) {
            checkedIdsMap.delete(checkedId);
        }

        const selectNeighboursOnly = (itemId: TId) => {
            if (!itemsMap.has(itemId)) {
                return;
            }
            const item = itemsMap.get(itemId);
            const parentId = treeStructure.params.getParentId?.(item);
            const parents = treeStructure.getParentIdsRecursive(itemId);
            // if some parent is checked, it is required to check all children explicitly,
            // except unchecked one.
            const someParentIsChecked = parents.some((parent) => checkedIdsMap.get(parent));
            treeStructure.getChildrenIdsByParentId(parentId).forEach((id) => {
                if (itemId !== id && someParentIsChecked) {
                    checkedIdsMap.set(id, true);
                }
            });
            checkedIdsMap.delete(parentId);
        };

        if (checkedId !== ROOT_ID) {
            const parents = treeStructure.getParentIdsRecursive(checkedId);
            [checkedId, ...parents.reverse()].forEach(selectNeighboursOnly);
        }
        return checkedIdsMap;
    }

    private static checkParentsWithFullCheck<TItem, TId>({
        treeStructure,
        checkedIdsMap,
        checkedId,
        isCheckable,
        removeExplicitChildrenSelection,
    }: CheckParentsWithFullCheckOptions<TItem, TId>) {
        treeStructure.getParentIdsRecursive(checkedId)
            .reverse()
            .forEach((parentId) => {
                const childrenIds = treeStructure.getChildrenIdsByParentId(parentId);
                if (childrenIds && childrenIds.every((childId) => checkedIdsMap.has(childId))) {
                    if (parentId !== ROOT_ID) {
                        checkedIdsMap.set(parentId, true);
                    }
                    if (removeExplicitChildrenSelection) {
                        treeStructure.forEachChildren((id) => checkedIdsMap.delete(id), isCheckable, parentId, false);
                    }
                }
            });
        return checkedIdsMap;
    }
}
