import { useCallback, useMemo, useState } from "react";
import { ColumnsConfig, DataColumnProps, DropParams, IModal } from "@epam/uui-core";
import sortBy from "lodash.sortby";
import {
    moveColumnRelativeToAnotherColumn, toggleSingleColumnPin, toggleAllColumnsVisibility, toggleSingleColumnVisibility,
} from "../services/columnsActionsService";
import {
    canAcceptDrop, isColumnAlwaysPinned, isColumnFilteredOut,
} from "../services/columnsPropertiesService";
import { DndDataType, IManageableColumn } from "../types";
import { groupSortedColumns } from "../services/columnsGroupService";

export { IManageableColumn } ;

interface IColumnConfigMgmt<TItem, TId, TFilter> {
    columnsConfig: ColumnsConfig;
    defaultConfig: ColumnsConfig;
    columns: DataColumnProps<TItem, TId, TFilter>[];
    modalProps: IModal<ColumnsConfig>;
}

export function useColumnsConfigurationState<TItem, TId, TFilter>(props: IColumnConfigMgmt<TItem, TId, TFilter>) {
    const { modalProps, columnsConfig, defaultConfig } = props;
    const [filterValue, setFilterValue] = useState<string>();
    const isDndAllowed = !filterValue;
    const [columnsConfigLocal, setColumnsConfig] = useState<ColumnsConfig>(() => columnsConfig);
    const columnsSorted = useMemo(
        () => sortBy(props.columns, i => columnsConfigLocal[i.key].order),
        [props.columns, columnsConfigLocal],
    );

    const isNoData = useMemo(() => {
        return columnsSorted.every(c => isColumnFilteredOut(c, filterValue));
    }, [columnsSorted, filterValue]);

    const moveColumn = useCallback((prevConfig: ColumnsConfig, columnKey: string, targetColumnKey: string, isAfterTarget: boolean): ColumnsConfig =>
        moveColumnRelativeToAnotherColumn({ prevConfig, columnsSorted, isAfterTarget, targetColumnKey, columnKey }),
        [columnsSorted]);

    const toggleVisibility = useCallback((columnKey: string) =>
        setColumnsConfig(prevConfig => toggleSingleColumnVisibility({ prevConfig, columnsSorted, columnKey })),
        [columnsSorted]);

    const togglePin = useCallback((columnKey: string) =>
        setColumnsConfig(prevConfig => toggleSingleColumnPin({ prevConfig, columnsSorted, columnKey })),
        [columnsSorted]);

    const reset = useCallback(() => {
        setColumnsConfig(defaultConfig);
        setFilterValue('');
    }, [defaultConfig]);

    const checkAll = useCallback(
        () => setColumnsConfig(prevConfig => toggleAllColumnsVisibility({ prevConfig, columns: columnsSorted, isToggleOn: true })),
        [columnsSorted],
    );

    const uncheckAll = useCallback(
        () => setColumnsConfig(prevConfig => toggleAllColumnsVisibility({ prevConfig, columns: columnsSorted, isToggleOn: false })),
        [columnsSorted],
    );

    const apply = useCallback(() => modalProps.success(columnsConfigLocal), [columnsConfigLocal, modalProps]);

    const extendColumn = useCallback((column: DataColumnProps<TItem, TId>): IManageableColumn => {
        const columnConfig = columnsConfigLocal[column.key];
        const handleDrop = (params: DropParams<DndDataType, DndDataType>) => {
            const { srcData, position } = params;
            setColumnsConfig(prevConfig => {
                return moveColumn(prevConfig, srcData.column.key, column.key, position === 'bottom');
            });
        };
        const isPinnedAlways = isColumnAlwaysPinned({ columnConfig, column });
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
    const byGroup = groupSortedColumns(sortedColumnsExtended, filterValue);

    return {
        // props
        byGroup, isNoData, filterValue, columnsConfigLocal,
        // methods
        reset, apply, checkAll, uncheckAll, setFilterValue,
    };
}
