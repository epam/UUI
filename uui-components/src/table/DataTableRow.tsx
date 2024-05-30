import React, { ReactNode } from 'react';
import isEqual from 'react-fast-compare';
import {
    DataColumnProps, DataRowProps, uuiMod, DndActorRenderParams, DndActor, uuiMarkers, DataTableRowProps, Lens, IEditable,
    uuiDndState,
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

const DataTableRowImpl = React.forwardRef(function DataTableRow<TItem, TId>(props: DataTableRowProps<TItem, TId>, ref: React.ForwardedRef<HTMLDivElement>) {
    const rowLens = Lens.onEditable(props as IEditable<TItem>);

    const renderCell = (column: DataColumnProps<TItem, TId>, idx: number) => {
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
        });
    };

    const renderCellPlaceholder = (column: DataColumnProps<TItem, TId>, idx: number, moveInside?: boolean) => {
        const renderCellCallback = column.renderCell || props.renderCell;
        const isFirstColumn = idx === 0;
        const isLastColumn = !props.columns || idx === props.columns.length - 1;
        const rowPlaceholderProps = {
            ...props,
            value: { name: 'Placeholder' } as TItem,
            indent: moveInside ? props.indent + 1 : props.indent,
            depth: moveInside ? props.depth + 1 : props.depth,
            isFoldable: false,
            isFolded: false,
            isFocused: false,
        };

        const rowLensPlaceholder = Lens.onEditable(rowPlaceholderProps as IEditable<TItem>);

        return renderCellCallback?.({
            key: column.key,
            column,
            rowProps: rowPlaceholderProps,
            index: idx,
            isFirstColumn,
            isLastColumn,
            rowLens: rowLensPlaceholder,
        });
    };

    const renderRow = (
        params: Partial<DndActorRenderParams>,
        clickHandler?: (props: DataRowProps<TItem, TId>) => void,
        overlays?: ReactNode,
        placeholder?: ReactNode,
    ) => {
        return (
            <div>
                { params.position === 'top' && placeholder }
                <DataTableRowContainer
                    columns={ props.columns }
                    ref={ params.ref || ref }
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
                { (params.position === 'bottom' || params.position === 'inside') && placeholder }
            </div>
        );
    };

    const renderDragGhost = (params: Partial<DndActorRenderParams>, clickHandler?: (props: DataRowProps<TItem, TId>) => void, overlays?: ReactNode) => {
        return (
            <DataTableRowContainer
                columns={ [props.columns[0]] }
                ref={ params.ref || ref }
                renderCell={ renderCell }
                onClick={ clickHandler && (() => clickHandler(props)) }
                rawProps={ {
                    ...props.rawProps,
                    ...params.eventHandlers,
                    role: 'row',
                    'aria-expanded': (props.isFolded === undefined || props.isFolded === null) ? undefined : !props.isFolded,
                    ...(props.isSelectable && { 'aria-selected': props.isSelected }),
                    style: {
                        width: props.columns[0].width,
                        minWidth: props.columns[0].minWidth ?? props.columns[0].width,
                    },
                } }
                cx={ [
                    params.classNames,
                    props.isSelected && uuiMod.selected,
                    params.isDraggable && uuiMarkers.draggable,
                    uuiDndState.dragGhost,
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
    const renderPlaceholder = (params: Partial<DndActorRenderParams>) => {
        return (
            <DataTableRowContainer
                columns={ [props.columns[0]] }
                ref={ params.ref || ref }
                renderCell={ (props, idx) => renderCellPlaceholder(props, idx, params.position === 'inside') }
                rawProps={ {
                    ...props.rawProps,
                    ...params.eventHandlers,
                    role: 'row',
                } }
                cx={ [
                    params.classNames,
                    uuiDataTableRow.uuiTableRow,
                    props.cx,
                    uuiMod.selected,
                ] }
            />
        );
    };

    const clickHandler = props.onClick || props.onSelect || props.onFold || props.onCheck;

    if (props.dnd && (props.dnd.srcData || props.dnd.canAcceptDrop)) {
        return (
            <DndActor
                { ...props.dnd }
                render={ (params, placeholder) => renderRow(params, clickHandler, props.renderDropMarkers?.(params), placeholder) }
                renderDragGhost={ (params) => renderDragGhost(params, clickHandler, props.renderDropMarkers?.(params)) }
                renderPlaceholder={ (params) => renderPlaceholder(params) }
            />
        );
    } else {
        return renderRow({}, clickHandler);
    }
});

export const DataTableRow = React.memo(DataTableRowImpl, compareProps);
