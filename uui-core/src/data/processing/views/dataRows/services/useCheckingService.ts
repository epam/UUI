import { useCallback, useMemo } from 'react';
import { CascadeSelectionTypes, DataRowProps } from '../../../../../types';
import { ITree, NOT_FOUND_RECORD, Tree } from '../../tree';
import { CommonDataSourceConfig } from '../../tree/hooks/strategies/types';
import { CascadeSelectionService } from './useCascadeSelectionService';
import { CheckingHelper, isFound } from '../../tree/newTree';

export interface UseCheckingServiceProps<TItem, TId, TFilter = any> extends
    Pick<
    CommonDataSourceConfig<TItem, TId, TFilter>,
    'getParentId' | 'dataSourceState' | 'setDataSourceState'
    | 'rowOptions' | 'getRowOptions' | 'cascadeSelection'
    >,
    CascadeSelectionService<TId> {
    tree: ITree<TItem, TId>;
}

export interface CheckingService<TItem, TId> {
    isRowChecked: (row: DataRowProps<TItem, TId>) => boolean;
    isRowChildrenChecked: (row: DataRowProps<TItem, TId>) => boolean;
    handleOnCheck: (rowProps: DataRowProps<TItem, TId>) => void;
    handleSelectAll: (isChecked: boolean) => void;

    clearAllChecked: () => void;
    isItemCheckable: (item: TItem) => boolean;
}

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
        if (!isFound(item)) {
            continue;
        }

        const parentId = getParentId(item);
        if (!someChildCheckedByKey[idToKey(parentId)]) {
            const parents = Tree.getParents(id, tree).reverse();
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

export function useCheckingService<TItem, TId>(
    {
        tree,
        getParentId,
        dataSourceState,
        setDataSourceState,
        cascadeSelection,
        getRowOptions,
        rowOptions,
        handleCascadeSelection,
    }: UseCheckingServiceProps<TItem, TId>,
): CheckingService<TItem, TId> {
    const checked = dataSourceState.checked ?? [];
    const checkingInfoById = useMemo(
        () => getCheckingInfo(checked, tree, getParentId),
        [tree, tree, getParentId, checked],
    );

    const { checkedByKey, someChildCheckedByKey } = checkingInfoById;

    const isRowChecked = useCallback((row: DataRowProps<TItem, TId>) => {
        const exactCheck = !!checkedByKey[row.rowKey];
        if (exactCheck || cascadeSelection !== CascadeSelectionTypes.IMPLICIT) {
            return exactCheck;
        }

        const { path } = row;
        return path.some(({ id }) => !!checkedByKey[idToKey(id)]);
    }, [checkedByKey]);

    const isRowChildrenChecked = useCallback((row: DataRowProps<TItem, TId>) => {
        return someChildCheckedByKey[row.rowKey] ?? false;
    }, [someChildCheckedByKey]);

    const getRowProps = useCallback((item: TItem) => {
        const externalRowOptions = getRowOptions ? getRowOptions(item) : {};
        return { ...rowOptions, ...externalRowOptions };
    }, [rowOptions, getRowOptions]);

    const isItemCheckable = useCallback((item: TItem) => {
        const rowProps = getRowProps(item);
        return rowProps?.checkbox?.isVisible && !rowProps?.checkbox?.isDisabled;
    }, [getRowProps]);

    const handleCheck = useCallback(async (isChecked: boolean, checkedId?: TId, isRoot?: boolean) => {
        let updatedChecked: TId[] = [];
        if (handleCascadeSelection) {
            updatedChecked = await handleCascadeSelection?.(isChecked, checkedId, isRoot, checked);
        } else {
            updatedChecked = CheckingHelper.cascadeSelection({
                tree,
                currentCheckedIds: checked,
                checkedId,
                isChecked,
                isCheckable: isItemCheckable,
                cascadeSelectionType: cascadeSelection,
            });
        }

        setDataSourceState((dsState) => ({ ...dsState, checked: updatedChecked }));
    }, [tree, checked, setDataSourceState, isItemCheckable, cascadeSelection]);

    const handleSelectAll = useCallback((isChecked: boolean) => {
        handleCheck(isChecked, undefined, true);
    }, [handleCheck]);

    const clearAllChecked = useCallback(() => {
        handleCheck(false, undefined, true);
    }, [handleCheck]);

    const handleOnCheck = useCallback((rowProps: DataRowProps<TItem, TId>) => {
        const id = rowProps.id;
        const isChecked = !rowProps.isChecked;

        handleCheck(isChecked, id);
    }, [handleCheck]);

    return useMemo(
        () => ({
            isRowChecked,
            isRowChildrenChecked,
            handleOnCheck,
            handleSelectAll,
            clearAllChecked,
            isItemCheckable,
        }),
        [
            isRowChecked,
            isRowChildrenChecked,
            handleOnCheck,
            handleSelectAll,
            clearAllChecked,
            isItemCheckable,
        ],
    );
}
