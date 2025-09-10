import { useCallback, useMemo, useState } from 'react';
import { ColumnsConfig, DataColumnGroupProps, DataColumnProps, DropParams } from '@epam/uui-core';
import {
    moveColumnRelativeToAnotherColumn, toggleSingleColumnPin, toggleAllColumnsVisibility, toggleSingleColumnVisibility,
} from '../columnsConfigurationActions';
import {
    canAcceptDrop,
    isColumnAlwaysHiddenInTheConfigurationModal,
    isColumnLocked,
} from '../columnsConfigurationUtils';
import { DndDataType, GroupedDataColumnProps, ColumnsConfigurationRowProps, TColumnPinPosition } from '../types';
import { groupAndFilterSortedColumns, sortColumnsAndAddGroupKey } from '../columnsConfigurationUtils';

interface UseColumnsConfigurationProps<TItem, TId, TFilter> {
    initialColumnsConfig: ColumnsConfig;
    defaultConfig: ColumnsConfig;
    columns: DataColumnProps<TItem, TId, TFilter>[];
    getSearchFields?: (column: DataColumnProps<TItem, TId, TFilter>) => string[];
    columnGroups?: DataColumnGroupProps[];
}

export function useColumnsConfiguration(props: UseColumnsConfigurationProps<any, any, any>) {
    const { initialColumnsConfig, defaultConfig, columns } = props;
    const [searchValue, setSearchValue] = useState<string>();
    const isDndAllowed = !searchValue;
    const [columnsConfig, setColumnsConfig] = useState<ColumnsConfig>(() => initialColumnsConfig || defaultConfig);
    const columnsSorted: GroupedDataColumnProps[] = useMemo(() => sortColumnsAndAddGroupKey({ columns, prevConfig: columnsConfig }), [columns, columnsConfig]);

    const toggleVisibility = useCallback(
        (columnKey: string) => setColumnsConfig((prevConfig) => toggleSingleColumnVisibility({ prevConfig, columnsSorted, columnKey })),
        [columnsSorted],
    );

    const togglePin = useCallback(
        (columnKey: string, fix: TColumnPinPosition) => setColumnsConfig((prevConfig) => toggleSingleColumnPin({ prevConfig, columnsSorted, columnKey, fix })),
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

    const groupsByKey = useMemo(() => {
        const res: Record<string, DataColumnGroupProps> = {};
        (props.columnGroups || []).forEach((g) => { res[g.key] = g; });
        return res;
    }, [props.columnGroups]);

    const sortedColumnsExtended = useMemo(
        () =>
            columnsSorted.map((column: DataColumnProps, index): ColumnsConfigurationRowProps => {
                const columnConfig = columnsConfig[column.key];
                const columnGroup = column.group ? groupsByKey[column.group] : undefined;
                const nextColumn = columnsSorted[index + 1];
                const prevColumn = columnsSorted[index - 1];
                const prevColumnConfig = columnsConfig[prevColumn?.key];
                const nextColumnConfig = columnsConfig[nextColumn?.key];
                const handleDrop = (params: DropParams<DndDataType, DndDataType>) => {
                    const { srcData, position } = params;
                    // NOTE: srcData - is the column which we are dropping.
                    setColumnsConfig((prevConfig) => {
                        const columnNew = moveColumnRelativeToAnotherColumn({
                            columnConfig: srcData.columnConfig,
                            targetColumn: columnConfig,
                            targetNextColumn: nextColumnConfig,
                            targetPrevColumn: prevColumnConfig,
                            position,
                        });
                        return {
                            ...prevConfig,
                            [srcData.column.key]: columnNew,
                        };
                    });
                };
                const isPinnedAlways = isColumnLocked(column);
                const fix = columnConfig.fix || (isPinnedAlways ? 'left' : undefined);
                return {
                    ...column,
                    columnGroup,
                    columnConfig,
                    isDndAllowed: isDndAllowed && !isPinnedAlways,
                    isPinnedAlways,
                    fix,
                    togglePin: (_fix: TColumnPinPosition) => togglePin(column.key, _fix),
                    toggleVisibility: () => toggleVisibility(column.key),
                    onCanAcceptDrop: (props) => canAcceptDrop(props, nextColumn, prevColumn),
                    onDrop: handleDrop,
                };
            }),
        [
            columnsSorted, columnsConfig, isDndAllowed, togglePin, toggleVisibility, groupsByKey,
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

    const hasAnySelectedColumns = useMemo(() => !!columnsSorted.filter((c) => {
        if (c.groupKey !== 'hidden') {
            return !isColumnAlwaysHiddenInTheConfigurationModal(c);
        }
        return false;
    }).length, [columnsSorted]);

    return {
        // props
        groupedColumns,
        searchValue,
        columnsConfig,
        hasAnySelectedColumns,
        // methods
        reset,
        checkAll,
        uncheckAll,
        setSearchValue,
    };
}
