import { useCallback, useMemo, useState } from "react";
import { ColumnsConfig, DataColumnProps, DropParams } from "@epam/uui-core";
import {
    moveColumnRelativeToAnotherColumn, toggleSingleColumnPin, toggleAllColumnsVisibility, toggleSingleColumnVisibility,
} from "../columnsConfigurationActions";
import {
    canAcceptDrop, isColumnAlwaysPinned,
} from "../columnsConfigurationUtils";
import { DndDataType, GroupedDataColumnProps, ColumnsConfigurationRowProps } from "../types";
import { groupAndFilterSortedColumns, sortColumnsAndAddGroupKey } from "../columnsConfigurationUtils";

export { ColumnsConfigurationRowProps } ;

interface UseColumnsConfigurationProps {
    columnsConfig?: ColumnsConfig;
    defaultConfig: ColumnsConfig;
    columns: DataColumnProps[];
}

export function useColumnsConfiguration(props: UseColumnsConfigurationProps) {
    const { columnsConfig, defaultConfig, columns } = props;
    const [searchValue, setSearchValue] = useState<string>();
    const isDndAllowed = !searchValue;
    const [columnsConfigUnsaved, setColumnsConfigUnsaved] = useState<ColumnsConfig>(() => columnsConfig || defaultConfig);
    const columnsSorted: GroupedDataColumnProps[] = useMemo(
        () => sortColumnsAndAddGroupKey({ columns, prevConfig: columnsConfigUnsaved }),
        [columns, columnsConfigUnsaved],
    );

    const toggleVisibility = useCallback((columnKey: string) =>
        setColumnsConfigUnsaved(prevConfig => toggleSingleColumnVisibility({ prevConfig, columnsSorted, columnKey })),
        [columnsSorted]);

    const togglePin = useCallback((columnKey: string) =>
        setColumnsConfigUnsaved(prevConfig => toggleSingleColumnPin({ prevConfig, columnsSorted, columnKey })),
        [columnsSorted]);

    const reset = useCallback(() => {
        setColumnsConfigUnsaved(defaultConfig);
        setSearchValue('');
    }, [defaultConfig]);

    const checkAll = useCallback(
        () => setColumnsConfigUnsaved(prevConfig => toggleAllColumnsVisibility({ prevConfig, columns: columnsSorted, value: true })),
        [columnsSorted],
    );

    const uncheckAll = useCallback(
        () => setColumnsConfigUnsaved(prevConfig => toggleAllColumnsVisibility({ prevConfig, columns: columnsSorted, value: false })),
        [columnsSorted],
    );

    const sortedColumnsExtended = useMemo(() => columnsSorted.map(
        (column: DataColumnProps, index): ColumnsConfigurationRowProps => {
            const columnConfig = columnsConfigUnsaved[column.key];
            const prevColumn = columnsConfigUnsaved[columnsSorted[index - 1]?.key];
            const nextColumn = columnsConfigUnsaved[columnsSorted[index + 1]?.key];
            const handleDrop = (params: DropParams<DndDataType, DndDataType>) => {
                const { srcData, position } = params;
                // NOTE: srcData - is the column which we are dropping.
                setColumnsConfigUnsaved(prevConfig => {
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
            return {
                ...column, columnConfig, isDndAllowed, isPinnedAlways,
                togglePin: () => togglePin(column.key),
                toggleVisibility: () => toggleVisibility(column.key),
                onCanAcceptDrop: canAcceptDrop,
                onDrop: handleDrop,
            };
        },
    ), [columnsSorted, columnsConfigUnsaved, isDndAllowed, togglePin, toggleVisibility]);

    const groupedColumns = useMemo(
        () => groupAndFilterSortedColumns(sortedColumnsExtended, searchValue),
        [sortedColumnsExtended, searchValue]);

    return {
        // props
        groupedColumns, searchValue, columnsConfigUnsaved,
        // methods
        reset, checkAll, uncheckAll, setSearchValue,
    };
}
