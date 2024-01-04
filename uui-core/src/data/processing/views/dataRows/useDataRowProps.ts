import { useCallback, useMemo } from 'react';
import { DataRowPathItem, DataRowProps } from '../../../../types';
import { CheckingService, FocusService, SelectingService } from './services';
import { idToKey } from '../helpers';
import { CommonDataSourceConfig } from '../tree/hooks/strategies/types/common';
import { NewTree } from '../tree/newTree';

export interface UseDataRowPropsProps<TItem, TId, TFilter = any> extends Omit<CheckingService<TItem, TId>, 'clearAllChecked' | 'handleSelectAll'>,
    FocusService,
    SelectingService<TItem, TId>,
    Pick<
    CommonDataSourceConfig<TItem, TId, TFilter>,
    'dataSourceState' | 'rowOptions' | 'getRowOptions' | 'getId'
    > {

    tree: NewTree<TItem, TId>;

    isFlattenSearch: boolean;
    getEstimatedChildrenCount: (id: TId) => number;
}

export function useDataRowProps<TItem, TId, TFilter = any>(
    {
        tree,
        getId,
        dataSourceState,
        getRowOptions,
        rowOptions,
        handleOnCheck,
        handleOnSelect,
        handleOnFocus,
        isRowChecked,
        isRowChildrenChecked,
        isFlattenSearch,
        getEstimatedChildrenCount,
    }: UseDataRowPropsProps<TItem, TId, TFilter>,
) {
    const treeSnapshot = useMemo(() => tree.snapshot(), [tree]);

    const updateRowOptions = useCallback((row: DataRowProps<TItem, TId>) => {
        const externalRowOptions = (getRowOptions && !row.isLoading)
            ? getRowOptions(row.value, row.index)
            : {};

        const fullRowOptions = { ...rowOptions, ...externalRowOptions };

        const estimatedChildrenCount = getEstimatedChildrenCount(row.id);
        row.isFoldable = false;
        if (!isFlattenSearch && estimatedChildrenCount > 0) {
            row.isFoldable = true;
        }

        const isCheckable = fullRowOptions && fullRowOptions.checkbox && fullRowOptions.checkbox.isVisible && !fullRowOptions.checkbox.isDisabled;
        const isSelectable = fullRowOptions && fullRowOptions.isSelectable;
        if (fullRowOptions != null) {
            const rowValue = row.value;
            Object.assign(row, fullRowOptions);
            row.value = fullRowOptions.value ?? rowValue;
        }
        row.isFocused = dataSourceState.focusedIndex === row.index;
        row.isChecked = isRowChecked(row);
        row.isSelected = dataSourceState.selectedId === row.id;
        row.isCheckable = isCheckable;
        row.onCheck = isCheckable && handleOnCheck;
        row.onSelect = fullRowOptions?.isSelectable && handleOnSelect;
        row.onFocus = (isSelectable || isCheckable || row.isFoldable) && handleOnFocus;
        row.isChildrenChecked = isRowChildrenChecked(row);

        return row;
    }, [
        getRowOptions,
        rowOptions,
        isFlattenSearch,
        getEstimatedChildrenCount,
        dataSourceState.focusedIndex,
        dataSourceState.selectedId,
        isRowChecked,
        isRowChildrenChecked,
        handleOnCheck,
        handleOnSelect,
        handleOnFocus,
    ]);

    const getRowProps = useCallback((item: TItem, index: number): DataRowProps<TItem, TId> => {
        const id = getId(item);
        const key = idToKey(id);
        const path = treeSnapshot.getPathById(id);
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

        return {
            ...emptyRowProps,
            checkbox,
            isUnknown: true,
        };
    }, [getEmptyRowProps, rowOptions]);

    return useMemo(
        () => ({ getRowProps, getEmptyRowProps, getLoadingRowProps, getUnknownRowProps, updateRowOptions }),
        [getRowProps, getEmptyRowProps, getLoadingRowProps, getUnknownRowProps, updateRowOptions],
    );
}
