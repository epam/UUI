import { CascadeSelectionTypes } from '../../../../../../../types';
import { Tree } from '../../Tree';
import { NOT_FOUND_RECORD, ROOT_ID } from '../../constants';
import { newMap } from './map';
import { ActForCheckableOptions, CascadeSelectionOptions, CheckParentsWithFullCheckOptions, SelectionOptions } from './types';

export class CheckingHelper {
    public static cascadeSelection<TItem, TId>({
        tree,
        currentCheckedIds,
        checkedId,
        isChecked,
        isCheckable,
        cascadeSelectionType,
    }: CascadeSelectionOptions<TItem, TId>) {
        const isImplicitMode = cascadeSelectionType === CascadeSelectionTypes.IMPLICIT;
        let checkedIdsMap = newMap<TId, boolean>(tree.getParams());
        if (!(checkedId === ROOT_ID && isImplicitMode)) {
            currentCheckedIds.forEach((id) => checkedIdsMap.set(id, true));
        }

        const optionsWithDefaults = { isCheckable: isCheckable ?? (() => true), cascadeSelectionType: cascadeSelectionType ?? true };
        if (!optionsWithDefaults.cascadeSelectionType) {
            checkedIdsMap = this.simpleSelection({
                tree,
                checkedIdsMap,
                checkedId,
                isChecked,
                ...optionsWithDefaults,
            });
        }

        if (optionsWithDefaults.cascadeSelectionType === true || optionsWithDefaults.cascadeSelectionType === CascadeSelectionTypes.EXPLICIT) {
            checkedIdsMap = this.explicitCascadeSelection({
                tree,
                checkedIdsMap,
                checkedId,
                isChecked,
                ...optionsWithDefaults,
            });
        }

        if (optionsWithDefaults.cascadeSelectionType === CascadeSelectionTypes.IMPLICIT) {
            checkedIdsMap = this.implicitCascadeSelection({
                tree,
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
        } else {
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

        return checkedIdsMap;
    }

    private static actForCheckable<TItem, TId>({
        tree,
        action,
        isCheckable,
        id,
    }: ActForCheckableOptions<TItem, TId>) {
        const item = tree.getById(id);
        if (item !== NOT_FOUND_RECORD && isCheckable(item)) {
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
        }

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
            // for implicit mode, it is required to remove explicit check from children,
            // if parent is checked
            Tree.forEachChildren<TItem, TId>(
                tree,
                (id) => checkedIdsMap.delete(id),
                isCheckable,
                checkedId,
                false,
            );

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
        }

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

        // eslint-disable-next-line eqeqeq
        if (checkedId != ROOT_ID) {
            const parents = Tree.getParents(checkedId, tree);
            [checkedId, ...parents.reverse()].forEach(selectNeighboursOnly);
        }
        return checkedIdsMap;
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
                    // eslint-disable-next-line eqeqeq
                    if (parentId != ROOT_ID) {
                        checkedIdsMap.set(parentId, true);
                    }
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
}
