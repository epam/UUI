import * as React from 'react';
import { AcceptDropParams, DataColumnProps, DndActor, DataTableHeaderCellProps, DndActorRenderParams, isClickableChildClicked, SortDirection } from '@epam/uui-core';

interface DataTableRenderProps {
    renderCellContent: (props: HeaderCellContentProps) => React.ReactElement<HeaderCellContentProps>;
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

export class DataTableHeaderCell<TItem, TId> extends React.Component<DataTableHeaderCellProps<TItem, TId> & DataTableRenderProps> {
    state: DataTableHeaderCellState = {
        isResizing: false,
    };

    cellRef = React.createRef<HTMLElement>();

    toggleSort = (e: React.MouseEvent) => {
        if (isClickableChildClicked(e) || !this.props.column.isSortable) return;

        let dir: SortDirection;
        if (!this.props.sortDirection) dir = 'asc';
        else if (this.props.sortDirection === 'asc') dir = 'desc';
        else if (this.props.sortDirection === 'desc') dir = undefined;
        this.props.onSort(dir);
    };

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
    };

    onResizeEnd = () => {
        this.setState({ isResizing: false });

        document.removeEventListener('mousemove', this.onResize);
        document.removeEventListener('mouseup', this.onResizeEnd);
    };

    onResize = (e: MouseEvent) => {
        if (this.state.isResizing) {
            const columnsConfig = { ...(this.props.value.columnsConfig || {}) };
            const cellRect = this.cellRef.current.getBoundingClientRect();
            const newWidth = e.clientX - cellRect.left;

            if (newWidth >= (this.props.column.minWidth || 24)) {
                columnsConfig[this.props.column.key] = {
                    ...columnsConfig[this.props.column.key],
                    width: newWidth,
                };

                this.props.onValueChange({ ...this.props.value, columnsConfig });
            }

            e.preventDefault();
        }
    };

    renderCellContent = (dndProps?: DndActorRenderParams) => {
        return this.props.renderCellContent({
            onResize: this.onResize,
            onResizeEnd: this.onResizeEnd,
            onResizeStart: this.onResizeStart,
            toggleSort: this.toggleSort,
            ...dndProps,
            ref: (node) => {
                (this.cellRef.current as unknown as React.Ref<HTMLElement>) = node;
                if (!dndProps?.ref) return;
                (dndProps.ref as React.MutableRefObject<HTMLElement>).current = node;
            },
        });
    };

    render() {
        if (this.props.allowColumnsReordering) {
            return (
                <DndActor
                    key={this.props.column.key + (this.props.value.columnsConfig?.[this.props.column.key]?.order || '')}
                    dstData={this.props.column}
                    srcData={this.props.column.fix ? null : this.props.column}
                    canAcceptDrop={this.canAcceptDrop}
                    onDrop={this.props.onDrop}
                    render={this.renderCellContent}
                />
            );
        } else return this.renderCellContent();
    }
}
