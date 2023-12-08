import { useMemo } from 'react';
import { CascadeSelectionTypes, DataRowProps } from '../../../../../../../types';
import { ITree, NOT_FOUND_RECORD } from '../../..';
import { CheckingService, UseCheckingServiceProps } from '../types';

const idToKey = <TId, >(id: TId) => typeof id === 'object' ? JSON.stringify(id) : `${id}`;

const getCheckingInfo = <TItem, TId>(checked: TId[] = [], tree: ITree<TItem, TId>, getParentId?: (item: TItem) => TId) => {
    const checkedByKey: Record<string, boolean> = {};
    const someChildCheckedByKey: Record<string, boolean> = {};
    const checkedItems = checked ?? [];

    for (let i = checkedItems.length - 1; i >= 0; i--) {
        const id = checkedItems[i];
        checkedByKey[idToKey(id)] = true;
        if (!tree || !getParentId) {
            continue;
        }

        const item = tree.getById(id);
        if (item === NOT_FOUND_RECORD) {
            continue;
        }

        const parentId = getParentId(item);
        if (!someChildCheckedByKey[idToKey(parentId)]) {
            const parents = tree.getParentIdsRecursive(id).reverse();
            for (const parent of parents) {
                if (someChildCheckedByKey[idToKey(parent)]) {
                    break;
                }
                someChildCheckedByKey[idToKey(parent)] = true;
            }
        }
    }
    return { checkedByKey, someChildCheckedByKey };
};

export function useCheckingService<TItem, TId, TFilter = any>(
    { tree, getParentId, checked = [], cascadeSelection}: UseCheckingServiceProps<TItem, TId, TFilter>,
): CheckingService {
    const checkingInfoById = useMemo(
        () => getCheckingInfo(checked, tree, getParentId),
        [tree, checked],
    );

    const { checkedByKey, someChildCheckedByKey } = checkingInfoById;

    const isRowChecked = (row: DataRowProps<TItem, TId>) => {
        const exactCheck = !!checkedByKey[row.rowKey];
        if (exactCheck || cascadeSelection !== CascadeSelectionTypes.IMPLICIT) {
            return exactCheck;
        }

        const { path } = row;
        return path.some(({ id }) => !!checkedByKey[idToKey(id)]);
    };

    return useMemo(() => ({ isRowChecked }), [checkingInfoById, isRowChecked]);
}
