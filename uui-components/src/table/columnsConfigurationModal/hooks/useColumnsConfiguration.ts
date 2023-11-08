import { useCallback, useMemo, useState } from 'react';
import { ColumnsConfig, DataColumnProps, DropParams, applyColumnsConfig } from '@epam/uui-core';
import {
    moveColumnRelativeToAnotherColumn, toggleSingleColumnPin, toggleAllColumnsVisibility, toggleSingleColumnVisibility,
} from '../columnsConfigurationActions';
import { canAcceptDrop, isColumnAlwaysPinned } from '../columnsConfigurationUtils';
import { DndDataType, GroupedDataColumnProps, ColumnsConfigurationRowProps } from '../types';
import { groupAndFilterSortedColumns, sortColumnsAndAddGroupKey } from '../columnsConfigurationUtils';

interface UseColumnsConfigurationProps<TItem, TId, TFilter> {
    initialColumnsConfig: ColumnsConfig;
    defaultConfig: ColumnsConfig;
    columns: DataColumnProps<TItem, TId, TFilter>[];
    getSearchFields?: (column: DataColumnProps<TItem, TId, TFilter>) => string[];
}

export function useColumnsConfiguration(props: UseColumnsConfigurationProps<any, any, any>) {
    const { initialColumnsConfig, defaultConfig, columns } = props;
    const [searchValue, setSearchValue] = useState<string>();
    const isDndAllowed = !searchValue;
    const [columnsConfig, setColumnsConfig] = useState<ColumnsConfig>(() => initialColumnsConfig || defaultConfig);
    const _updatedColumns = useMemo(() => applyColumnsConfig(columns, columnsConfig), [columnsConfig]);
    const columnsSorted: GroupedDataColumnProps[] = useMemo(
        () => sortColumnsAndAddGroupKey({ columns: _updatedColumns, prevConfig: columnsConfig }),
        [_updatedColumns, columnsConfig],
    );

    const toggleVisibility = useCallback(
        (columnKey: string) => setColumnsConfig((prevConfig) => toggleSingleColumnVisibility({ prevConfig, columnsSorted, columnKey })),
        [columnsSorted],
    );

    const togglePin = useCallback(
        (columnKey: string) => setColumnsConfig((prevConfig) => toggleSingleColumnPin({ prevConfig, columnsSorted, columnKey })),
        [columnsSorted],
    );

    const reset = useCallback(() => {
        setColumnsConfig(defaultConfig);
        setSearchValue('');
    }, [defaultConfig]);

    const checkAll = useCallback(
        () => setColumnsConfig((prevConfig) => toggleAllColumnsVisibility({ prevConfig, columns: columnsSorted, value: true })),
        [columnsSorted],
    );

    const uncheckAll = useCallback(
        () => setColumnsConfig((prevConfig) => toggleAllColumnsVisibility({ prevConfig, columns: columnsSorted, value: false })),
        [columnsSorted],
    );

    const sortedColumnsExtended = useMemo(
        () =>
            columnsSorted.map((column: DataColumnProps, index): ColumnsConfigurationRowProps => {
                const columnConfig = columnsConfig[column.key];
                const prevColumn = columnsConfig[columnsSorted[index - 1]?.key];
                const nextColumn = columnsConfig[columnsSorted[index + 1]?.key];
                const handleDrop = (params: DropParams<DndDataType, DndDataType>) => {
                    const { srcData, position } = params;
                    // NOTE: srcData - is the column which we are dropping.
                    setColumnsConfig((prevConfig) => {
                        const columnNew = moveColumnRelativeToAnotherColumn({
                            columnConfig: srcData.columnConfig,
                            targetColumn: columnConfig,
                            targetNextColumn: nextColumn,
                            targetPrevColumn: prevColumn,
                            position,
                        });
                        return {
                            ...prevConfig,
                            [srcData.column.key]: columnNew,
                        };
                    });
                };
                const isPinnedAlways = isColumnAlwaysPinned(column);
                const isPinned = !!(columnConfig.fix || isPinnedAlways);
                return {
                    ...column,
                    columnConfig,
                    isDndAllowed,
                    isPinnedAlways,
                    isPinned,
                    togglePin: () => togglePin(column.key),
                    toggleVisibility: () => toggleVisibility(column.key),
                    onCanAcceptDrop: canAcceptDrop,
                    onDrop: handleDrop,
                };
            }),
        [
            columnsSorted, columnsConfig, isDndAllowed, togglePin, toggleVisibility,
        ],
    );

    const groupedColumns = useMemo(
        () =>
            groupAndFilterSortedColumns({
                sortedColumns: sortedColumnsExtended,
                searchValue,
                getSearchFields: (column) => props.getSearchFields ? props.getSearchFields(column) : [column.caption as string],
            }),
        [sortedColumnsExtended, searchValue, props.getSearchFields],
    );

    return {
        // props
        groupedColumns,
        searchValue,
        columnsConfig,
        // methods
        reset,
        checkAll,
        uncheckAll,
        setSearchValue,
    };
}
