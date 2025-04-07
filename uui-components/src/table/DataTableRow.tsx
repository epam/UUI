import React, { ReactNode } from 'react';
import isEqual from 'react-fast-compare';
import {
    DataColumnProps, DataRowProps, uuiMod, DndActorRenderParams, DndActor, uuiMarkers, DataTableRowProps, Lens, IEditable,
    DndEventHandlers,
} from '@epam/uui-core';
import { DataTableRowContainer } from './DataTableRowContainer';

const uuiDataTableRow = {
    uuiTableRow: 'uui-table-row',
} as const;

function compareProps(props: any, nextProps: any) {
    const isDeepEqual = isEqual(props, nextProps);

    // Debug code to find props differences. Please don't remove, and keep commented out
    // //
    // const shallowDiffKeys = [];
    // const compareDeep = (left: any, right: any, prefix = "") => {
    //     if (prefix.length > 1000) {
    //         return; // cyclic references?
    //     } else if (left && right) {
    //         const keys = Object.keys({ ...left, ...right });
    //         keys.forEach(key => {
    //             if (left[key] !== right[key]) {
    //                 shallowDiffKeys.push({ path: prefix + key, left: left[key], right: right[key] });
    //                 compareDeep(left[key], right[key], prefix + key + '.');
    //             }
    //         });
    //     } else {
    //         shallowDiffKeys.push({ path: prefix, left: left, right: right });
    //     }
    // }
    // compareDeep(this.props, nextProps);
    return isDeepEqual;
}

const DataTableRowImpl = function DataTableRow<TItem, TId>(props: DataTableRowProps<TItem, TId> & React.RefAttributes<HTMLDivElement>) {
    const rowLens = Lens.onEditable(props as IEditable<TItem>);

    const renderCell = (column: DataColumnProps<TItem, TId>, idx: number, eventHandlers?: DndEventHandlers) => {
        const renderCellCallback = column.renderCell || props.renderCell;
        const isFirstColumn = idx === 0;
        const isLastColumn = !props.columns || idx === props.columns.length - 1;
        return renderCellCallback?.({
            key: column.key,
            column,
            rowProps: props,
            index: idx,
            isFirstColumn,
            isLastColumn,
            rowLens,
            eventHandlers,
        });
    };

    const renderRow = (params: Partial<DndActorRenderParams>, clickHandler?: (props: DataRowProps<TItem, TId>) => void, overlays?: ReactNode) => {
        return (
            <DataTableRowContainer
                columns={ props.columns }
                ref={ params.ref || props.ref }
                renderCell={ renderCell }
                onClick={ clickHandler && (() => clickHandler(props)) }
                rawProps={ {
                    ...props.rawProps,
                    ...params.eventHandlers,
                    role: 'row',
                    'aria-expanded': (props.isFolded === undefined || props.isFolded === null) ? undefined : !props.isFolded,
                    ...(props.isSelectable && { 'aria-selected': props.isSelected }),
                } }
                cx={ [
                    params.classNames,
                    props.isSelected && uuiMod.selected,
                    params.isDraggable && uuiMarkers.draggable,
                    props.isInvalid && uuiMod.invalid,
                    uuiDataTableRow.uuiTableRow,
                    props.cx,
                    props.isFocused && uuiMod.focus,
                ] }
                overlays={ overlays }
                link={ props.link }
            />
        );
    };

    const clickHandler = props.onClick || props.onSelect || props.onFold || props.onCheck;

    if (props.dnd && (props.dnd.srcData || props.dnd.canAcceptDrop)) {
        return <DndActor { ...props.dnd } render={ (params) => renderRow(params, clickHandler, props.renderDropMarkers?.(params)) } />;
    } else {
        return renderRow({}, clickHandler);
    }
};

export const DataTableRow = React.memo(DataTableRowImpl, compareProps);
