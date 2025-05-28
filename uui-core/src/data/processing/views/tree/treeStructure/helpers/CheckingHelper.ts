import isEqual from 'react-fast-compare';
import { CascadeSelectionTypes } from '../../../../../../types';
import { Tree } from '../../Tree';
import { NOT_FOUND_RECORD, ROOT_ID } from '../../constants';
import { newMap } from '../../helpers/map';
import { ActForCheckableOptions, CascadeSelectionOptions, CheckParentsWithFullCheckOptions, ClearAllOptions, ClearIfTreeNotLoadedOptions, ClearUnknownItemsOptions, SelectionOptions } from './types';

export class CheckingHelper {
    public static cascadeSelection<TItem, TId>({
        tree,
        currentCheckedIds,
        checkedId,
        isChecked,
        isCheckable,
        isUnknown,
        cascadeSelectionType,
    }: CascadeSelectionOptions<TItem, TId>) {
        const isImplicitMode = cascadeSelectionType === CascadeSelectionTypes.IMPLICIT;
        let checkedIdsMap = newMap<TId, boolean>(tree.getParams());
        if (!(checkedId === ROOT_ID && isImplicitMode)) {
            currentCheckedIds.forEach((id) => checkedIdsMap.set(id, true));
        }
        const optionsWithDefaults = { isCheckable: isCheckable ?? (() => true), cascadeSelectionType };

        const { count } = tree.getItems(undefined);
        const treeIsLoaded = count !== 0;
        // If clear items while tree is not loaded yet (while clearing tags of PickerInput before opening body).
        if (!treeIsLoaded && !isChecked) {
            checkedIdsMap = this.clearIfTreeNotLoaded({
                tree,
                checkedIdsMap,
                checkedId,
                isCheckable: optionsWithDefaults.isCheckable,
            });
        }

        if (treeIsLoaded && !optionsWithDefaults.cascadeSelectionType) {
            checkedIdsMap = this.simpleSelection({
                tree,
                checkedIdsMap,
                checkedId,
                isChecked,
                ...optionsWithDefaults,
            });
        }

        if (treeIsLoaded && (
            optionsWithDefaults.cascadeSelectionType === true
            || optionsWithDefaults.cascadeSelectionType === CascadeSelectionTypes.EXPLICIT)
        ) {
            checkedIdsMap = this.explicitCascadeSelection({
                tree,
                checkedIdsMap,
                checkedId,
                isChecked,
                ...optionsWithDefaults,
            });
        }

        if (treeIsLoaded && optionsWithDefaults.cascadeSelectionType === CascadeSelectionTypes.IMPLICIT) {
            checkedIdsMap = this.implicitCascadeSelection({
                tree,
                checkedIdsMap,
                checkedId,
                isChecked,
                ...optionsWithDefaults,
            });
        }

        if (!isChecked && checkedId === ROOT_ID && checkedIdsMap.size > 0) {
            checkedIdsMap = this.clearUnknownItems({ checkedIdsMap, isUnknown });
        }

        const result = [];
        for (const [id, value] of checkedIdsMap) {
            value && result.push(id);
        }

        return result;
    }

    private static simpleSelection<TItem, TId>({
        tree,
        checkedIdsMap,
        checkedId,
        isChecked,
        isCheckable,
    }: SelectionOptions<TItem, TId>) {
        if (isChecked) {
            // eslint-disable-next-line eqeqeq
            if (checkedId != ROOT_ID) {
                checkedIdsMap.set(checkedId, true);
            } else {
                Tree.forEachChildren<TItem, TId>(
                    tree,
                    (id) => { checkedIdsMap.set(id, true); },
                    isCheckable,
                );
            }
            return checkedIdsMap;
        }

        // eslint-disable-next-line eqeqeq
        if (checkedId != ROOT_ID) {
            checkedIdsMap.delete(checkedId);
            return checkedIdsMap;
        }

        return this.clearAllChecked({ tree, checkedIdsMap, isCheckable });
    }

    private static clearAllChecked<TItem, TId>({
        tree,
        checkedIdsMap,
        isCheckable,
    }: ClearAllOptions<TItem, TId>) {
        for (const [checkedItemId, isItemChecked] of checkedIdsMap) {
            if (isItemChecked) {
                this.actForCheckable({
                    tree,
                    action: (id) => checkedIdsMap.delete(id),
                    isCheckable,
                    id: checkedItemId,
                });
            }
        }
        return checkedIdsMap;
    }

    private static actForCheckable<TItem, TId>({
        tree,
        action,
        isCheckable,
        id,
    }: ActForCheckableOptions<TItem, TId>) {
        const item = tree.getById(id);
        if (isCheckable(id, item)) {
            action(id);
        }
    }

    private static explicitCascadeSelection<TItem, TId>({
        tree,
        checkedIdsMap,
        checkedId,
        isChecked,
        isCheckable,
    }: SelectionOptions<TItem, TId>) {
        if (isChecked) {
            // eslint-disable-next-line eqeqeq
            if (checkedId != ROOT_ID) {
                checkedIdsMap.set(checkedId, true);
            }
            // check all children recursively
            Tree.forEachChildren<TItem, TId>(
                tree,
                // eslint-disable-next-line eqeqeq
                (id) => id != ROOT_ID && checkedIdsMap.set(id, true),
                isCheckable,
                checkedId,
            );
            return this.checkParentsWithFullCheck({ tree, checkedIdsMap, checkedId, isCheckable });
        }

        // eslint-disable-next-line eqeqeq
        if (checkedId != ROOT_ID) {
            checkedIdsMap.delete(checkedId);
            // uncheck all children recursively
            Tree.forEachChildren<TItem, TId>(
                tree,
                (id) => checkedIdsMap.delete(id),
                isCheckable,
                checkedId,
            );

            Tree.getParents(checkedId, tree).forEach((parentId) => checkedIdsMap.delete(parentId));

            return checkedIdsMap;
        }

        return this.clearAllChecked({ tree, checkedIdsMap, isCheckable });
    }

    private static implicitCascadeSelection<TItem, TId>({
        tree,
        checkedIdsMap,
        checkedId,
        isChecked,
        isCheckable,
    }: SelectionOptions<TItem, TId>) {
        if (isChecked) {
            // eslint-disable-next-line eqeqeq
            if (checkedId != ROOT_ID) {
                checkedIdsMap.set(checkedId, true);
            }

            // In implicit mode, no children are loaded into the parent.
            // When some child is checked and the search is cleared, while checking the top parent no children will be loaded,
            // so there will be no children in the list of checked parent's children. Because of such behavior, explicitly checked
            // children will not be removed from the list.
            // To remove them, it is required to pass through all the checked items and check, if their parents don't contain the checked item.
            if (checkedIdsMap.size) {
                for (const [id] of checkedIdsMap) {
                    if (isEqual(id, checkedId)) {
                        continue;
                    }
                    const path = Tree.getPathById(id, tree);
                    if (path.some((item) => isEqual(item.id, checkedId))) {
                        checkedIdsMap.delete(id);
                    }
                }
            }

            if (checkedId === ROOT_ID) {
                const { ids: childrenIds } = tree.getItems(checkedId);

                // if selectedId is undefined and it is selected, that means selectAll
                childrenIds.forEach((id) => checkedIdsMap.set(id, true));
            }
            // check parents if all children are checked
            return this.checkParentsWithFullCheck({
                tree,
                checkedIdsMap,
                checkedId,
                isCheckable,
                removeExplicitChildrenSelection: true,
            });
        }

        // eslint-disable-next-line eqeqeq
        if (checkedId != ROOT_ID) {
            checkedIdsMap.delete(checkedId);

            const selectNeighboursOnly = (itemId: TId) => {
                const item = tree.getById(itemId);
                if (item === NOT_FOUND_RECORD) {
                    return;
                }

                const parentId = tree.getParams().getParentId?.(item);
                const parents = Tree.getParents(itemId, tree);
                // if some parent is checked, it is required to check all children explicitly,
                // except unchecked one.
                const someParentIsChecked = parents.some((parent) => checkedIdsMap.get(parent));
                tree.getItems(parentId).ids.forEach((id) => {
                    if (itemId !== id && someParentIsChecked) {
                        checkedIdsMap.set(id, true);
                    }
                });
                checkedIdsMap.delete(parentId);
            };

            const parents = Tree.getParents(checkedId, tree);
            [checkedId, ...parents.reverse()].forEach(selectNeighboursOnly);

            return checkedIdsMap;
        }

        return this.clearAllChecked({ tree, checkedIdsMap, isCheckable });
    }

    private static checkParentsWithFullCheck<TItem, TId>({
        tree,
        checkedIdsMap,
        checkedId,
        isCheckable,
        removeExplicitChildrenSelection,
    }: CheckParentsWithFullCheckOptions<TItem, TId>) {
        Tree.getParents(checkedId, tree)
            .reverse()
            .forEach((parentId) => {
                const { ids: childrenIds } = tree.getItems(parentId);
                if (childrenIds && childrenIds.every((childId) => checkedIdsMap.has(childId))) {
                    checkedIdsMap.set(parentId, true);

                    if (removeExplicitChildrenSelection) {
                        Tree.forEachChildren(
                            tree,
                            (id) => checkedIdsMap.delete(id),
                            isCheckable,
                            parentId,
                            false,
                        );
                    }
                }
            });
        return checkedIdsMap;
    }

    private static clearIfTreeNotLoaded<TItem, TId>({
        tree,
        checkedIdsMap,
        checkedId,
        isCheckable,
    }: ClearIfTreeNotLoadedOptions<TItem, TId>) {
        if (checkedId !== ROOT_ID) {
            const item = tree.getById(checkedId);
            if (isCheckable(checkedId, item)) {
                checkedIdsMap.delete(checkedId);
            }
        } else {
            for (const [selectedItemId, isItemSelected] of checkedIdsMap) {
                const selectedItem = tree.getById(selectedItemId);
                if (isItemSelected && isCheckable(selectedItemId, selectedItem)) {
                    checkedIdsMap.delete(selectedItemId);
                }
            }
        }
        return checkedIdsMap;
    }

    private static clearUnknownItems<TId>({
        checkedIdsMap,
        isUnknown,
    }: ClearUnknownItemsOptions<TId>) {
        for (const [selectedItemId, isItemSelected] of checkedIdsMap) {
            if (isItemSelected && isUnknown(selectedItemId)) {
                checkedIdsMap.delete(selectedItemId);
            }
        }
        return checkedIdsMap;
    }
}
