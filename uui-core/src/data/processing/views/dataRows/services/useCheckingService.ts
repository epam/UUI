import { useCallback, useMemo } from 'react';
import { CascadeSelectionTypes, DataRowProps } from '../../../../../types';
import { ITree, NOT_FOUND_RECORD } from '../../tree';
import { CommonDataSourceConfig, GetItemStatus } from '../../tree/hooks/strategies/types';
import { CascadeSelectionService } from './useCascadeSelectionService';
import { CheckingHelper, FAILED_RECORD } from '../../tree/newTree';
import { isInProgress } from '../../helpers';
import { buildParentsLookup, idToKey } from './buildParentsLookup';

export interface UseCheckingServiceProps<TItem, TId, TFilter = any> extends
    Pick<
    CommonDataSourceConfig<TItem, TId, TFilter>,
    'getParentId' | 'dataSourceState' | 'setDataSourceState'
    | 'rowOptions' | 'getRowOptions' | 'cascadeSelection'
    >,
    CascadeSelectionService<TId>,
    GetItemStatus<TId> {
    tree: ITree<TItem, TId>;
}

export interface CheckingService<TItem, TId> {
    isRowChecked: (row: DataRowProps<TItem, TId>) => boolean;
    isRowChildrenChecked: (row: DataRowProps<TItem, TId>) => boolean;
    handleOnCheck: (rowProps: DataRowProps<TItem, TId>) => void;
    handleSelectAll: (isChecked: boolean) => void;

    clearAllChecked: () => void;
    isItemCheckable: (id: TId, item: TItem | typeof NOT_FOUND_RECORD) => boolean;
}

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
        getItemStatus,
    }: UseCheckingServiceProps<TItem, TId>,
): CheckingService<TItem, TId> {
    const checked = dataSourceState.checked ?? [];
    const checkingInfoById = useMemo(
        () => buildParentsLookup(checked, tree, getParentId),
        [tree, getParentId, checked],
    );

    const { idsByKey: checkedByKey, someChildInIdsByKey: someChildCheckedByKey } = checkingInfoById;

    const isRowChecked = useCallback((row: DataRowProps<TItem, TId>) => {
        const exactCheck = !!checkedByKey[row.rowKey];
        if (exactCheck || cascadeSelection !== CascadeSelectionTypes.IMPLICIT) {
            return exactCheck;
        }

        const { path } = row;
        return path.some(({ id }) => !!checkedByKey[idToKey(id)]);
    }, [checkedByKey]);

    const isRowChildrenChecked = useCallback((row: DataRowProps<TItem, TId>) => {
        if (cascadeSelection === CascadeSelectionTypes.IMPLICIT) {
            return isRowChecked(row) || someChildCheckedByKey[row.rowKey] || false;
        }

        return someChildCheckedByKey[row.rowKey] ?? false;
    }, [someChildCheckedByKey, isRowChecked, tree]);

    const getRowProps = useCallback((item: TItem) => {
        const externalRowOptions = getRowOptions ? getRowOptions(item) : {};
        return { ...rowOptions, ...externalRowOptions };
    }, [rowOptions, getRowOptions]);

    const isItemCheckable = useCallback((id: TId, item: TItem | typeof NOT_FOUND_RECORD) => {
        if (item === NOT_FOUND_RECORD) {
            const status = getItemStatus(id);
            if (isInProgress(status)) {
                return false;
            }

            if (item === FAILED_RECORD || item === NOT_FOUND_RECORD) {
                return true;
            }

            return false;
        }

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
