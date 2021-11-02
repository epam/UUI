import React, { createRef, ReactElement, PropsWithRef, Component } from 'react';
import { AcceptDropParams, DataColumnProps, DndActor, DataTableHeaderCellProps, DndActorRenderParams, isClickableChildClicked } from "@epam/uui";

interface DataTableRenderProps {
    renderCellContent: (props: HeaderCellContentProps) => ReactElement;
}

export interface HeaderCellContentProps extends DndActorRenderParams, PropsWithRef<any> {
    onResizeStart: (e: React.MouseEvent) => void;
    onResizeEnd: (e: React.MouseEvent) => void;
    onResize: (e: MouseEvent) => void;
    toggleSort: (e: React.MouseEvent) => void;
}

interface DataTableHeaderCellState {
    isResizing: boolean;
}

export abstract class DataTableHeaderCell<TItem, TId> extends Component<DataTableHeaderCellProps<TItem, TId> & DataTableRenderProps, DataTableHeaderCellState> {
    state: DataTableHeaderCellState = {
        isResizing: false,
    };

    cellRef = createRef<HTMLElement>();

    toggleSort = (e: React.MouseEvent) => {
        if (isClickableChildClicked(e)) return;
        this.props.column.isSortable && this.props.onSort(this.props.sortDirection === 'asc' ? 'desc' : 'asc');
    }

    canAcceptDrop(params: AcceptDropParams<DataColumnProps<TItem, TId>, DataColumnProps<TItem, TId>>) {
        if (!params.dstData.fix) {
            return {
                left: true,
                right: true,
            };
        }
    }

    onResizeStart = (e: React.MouseEvent) => {
        this.setState({ isResizing: true });

        document.addEventListener('mousemove', this.onResize);
        document.addEventListener('mouseup', this.onResizeEnd);

        e.preventDefault();
        e.stopPropagation(); // to prevent column sorting/dnd/ect. handlers while resizing
    }

    onResizeEnd = () => {
        this.setState({ isResizing: false });

        document.removeEventListener('mousemove', this.onResize);
        document.removeEventListener('mouseup', this.onResizeEnd);
    }

    onResize = (e: MouseEvent) => {
        if (this.state.isResizing) {
            const { columnsConfig } = this.props.value;
            const cellRect = this.cellRef.current.getBoundingClientRect();
            const newWidth = e.clientX - cellRect.left;

            columnsConfig[this.props.column.key] = {
                ...columnsConfig[this.props.column.key],
                width: (newWidth < this.props.column.minWidth) ? this.props.column.minWidth : newWidth
            };

            this.props.onValueChange({ ...this.props.value, columnsConfig });

            e.preventDefault();
        }
    }

    renderCellContent = (dndProps?: DndActorRenderParams) => {
        return this.props.renderCellContent({
            onResize: this.onResize,
            onResizeEnd: this.onResizeEnd,
            onResizeStart: this.onResizeStart,
            toggleSort: this.toggleSort,
            ref: this.cellRef,
            ...dndProps,
        });
    }


    render() {
        if (this.props.allowColumnsReordering) {
            return (
                <DndActor
                    dstData={ this.props.column }
                    srcData={ this.props.column.fix ? null : this.props.column }
                    canAcceptDrop={ this.canAcceptDrop }
                    onDrop={ this.props.onDrop }
                    render={ this.renderCellContent }
                />
            );
        } else return this.renderCellContent();
    }
}