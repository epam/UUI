import * as React from "react";
import { useCallback, useMemo, useState } from "react";
import {
    AcceptDropParams,
    ColumnsConfig,
    DataColumnProps,
    DndActor,
    DndActorRenderParams,
    DropParams,
    IColumnConfig,
    IModal,
} from "@epam/uui-core";
import { getColGroupByColumnKey, isVisibleColGroup, useGroupedColumns } from "./useGroupedColumns";
import sortBy from "lodash.sortby";

export enum ColGroup {
    HIDDEN = 'HIDDEN',
    DISPLAYED_PINNED = 'DISPLAYED_PINNED',
    DISPLAYED_UNPINNED = 'DISPLAYED_UNPINNED',
}

interface IColumnConfigMgmt<TItem, TId, TFilter> {
    columnsConfig: ColumnsConfig;
    defaultConfig: ColumnsConfig;
    columns: DataColumnProps<TItem, TId, TFilter>[];
    modalProps: IModal<ColumnsConfig>;
    renderDndRowMarkup: (dndActorParams: DndActorRenderParams, column: DataColumnProps, isDndAllowed: boolean) => React.ReactNode;
}

interface IDndActorData<TItem, TId> {
    column: DataColumnProps<TItem, TId>;
    cfg: IColumnConfig;
}

export function isColumnAlwaysPinned<TItem, TId>(props: IDndActorData<TItem, TId>) {
    const isPinned = Boolean(props.cfg.fix);
    return props.column.isAlwaysVisible && isPinned;
}

function canAcceptDrop<TItem, TId>(props: AcceptDropParams<IDndActorData<TItem, TId>, IDndActorData<TItem, TId>>) {
    const {
        srcData,
        dstData,
    } = props;

    const isMovingToUnpinnedArea = !dstData.cfg.fix;
    const isMovingToHiddenArea = !dstData.cfg.isVisible;

    const disallowDnd = isColumnAlwaysPinned(srcData) && isMovingToUnpinnedArea ||
        srcData.column.isAlwaysVisible && isMovingToHiddenArea;

    if (disallowDnd) {
        return {};
    }

    return { top: true, bottom: true };
}

function toggleColumnsVisibility(prevConfig: ColumnsConfig, columns: DataColumnProps[], isToggleOn: boolean) {
    return Object.keys(prevConfig).reduce<ColumnsConfig>((acc, key) => {
        const prevCfg = prevConfig[key];
        const isAlreadyToggled = isToggleOn ? prevCfg.isVisible : !prevCfg.isVisible;
        const tryingToHideAlwaysVisible = !isToggleOn && columns.find(c => c.key === key).isAlwaysVisible;
        const noChangeRequired = isAlreadyToggled || tryingToHideAlwaysVisible;
        if (noChangeRequired) {
            acc[key] = prevCfg;
        } else {
            acc[key] = {
                ...prevCfg,
                isVisible: isToggleOn,
                fix: undefined,
            };
        }
        return acc;
    }, {});
}

export function useColumnsConfigurationState<TItem, TId, TFilter>(props: IColumnConfigMgmt<TItem, TId, TFilter>) {
    const {
        modalProps,
        columnsConfig,
        defaultConfig,
        renderDndRowMarkup,
    } = props;
    const [filterValue, setFilterValue] = useState<string>();
    const [columnsConfigLocal, setColumnsConfig] = useState<ColumnsConfig>(() => columnsConfig);
    const columnsSorted = useMemo(() => sortBy(props.columns, i => columnsConfigLocal[i.key].order), [props.columns, columnsConfigLocal]);

    const { byGroup, moveColumn, moveColumnToGroup } = useGroupedColumns({
        config: columnsConfigLocal,
        columnsSorted,
        filter: filterValue,
    });
    const isDndAllowed = !filterValue;
    const isNoData = useMemo(() => Object.values(byGroup).every(i => !i.itemsFiltered?.length), [byGroup]);
    const toggleVisibility = useCallback((key: string) => {
        setColumnsConfig(prevConfig => {
            const from = getColGroupByColumnKey(key, prevConfig);
            let to;
            let toPosition: 'start' | 'end';
            if (isVisibleColGroup(from)) {
                to = ColGroup.HIDDEN;
                toPosition = 'start';
            } else {
                to = ColGroup.DISPLAYED_UNPINNED;
                toPosition = 'end';
            }
            return moveColumnToGroup(prevConfig, key, to, toPosition);
        });
    }, [moveColumnToGroup]);

    const togglePin = useCallback((key: string) => {
        setColumnsConfig(prevConfig => {
            const cfg = prevConfig[key];
            const prevFix = cfg.fix;

            let to;
            let toPosition: 'start' | 'end';
            if (prevFix) {
                to = ColGroup.DISPLAYED_UNPINNED;
                toPosition = 'start';
            } else {
                to = ColGroup.DISPLAYED_PINNED;
                toPosition = 'end';
            }
            return moveColumnToGroup(prevConfig, key, to, toPosition);
        });
    }, [moveColumnToGroup]);

    const reset = useCallback(() => {
        setColumnsConfig(defaultConfig);
        setFilterValue('');
    }, [defaultConfig]);
    const close = useCallback(() => {
        modalProps.abort();
    }, [modalProps]);
    const checkAll = useCallback(
        () => setColumnsConfig(prevConfig => toggleColumnsVisibility(prevConfig, columnsSorted, true)),
        [columnsSorted],
    );
    const uncheckAll = useCallback(
        () => setColumnsConfig(prevConfig => toggleColumnsVisibility(prevConfig, columnsSorted, false)),
        [columnsSorted],
    );
    const apply = useCallback(() => {
        modalProps.success(columnsConfigLocal);
    }, [columnsConfigLocal, modalProps]);

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

        return (
            <DndActor<IDndActorData<TItem, TId>, IDndActorData<TItem, TId>>
                key={ column.key }
                srcData={ srcData }
                dstData={ dstData }
                canAcceptDrop={ canAcceptDrop }
                onDrop={ handleDrop }
                render={ props => renderDndRowMarkup(props, column, isDndAllowed) }
            />
        );
    };

    const renderRows = (colGroup: ColGroup) => {
        const items = byGroup[colGroup]?.itemsFiltered || [];
        return items.map(item => renderDndRow(item));
    };

    return {
        toggleVisibility,
        togglePin,
        byGroup,
        columnsConfigLocal,
        renderRows,
        reset,
        close,
        apply,
        filterValue,
        setFilterValue,
        uncheckAll,
        checkAll,
        isNoData,
    };
}
