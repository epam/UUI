import React, { ReactNode, Component } from "react";
import isEqual from 'lodash.isequal';
import { DataColumnProps, DataRowProps, FlexRowProps, DataTableCellProps, uuiMod, DndActorRenderParams, DndActor, uuiMarkers, DataTableRowProps } from '@epam/uui-core';
import { DataTableRowContainer } from "./DataTableRowContainer";

const uuiDataTableRow = {
    uuiTableRow: 'uui-table-row',
} as const;

export class DataTableRow<TItem, TId> extends Component<DataTableRowProps<TItem, TId>> {
    shouldComponentUpdate(nextProps: DataRowProps<TItem, TId> & FlexRowProps) {
        const isDeepEqual = isEqual(this.props, nextProps);

        // Debug code to find props differences. Please don't remove, and keep commented out
        //
        // const shallowDiffKeys = [];
        // const compareDeep = (a: any, b: any, prefix = "") => {
        //     const keys = Object.keys({ ...a, ...b });
        //     keys.forEach(key => {
        //         if (a[key] !== b[key]) {
        //             shallowDiffKeys.push(prefix + key);
        //             compareDeep(a[key], b[key], prefix + key + '.');
        //         }
        //     });
        // }
        // compareDeep(this.props, nextProps);

        return !isDeepEqual;
    }

    renderCell = (column: DataColumnProps<TItem, TId>, idx: number) => {
        const renderCellCallback = column.renderCell || this.props.renderCell;
        const isFirstColumn = idx === 0;
        const isLastColumn = !this.props.columns || idx === this.props.columns.length - 1;
        return renderCellCallback?.({
            key: column.key,
            column,
            rowProps: this.props,
            index: idx,
            role: 'cell',
            isFirstColumn,
            isLastColumn
        });
    }

    renderRow(params: Partial<DndActorRenderParams>, clickHandler?: (props: DataRowProps<TItem, TId>) => void, overlays?: ReactNode) {
        return (
            <DataTableRowContainer
                columns={ this.props.columns }
                ref={ params.ref }
                renderCell={ this.renderCell }
                onClick={ clickHandler && (() => clickHandler(this.props)) }
                rawProps={ {
                    ...params.eventHandlers,
                    role: 'row',
                    'aria-expanded': this.props.isFolded == undefined ? undefined : this.props.isFolded,
                    ...(this.props.isSelectable && { 'aria-selected': this.props.isSelected } )
                } }
                cx={ [
                    params.classNames,
                    this.props.isSelected && uuiMod.selected,
                    params.isDraggable && uuiMarkers.draggable,
                    uuiDataTableRow.uuiTableRow,
                    this.props.cx,
                    this.props.isFocused && uuiMod.focus,
                ] }
                overlays={ overlays }
                link={ this.props.link }
            />
        );
    }

    render() {
        const clickHandler = this.props.onClick || this.props.onSelect || this.props.onFold || this.props.onCheck;

        if (this.props.dnd && (this.props.dnd.srcData || this.props.dnd.canAcceptDrop)) {
            return (
                <DndActor
                    { ...this.props.dnd }
                    render={ params => this.renderRow(params, clickHandler, this.props.renderDropMarkers?.(params)) }
                />
            );
        } else return this.renderRow({}, clickHandler);
    }
}
