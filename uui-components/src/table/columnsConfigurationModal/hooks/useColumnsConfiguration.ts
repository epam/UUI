import { useCallback, useMemo, useState } from "react";
import { ColumnsConfig, DataColumnProps, DropParams, DropPosition, IModal } from "@epam/uui-core";
import sortBy from "lodash.sortby";
import {
    moveColumnRelativeToAnotherColumn, toggleSingleColumnPin, toggleAllColumnsVisibility, toggleSingleColumnVisibility,
} from "../columnsActions";
import {
    canAcceptDrop, isColumnAlwaysPinned,
} from "../columnsProperties";
import { DndDataType, IManageableColumn } from "../types";
import { groupSortedColumns } from "../columnsGroupService";

export { IManageableColumn } ;

interface UseColumnsConfigurationProps<TItem, TId, TFilter> {
    columnsConfig: ColumnsConfig;
    defaultConfig: ColumnsConfig;
    columns: DataColumnProps<TItem, TId, TFilter>[];
    modalProps: IModal<ColumnsConfig>;
}

export function useColumnsConfiguration<TItem, TId, TFilter>(props: UseColumnsConfigurationProps<TItem, TId, TFilter>) {
    const { modalProps, columnsConfig, defaultConfig } = props;
    const [searchValue, setSearchValue] = useState<string>();
    const isDndAllowed = !searchValue;
    const [columnsConfigLocal, setColumnsConfig] = useState<ColumnsConfig>(() => columnsConfig);
    const columnsSorted = useMemo(
        () => sortBy(props.columns, i => columnsConfigLocal[i.key].order),
        [props.columns, columnsConfigLocal],
    );

    const moveColumn = useCallback((prevConfig: ColumnsConfig, columnKey: string, targetColumnKey: string, position: DropPosition): ColumnsConfig =>
        moveColumnRelativeToAnotherColumn({ prevConfig, columnsSorted, position, targetColumnKey, columnKey }),
        [columnsSorted]);

    const toggleVisibility = useCallback((columnKey: string) =>
        setColumnsConfig(prevConfig => toggleSingleColumnVisibility({ prevConfig, columnsSorted, columnKey })),
        [columnsSorted]);

    const togglePin = useCallback((columnKey: string) =>
        setColumnsConfig(prevConfig => toggleSingleColumnPin({ prevConfig, columnsSorted, columnKey })),
        [columnsSorted]);

    const reset = useCallback(() => {
        setColumnsConfig(defaultConfig);
        setSearchValue('');
    }, [defaultConfig]);

    const checkAll = useCallback(
        () => setColumnsConfig(prevConfig => toggleAllColumnsVisibility({ prevConfig, columns: columnsSorted, value: true })),
        [columnsSorted],
    );

    const uncheckAll = useCallback(
        () => setColumnsConfig(prevConfig => toggleAllColumnsVisibility({ prevConfig, columns: columnsSorted, value: false })),
        [columnsSorted],
    );

    const apply = useCallback(() => modalProps.success(columnsConfigLocal), [columnsConfigLocal, modalProps]);

    const extendColumn = useCallback((column: DataColumnProps<TItem, TId>): IManageableColumn => {
        const columnConfig = columnsConfigLocal[column.key];
        const handleDrop = (params: DropParams<DndDataType, DndDataType>) => {
            const { srcData, position } = params;
            setColumnsConfig(prevConfig => {
                return moveColumn(prevConfig, srcData.column.key, column.key, position);
            });
        };
        const isPinnedAlways = isColumnAlwaysPinned(column);
        return {
            ...column,
            columnConfig, isDndAllowed, isPinnedAlways,
            togglePin: () => togglePin(column.key),
            toggleVisibility: () => toggleVisibility(column.key),
            onCanAcceptDrop: canAcceptDrop,
            onDrop: handleDrop,
        };
    }, [columnsConfigLocal, isDndAllowed, moveColumn, togglePin, toggleVisibility]);
    const sortedColumnsExtended = useMemo(() => columnsSorted.map(extendColumn), [columnsSorted, extendColumn]);
    const groupedColumns = groupSortedColumns(sortedColumnsExtended, searchValue);

    return {
        // props
        groupedColumns, searchValue, columnsConfigLocal,
        // methods
        reset, apply, checkAll, uncheckAll, setSearchValue,
    };
}
