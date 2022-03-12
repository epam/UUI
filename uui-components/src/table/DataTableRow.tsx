import React, { ReactNode, Component } from "react";
import isEqual from 'lodash.isequal';
import { DataColumnProps, DataRowProps, FlexRowProps, DataTableCellProps, uuiMod, DndActorRenderParams, DndActor, uuiMarkers, DataTableRowProps } from '@epam/uui-core';
import { DataTableRowContainer } from "./DataTableRowContainer";

const uuiDataTableRow = {
    uuiTableRow: 'uui-table-row',
} as const;

export class DataTableRow<TItem, TId> extends Component<DataTableRowProps<TItem, TId>> {
    shouldComponentUpdate(nextProps: DataRowProps<TItem, TId> & FlexRowProps) {
        return !isEqual(this.props, nextProps);
    }

    renderCell = (columnProps: DataColumnProps<TItem, TId>, idx: number) => {
        const renderCellCallback = columnProps.renderCell || this.props.renderCell;
        return renderCellCallback?.({ column: columnProps, rowProps: this.props, index: idx, role: 'cell' });
    }

    renderCellContent(columnProps: DataColumnProps<TItem, TId>, rowProps: DataRowProps<TItem, TId>) {
        return columnProps.render(this.props.value, rowProps);
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
