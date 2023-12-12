import { useCallback, useMemo } from 'react';
import { CascadeSelection, CascadeSelectionTypes, DataRowOptions, DataRowProps, DataSourceState } from '../../../../../types';
import { ITree, NOT_FOUND_RECORD } from '../../tree';

export interface UseCheckingServiceProps<TItem, TId, TFilter = any> {
    tree: ITree<TItem, TId>;
    getParentId?: (item: TItem) => TId;
    cascadeSelection?: CascadeSelection;
    rowOptions?: DataRowOptions<TItem, TId>;
    getRowOptions?(item: TItem, index?: number): DataRowOptions<TItem, TId>;

    dataSourceState: DataSourceState<TFilter, TId>,
    setDataSourceState?: (dataSourceState: DataSourceState<TFilter, TId>) => void;
}

export interface CheckingService<TItem, TId> {
    isRowChecked: (row: DataRowProps<TItem, TId>) => boolean;
    isRowChildrenChecked: (row: DataRowProps<TItem, TId>) => boolean;
    handleOnCheck: (rowProps: DataRowProps<TItem, TId>) => void;
    handleSelectAll: (isChecked: boolean) => void;
    clearAllChecked: () => void;
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

export function useCheckingService<TItem, TId>(
    {
        tree,
        getParentId,
        dataSourceState,
        setDataSourceState,
        cascadeSelection,
        getRowOptions,
        rowOptions,
    }: UseCheckingServiceProps<TItem, TId>,
): CheckingService<TItem, TId> {
    const checked = dataSourceState.checked ?? [];

    const checkingInfoById = useMemo(
        () => getCheckingInfo(checked, tree, getParentId),
        [tree, checked],
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

    const handleCheck = useCallback((isChecked: boolean, checkedId?: TId) => {
        const updatedChecked = tree.cascadeSelection(checked, checkedId, isChecked, {
            cascade: cascadeSelection,
            isSelectable: (item: TItem) => isItemCheckable(item),
        });

        setDataSourceState({ ...dataSourceState, checked: updatedChecked });
    }, [tree, checked, dataSourceState, setDataSourceState, isItemCheckable, cascadeSelection]);

    const handleSelectAll = useCallback((isChecked: boolean) => {
        handleCheck(isChecked);
    }, [handleCheck]);

    const clearAllChecked = useCallback(() => {
        handleCheck(false);
    }, [handleCheck]);

    const handleOnCheck = useCallback((rowProps: DataRowProps<TItem, TId>) => {
        const id = rowProps.id;
        const isChecked = !rowProps.isChecked;

        handleCheck(isChecked, id);
    }, []);

    return useMemo(
        () => ({
            isRowChecked,
            isRowChildrenChecked,
            handleOnCheck,
            handleSelectAll,
            clearAllChecked,
        }),
        [
            isRowChecked,
            isRowChildrenChecked,
            handleOnCheck,
            handleSelectAll,
            clearAllChecked,
        ],
    );
}
