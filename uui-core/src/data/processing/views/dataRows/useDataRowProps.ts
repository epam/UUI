import { useCallback, useMemo } from 'react';
import { DataRowPathItem, DataRowProps } from '../../../../types';
import { CheckingService, FocusService, FoldingService, SelectingService } from './services';
import { idToKey } from '../helpers';
import { CommonTreeConfig } from '../tree/hooks/strategies/types/common';
import { ITree, Tree } from '../tree';

export interface UseDataRowPropsProps<TItem, TId, TFilter = any> extends Omit<CheckingService<TItem, TId>, 'clearAllChecked' | 'handleSelectAll'>,
    FocusService,
    SelectingService<TItem, TId>,
    FoldingService<TItem, TId>,
    Pick<
    CommonTreeConfig<TItem, TId, TFilter>,
    'dataSourceState' | 'rowOptions' | 'getRowOptions' | 'getId'
    > {
    /**
     * Tree-like data, rows to be built from.
     */
    tree: ITree<TItem, TId>;

    getEstimatedChildrenCount: (id: TId) => number;
}

export function useDataRowProps<TItem, TId, TFilter = any>(
    {
        tree,
        getId,
        dataSourceState,
        getRowOptions,
        rowOptions,
        isFolded,
        handleOnCheck,
        handleOnSelect,
        handleOnFocus,
        handleOnFold,
        isRowSelected,
        isRowChildSelected,
        isRowChecked,
        isRowChildrenChecked,
        getEstimatedChildrenCount,
    }: UseDataRowPropsProps<TItem, TId, TFilter>,
) {
    const updateRowOptions = useCallback((row: DataRowProps<TItem, TId>) => {
        const externalRowOptions = (getRowOptions && !row.isLoading)
            ? getRowOptions(row.value, row.index)
            : {};

        const fullRowOptions = { ...rowOptions, ...externalRowOptions };

        const estimatedChildrenCount = getEstimatedChildrenCount(row.id);
        row.isFoldable = false;
        if (estimatedChildrenCount > 0) {
            row.isFoldable = true;
        }

        const isCheckable = !!(fullRowOptions?.checkbox && fullRowOptions?.checkbox?.isVisible && !fullRowOptions?.checkbox?.isDisabled);
        const isSelectable = fullRowOptions && fullRowOptions.isSelectable;
        if (fullRowOptions != null) {
            const rowValue = row.value;
            Object.assign(row, fullRowOptions);
            row.value = fullRowOptions.value ?? rowValue;
        }
        row.isFocused = dataSourceState.focusedIndex === row.index;
        row.isChecked = isRowChecked(row);
        row.isSelected = isRowSelected(row);
        row.isCheckable = isCheckable;
        row.onCheck = isCheckable ? handleOnCheck : undefined;

        row.onSelect = fullRowOptions?.isSelectable ? handleOnSelect : undefined;
        row.onFocus = (isSelectable || isCheckable || row.isFoldable) ? handleOnFocus : undefined;
        row.onFold = row.isFoldable ? handleOnFold : undefined;
        row.isFolded = row.isFoldable && isFolded(row.value);

        row.isChildrenChecked = isRowChildrenChecked(row);
        row.isChildrenSelected = isRowChildSelected(row);

        return row;
    }, [
        tree,
        getRowOptions,
        rowOptions,
        getEstimatedChildrenCount,
        dataSourceState.focusedIndex,
        dataSourceState.selectedId,
        isRowChecked,
        isRowChildrenChecked,
        handleOnCheck,
        handleOnSelect,
        handleOnFocus,
        isFolded,
        handleOnFold,
    ]);

    const getRowProps = useCallback((item: TItem, index: number): DataRowProps<TItem, TId> => {
        const id = getId(item);
        const key = idToKey(id);
        const path = Tree.getPathById(id, tree);
        const parentId = path.length > 0 ? path[path.length - 1].id : undefined;
        const rowProps = {
            id,
            parentId,
            key,
            rowKey: key,
            index,
            value: item,
            depth: path.length,
            path,
        } as DataRowProps<TItem, TId>;

        return updateRowOptions(rowProps);
    }, [getId, tree, updateRowOptions]);

    const getEmptyRowProps = useCallback((id: any, index: number = 0, path: DataRowPathItem<TId, TItem>[] = null): DataRowProps<TItem, TId> => {
        const checked = dataSourceState?.checked ?? [];
        const isChecked = checked.includes(id);
        return {
            id,
            rowKey: idToKey(id),
            value: undefined,
            index,
            depth: path ? path.length : 0,
            path: path ?? [],
            checkbox: rowOptions?.checkbox?.isVisible && { isVisible: true, isDisabled: true },
            isChecked,
        };
    }, [dataSourceState?.checked, rowOptions]);

    const getLoadingRowProps = useCallback((id: any, index: number = 0, path: DataRowPathItem<TId, TItem>[] = null): DataRowProps<TItem, TId> => {
        const rowProps = getEmptyRowProps(id, index, path);
        return {
            ...rowProps,
            checkbox: { ...rowProps.checkbox, isDisabled: true },
            isLoading: true,
        };
    }, [getEmptyRowProps]);

    const getUnknownRowProps = useCallback((id: any, index: number = 0, path: DataRowPathItem<TId, TItem>[] = null): DataRowProps<TItem, TId> => {
        const emptyRowProps = getEmptyRowProps(id, index, path);
        const checkbox = (rowOptions?.checkbox?.isVisible || emptyRowProps.isChecked)
            ? { isVisible: true, isDisabled: false }
            : undefined;

        const isCheckable = checkbox && checkbox.isVisible && !checkbox.isDisabled;
        return {
            ...emptyRowProps,
            checkbox,
            isUnknown: true,
            onCheck: isCheckable ? handleOnCheck : undefined,
        };
    }, [getEmptyRowProps, rowOptions, handleOnCheck]);

    return useMemo(
        () => ({ getRowProps, getEmptyRowProps, getLoadingRowProps, getUnknownRowProps, updateRowOptions }),
        [getRowProps, getEmptyRowProps, getLoadingRowProps, getUnknownRowProps, updateRowOptions],
    );
}
