import * as React from "react";
import isEqual from 'lodash.isequal';
import { DataColumnProps, DataRowProps, FlexRowProps, DataTableCellProps, uuiMod, DndActorRenderParams, DndActor } from '@epam/uui';
import { DataTableRowContainer } from "./DataTableRowContainer";

const uuiDataTableRow = {
    uuiTableRow: 'uui-table-row',
};

export interface DataTableRowProps<TItem, TId> extends DataRowProps<TItem, TId> {
    renderCell?: (props: DataTableCellProps<TItem, TId>) => React.ReactNode;
    renderDropMarkers?: (props: DndActorRenderParams) => React.ReactNode;
}

export class DataTableRow<TItem, TId> extends React.Component<DataTableRowProps<TItem, TId>> {

    shouldComponentUpdate(nextProps: DataRowProps<TItem, TId> & FlexRowProps) {
        const eq = isEqual(this.props, nextProps);
        return !eq;
    }

    renderCell = (columnProps: DataColumnProps<TItem, TId>, idx: number) => {
        const renderCellCallback = columnProps.renderCell || this.props.renderCell;
        return renderCellCallback && renderCellCallback({ column: columnProps, rowProps: this.props, index: idx });
    }

    renderCellContent(columnProps: DataColumnProps<TItem, TId>, rowProps: DataRowProps<TItem, TId>) {
        return columnProps.render(this.props.value, rowProps);
    }

    renderRow(params: Partial<DndActorRenderParams>, clickHandler?: (props: DataRowProps<TItem, TId>) => void, overlays?: React.ReactNode) {
        return (
            <DataTableRowContainer
                scrollManager={ this.props.scrollManager }
                columns={ this.props.columns }
                renderCell={ this.renderCell }
                onClick={ clickHandler && (() => clickHandler(this.props)) }
                rawProps={ params.eventHandlers }
                cx={ [
                    params.classNames,
                    this.props.isSelected && uuiMod.selected,
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
                    render={ params => this.renderRow(
                        params,
                        clickHandler,
                        this.props.renderDropMarkers && this.props.renderDropMarkers(params),
                    ) }
                    { ...this.props.dnd }
                />
            );
        } else {
            return this.renderRow({}, clickHandler);
        }
    }
}
