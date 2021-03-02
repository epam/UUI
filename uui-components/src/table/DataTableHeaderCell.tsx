import React, {createRef} from 'react';
import {AcceptDropParams, DataColumnProps, DndActor, DataTableHeaderCellProps, DndActorRenderParams, isClickableChildClicked} from "@epam/uui";
import { findDOMNode } from "react-dom";

interface DataTableRenderProps {
    renderCellContent: (props: HeaderCellContentProps) => React.ReactElement;
}

export interface HeaderCellContentProps extends DndActorRenderParams {
    onResizeStart: (e: React.MouseEvent) => void;
    onResizeEnd: (e: React.MouseEvent) => void;
    onResize: (e: MouseEvent) => void;
    toggleSort: (e: React.MouseEvent) => void;
}

interface DataTableHeaderCellState {
    isResizing: boolean;
}

export abstract class DataTableHeaderCell<TItem, TId>  extends React.Component<DataTableHeaderCellProps<TItem, TId> & DataTableRenderProps, DataTableHeaderCellState> {
    state: DataTableHeaderCellState = {
        isResizing: false,
    };

    cellRef = createRef<any>();

    toggleSort = (e: React.MouseEvent) => {
        !isClickableChildClicked(e) && this.props.column.isSortable && this.props.onSort(this.props.sortDirection === 'asc' ? 'desc' : 'asc');
    }

    canAcceptDrop(params: AcceptDropParams<DataColumnProps<any>, DataColumnProps<any>>) {
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
        e.stopPropagation(); // to prevent dnd handlers while resizing
    }

    onResizeEnd = () => {
        this.setState({ isResizing: false });

        document.removeEventListener('mousemove', this.onResize);
        document.removeEventListener('mouseup', this.onResizeEnd);
    }

    onResize = (e: MouseEvent) => {
        if (this.state.isResizing) {
            const columnsConfig = { ...this.props.value.columnsConfig };

            const cellNode: HTMLElement = findDOMNode(this.cellRef.current) as any;
            const cellRect = cellNode.getBoundingClientRect();

            const newWidth = e.clientX - cellRect.left;

            if (newWidth < this.props.column.minWidth) {
                columnsConfig[this.props.column.key] = { ...columnsConfig[this.props.column.key], width: this.props.column.minWidth  };
            } else {
                columnsConfig[this.props.column.key] = { ...columnsConfig[this.props.column.key], width: newWidth  };
            }

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
                    ref={ this.cellRef }
                />
            );
        } else {
            return this.renderCellContent();
        }
    }
}