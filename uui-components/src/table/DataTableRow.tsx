import React, { ReactNode, Component } from "react";
import isEqual from 'lodash.isequal';
import { DataColumnProps, DataRowProps, FlexRowProps, DataTableCellProps, uuiMod, DndActorRenderParams, DndActor, uuiMarkers } from '@epam/uui';
import { DataTableRowContainer } from "./DataTableRowContainer";

const uuiDataTableRow = {
    uuiTableRow: 'uui-table-row',
};

export interface DataTableRowProps<TItem, TId> extends DataRowProps<TItem, TId> {
    renderCell?: (props: DataTableCellProps<TItem, TId>) => ReactNode;
    renderDropMarkers?: (props: DndActorRenderParams) => ReactNode;
}

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
            <DataTableRowContainer<TItem, TId>
                scrollManager={ this.props.scrollManager }
                columns={ this.props.columns }
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
                    render={ params => this.renderRow(params, clickHandler, this.props.renderDropMarkers?.(params)) }
                    { ...this.props.dnd }
                />
            );
        } else return this.renderRow({}, clickHandler);
    }
}
