import * as React from 'react';
import {
    AcceptDropParams, DataColumnProps, DndActor, DataTableHeaderCellProps, DndActorRenderParams, isEventTargetInsideClickable, SortDirection,
} from '@epam/uui-core';

interface DataTableRenderProps {
    renderCellContent: (props: HeaderCellContentProps) => React.ReactElement<HeaderCellContentProps>;
}

export interface HeaderCellContentProps extends DndActorRenderParams {
    /** Called when resizing is started */
    onResizeStart: (e: React.MouseEvent) => void;
    /** Called when resizing is ended */
    onResizeEnd: (e: MouseEvent) => void;
    /** Called during the resizing process */
    onResize: (e: MouseEvent) => void;
    /** Called when sorting */
    toggleSort: (e: React.MouseEvent) => void;
    /** Indicates that resizing process is active */
    isResizing: boolean;
}

interface DataTableHeaderCellState {
    isResizing: boolean;
    resizeStartX?: number;
    originalWidth?: number;
}

export class DataTableHeaderCell<TItem, TId> extends React.Component<DataTableHeaderCellProps<TItem, TId> & DataTableRenderProps> {
    state: DataTableHeaderCellState = {
        isResizing: false,
    };

    cellRef = React.createRef<HTMLElement>();
    toggleSort = (e: React.MouseEvent) => {
        if (isEventTargetInsideClickable(e) || !this.props.column.isSortable) return;

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
        this.setState({ isResizing: true, resizeStartX: e.clientX, originalWidth: this.props.column.width });

        document.addEventListener('mousemove', this.onResize);
        document.addEventListener('click', this.onResizeEnd);

        e.preventDefault();
        e.stopPropagation(); // to prevent column sorting/dnd/ect. handlers while resizing
    };

    onResizeEnd = (e: MouseEvent) => {
        this.setState({ isResizing: false });

        document.removeEventListener('mousemove', this.onResize);
        document.removeEventListener('click', this.onResizeEnd);

        e.preventDefault();
        e.stopPropagation(); // to prevent column sorting/dnd/ect. handlers while resizing
    };

    onResize = (e: MouseEvent) => {
        if (this.state.isResizing) {
            const columnsConfig = { ...(this.props.value.columnsConfig || {}) };

            // How much mouse was moved after resize is started
            let widthDelta = e.clientX - this.state.resizeStartX;

            // Right-pinned columns have resize handle at the left, instead of right.
            // So moving left should increase column width, instead of decreasing as usual, and vice versa.
            widthDelta = this.props.column.fix === 'right' ? -widthDelta : widthDelta;

            const newWidth = this.state.originalWidth + widthDelta;
            const defaultMinWidth = this.props.isFirstColumn ? 78 : 54;

            if (newWidth >= (this.props.column.minWidth || defaultMinWidth)) {
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
            isResizing: this.state.isResizing,
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
                    key={ this.props.column.key + (this.props.value.columnsConfig?.[this.props.column.key]?.order || '') }
                    id={ this.props.column.key }
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
