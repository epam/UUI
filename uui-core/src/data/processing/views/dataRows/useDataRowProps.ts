import { useCallback, useMemo } from 'react';
import { DataRowOptions, DataRowPathItem, DataRowProps, DataSourceState } from '../../../../types';
import { CheckingService, FocusService, SelectingService } from '../tree/hooks/services';
import { ITree } from '../tree';
import { idToKey } from '../helpers';

export interface UseDataRowPropsProps<TItem, TId, TFilter = any> extends Omit<CheckingService<TItem, TId>, 'clearAllChecked' | 'handleSelectAll'>,
    FocusService,
    SelectingService<TItem, TId> {

    getId: (item: TItem) => TId;
    tree: ITree<TItem, TId>;
    dataSourceState: DataSourceState<TFilter, TId>;
    rowOptions?: DataRowOptions<TItem, TId>;
    getRowOptions?(item: TItem, index?: number): DataRowOptions<TItem, TId>;
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
    const applyRowOptions = useCallback((row: DataRowProps<TItem, TId>) => {
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
    }, [
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
    ]);

    const getRowProps = useCallback((item: TItem, index: number): DataRowProps<TItem, TId> => {
        const id = getId(item);
        const key = idToKey(id);
        const path = tree.getPathById(id);
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

        applyRowOptions(rowProps);

        return rowProps;
    }, [getId, tree, applyRowOptions]);

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
        () => ({ getRowProps, getEmptyRowProps, getLoadingRowProps, getUnknownRowProps }),
        [getRowProps, getEmptyRowProps, getLoadingRowProps, getUnknownRowProps],
    );
}
