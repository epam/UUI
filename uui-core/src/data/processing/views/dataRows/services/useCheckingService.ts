import { useCallback, useMemo } from 'react';
import { CascadeSelectionTypes, DataRowProps } from '../../../../../types';
import { ITree, NOT_FOUND_RECORD } from '../../tree';
import { CommonTreeConfig, GetItemStatus } from '../../tree/hooks/strategies/types';
import { CascadeSelectionService } from './useCascadeSelectionService';
import { FAILED_RECORD } from '../../tree';
import { isInProgress } from '../../helpers';
import { buildParentsLookup, idToKey } from './buildParentsLookup';
import { CheckingHelper } from '../../tree/treeStructure';

/**
 * Checking service configuration.
 */
export interface UseCheckingServiceProps<TItem, TId, TFilter = any> extends
    Pick<
    CommonTreeConfig<TItem, TId, TFilter>,
    'getParentId' | 'dataSourceState' | 'setDataSourceState'
    | 'rowOptions' | 'getRowOptions' | 'cascadeSelection'
    >,
    CascadeSelectionService<TItem, TId>,
    GetItemStatus<TId> {
    /**
     * Tree-like data, selection should be performed on.
     */
    tree: ITree<TItem, TId>;
}

/**
 * Service, which provides checking functionality and checking/parially checking info.
 */
export interface CheckingService<TItem, TId> {
    /**
     * Provides knowledge about checked state of the row.
     * @param row - row, which checked state info should be returned.
     * @returns if row is checked.
     */
    isRowChecked: (row: DataRowProps<TItem, TId>) => boolean;

    /**
     * Provides knowledge about children checked state of the row.
     * @param row - row, which children checked state info should be returned.
     * @returns if row children are checked.
     */
    isRowChildrenChecked: (row: DataRowProps<TItem, TId>) => boolean;

    /**
     * Checking handler of a row.
     * @param row - row, which should be checked.
     */
    handleOnCheck: (row: DataRowProps<TItem, TId>) => void;

    /**
     * Select all handler of a row.
     * @param selectAll - specifies, if select all or clear all should be performed.
     */
    handleSelectAll: (selectAll: boolean) => void;

    /**
     * Clears all checked.
     */
    clearAllChecked: () => void;

    /**
     * Provides info about the ability to check and item.
     * @param id - id of the item to check if checkable.
     * @param item - record, if it is present or not found record symbol.
     * @returns if item with some id is checkable.
     */
    isItemCheckable: (id: TId, item: TItem | typeof NOT_FOUND_RECORD) => boolean;
}

/**
 * Service, which provides checking functionality.
 * @returns checking service.
 */
export function useCheckingService<TItem, TId>(
    {
        tree,
        getParentId,
        dataSourceState,
        setDataSourceState,
        cascadeSelection,
        getRowOptions,
        rowOptions,
        getCompleteTreeForCascadeSelection,
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
            if (!getItemStatus) {
                return true;
            }

            const status = getItemStatus(id);
            if (isInProgress(status)) {
                return false;
            }

            if (status === FAILED_RECORD || status === NOT_FOUND_RECORD) {
                return true;
            }

            return false;
        }

        const rowProps = getRowProps(item);
        return rowProps?.checkbox?.isVisible && !rowProps?.checkbox?.isDisabled;
    }, [getRowProps]);

    const isItemUnknown = useCallback((id: TId) => {
        const item = tree.getById(id);
        if (item !== NOT_FOUND_RECORD) {
            return false;
        }
        if (!getItemStatus) {
            return true;
        }

        const status = getItemStatus(id);
        return status === FAILED_RECORD || status === NOT_FOUND_RECORD;
    }, [tree, getItemStatus]);

    const handleCheck = useCallback(async (isChecked: boolean, checkedId?: TId, isRoot?: boolean) => {
        const completeTree = await getCompleteTreeForCascadeSelection(checkedId, isChecked, isRoot);
        setDataSourceState((dsState) => {
            return {
                ...dsState,
                checked: CheckingHelper.cascadeSelection({
                    tree: completeTree,
                    currentCheckedIds: dsState.checked ?? [],
                    checkedId,
                    isChecked,
                    isCheckable: isItemCheckable,
                    isUnknown: isItemUnknown,
                    cascadeSelectionType: cascadeSelection,
                }),
            };
        });
    }, [getCompleteTreeForCascadeSelection, setDataSourceState, isItemCheckable, isItemUnknown, cascadeSelection]);

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

    return {
        isRowChecked,
        isRowChildrenChecked,
        handleOnCheck,
        handleSelectAll,
        clearAllChecked,
        isItemCheckable,
    };
}
