import * as React from "react";
import { useCallback, useMemo, useState } from "react";
import {
    ColumnsConfig, DataColumnProps, DndActor,
    DndActorRenderParams, DropParams, IModal,
} from "@epam/uui-core";
import sortBy from "lodash.sortby";
import {
    moveColumnRelativeToAnotherColumn, togglePinOfAColumn, toggleColumnsVisibility, toggleVisibilityOfAColumn,
} from "../services/columnsActionsService";
import {
    canAcceptDrop, getColGroupByColumnKey,  isColumnAlwaysPinned, isColumnVisible,
} from "../services/columnsPropertiesService";
import {
    ColGroup, IDndActorData,
} from "../services/types";
import { useGroupedItems } from "./useGroupedItems";

export  { ColGroup } from "../services/types";

interface IColumnConfigMgmt<TItem, TId, TFilter> {
    columnsConfig: ColumnsConfig;
    defaultConfig: ColumnsConfig;
    columns: DataColumnProps<TItem, TId, TFilter>[];
    modalProps: IModal<ColumnsConfig>;
    renderRowContent: (props: { dndActorParams: DndActorRenderParams, column: DataColumnProps, isDndAllowed: boolean, isPinnedAlways: boolean }) => React.ReactNode;
}

export function useColumnsConfigurationState<TItem, TId, TFilter>(props: IColumnConfigMgmt<TItem, TId, TFilter>) {
    const { modalProps, columnsConfig, defaultConfig, renderRowContent } = props;
    const [filterValue, setFilterValue] = useState<string>();
    const isDndAllowed = !filterValue;
    const [columnsConfigLocal, setColumnsConfig] = useState<ColumnsConfig>(() => columnsConfig);

    const columnsSorted = useMemo(() => sortBy(props.columns, i => columnsConfigLocal[i.key].order), [props.columns, columnsConfigLocal]);

    const onGetGroup = useCallback((column: DataColumnProps) => getColGroupByColumnKey(column.key, columnsConfigLocal), [columnsConfigLocal]);
    const onFilter = useCallback((column: DataColumnProps) => isColumnVisible(column, filterValue), [filterValue]);
    const { byGroup } = useGroupedItems({ items: columnsSorted, onFilter, onGetGroup });
    const isNoData = useMemo(() => Object.values(byGroup).every(i => !i.itemsFiltered?.length), [byGroup]);

    const moveColumn = useCallback((prevConfig: ColumnsConfig, columnKey: string, targetColumnKey: string, isAfterTarget: boolean): ColumnsConfig =>
        moveColumnRelativeToAnotherColumn({ prevConfig, columnsSorted, isAfterTarget, targetColumnKey, columnKey }),
        [columnsSorted]);

    const toggleVisibility = useCallback((columnKey: string) =>
        setColumnsConfig(prevConfig => toggleVisibilityOfAColumn({ prevConfig, byGroup, columnsSorted, columnKey })),
        [columnsSorted, byGroup]);

    const togglePin = useCallback((columnKey: string) =>
        setColumnsConfig(prevConfig => togglePinOfAColumn({ prevConfig, byGroup, columnsSorted, columnKey })),
        [columnsSorted, byGroup]);

    const reset = useCallback(() => {
        setColumnsConfig(defaultConfig);
        setFilterValue('');
    }, [defaultConfig]);

    const close = useCallback(() =>  modalProps.abort(), [modalProps]);

    const checkAll = useCallback(
        () => setColumnsConfig(prevConfig => toggleColumnsVisibility({ prevConfig, columns: columnsSorted, isToggleOn: true })),
        [columnsSorted],
    );

    const uncheckAll = useCallback(
        () => setColumnsConfig(prevConfig => toggleColumnsVisibility({ prevConfig, columns: columnsSorted, isToggleOn: false })),
        [columnsSorted],
    );

    const apply = useCallback(() => modalProps.success(columnsConfigLocal), [columnsConfigLocal, modalProps]);

    const renderDndRow = (
        column: DataColumnProps<TItem, TId>,
    ) => {
        const cfg = columnsConfigLocal[column.key];
        const srcData = { column, cfg };
        const dstData = srcData;

        const handleDrop = (params: DropParams<IDndActorData<TItem, TId>, IDndActorData<TItem, TId>>) => {
            const columnKey = params.srcData.column.key;
            const isAfterTarget = params.position === 'bottom';
            const targetColumnKey = column.key;
            setColumnsConfig(prevConfig => {
                return moveColumn(prevConfig, columnKey, targetColumnKey, isAfterTarget);
            });
        };
        const isPinnedAlways = isColumnAlwaysPinned({ cfg, column });
        return (
            <DndActor<IDndActorData<TItem, TId>, IDndActorData<TItem, TId>>
                key={ column.key }
                srcData={ srcData }
                dstData={ dstData }
                canAcceptDrop={ canAcceptDrop }
                onDrop={ handleDrop }
                render={ dndActorParams => renderRowContent({ dndActorParams, column, isDndAllowed, isPinnedAlways }) }
            />
        );
    };

    const renderRows = (colGroup: ColGroup) => {
        const items = byGroup[colGroup]?.itemsFiltered || [];
        return items.map(item => renderDndRow(item));
    };

    return {
        // props
        byGroup, isNoData, filterValue, columnsConfigLocal,
        // methods
        reset, close, apply, checkAll, togglePin, renderRows, uncheckAll, setFilterValue, toggleVisibility,
    };
}
