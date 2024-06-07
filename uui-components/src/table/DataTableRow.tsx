import React, { useCallback } from 'react';
import isEqual from 'react-fast-compare';
import {
    DataColumnProps, DataRowProps, uuiMod, DndActorRenderParams, DndActor, uuiMarkers, DataTableRowProps, Lens, IEditable,
    AcceptDropParams,
    DropPosition,
    IDndActor,
    ILens,
    DataRowDropPosition,
    DropPositionOptions,
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
    // };
    // compareDeep(props, nextProps);

    return isDeepEqual;
}

function renderCell<TItem, TId>(props: DataTableRowProps<TItem, TId>, rowLens: ILens<TItem>, column: DataColumnProps<TItem, TId>, idx: number) {
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
}

const noDropOptions: DropPositionOptions = { top: false, bottom: false };

const DataTableRowImpl = React.forwardRef(function DataTableRow<TItem, TId>(props: DataTableRowProps<TItem, TId>, ref: React.ForwardedRef<HTMLDivElement>) {
    const rowLens = Lens.onEditable(props as IEditable<TItem>);

    const renderRow = (
        dndParams?: DndActorRenderParams<DataRowDropPosition>,
        clickHandler?: (props: DataRowProps<TItem, TId>) => void,
    ) => {
        const style: React.CSSProperties = {};
        let rowProps = props;
        let overlays = null;

        if (dndParams != null) {
            if (dndParams.isDragGhost) {
                const indent = dndParams.depth + 1;
                const verticalInset = '-3px';
                const leftInset = (18 + indent * 24) + 'px';
                style.clipPath = `inset(${verticalInset} 0 ${verticalInset} ${leftInset}`;
                rowProps = {
                    ...rowProps,
                    depth: dndParams.depth,
                    indent,
                };
            } else {
                overlays = props.renderDropMarkers?.(dndParams);
            }
        }

        return (
            <DataTableRowContainer
                columns={ props.columns }
                ref={ dndParams.ref || ref }
                renderCell={ (column, idx) => renderCell(rowProps, rowLens, column, idx) }
                onClick={ clickHandler && (() => clickHandler(props)) }
                rawProps={ {
                    ...props.rawProps,
                    ...dndParams.eventHandlers,
                    role: 'row',
                    'aria-expanded': (props.isFolded === undefined || props.isFolded === null) ? undefined : !props.isFolded,
                    ...(props.isSelectable && { 'aria-selected': props.isSelected }),
                    style,
                } }
                cx={ [
                    dndParams.classNames,
                    props.isSelected && uuiMod.selected,
                    dndParams.isDraggable && uuiMarkers.draggable,
                    dndParams.isDndInProgress && uuiDndState.dndInProgress,
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

    const getRowDropPosition = useCallback((params: AcceptDropParams<any, any>) => {
        const positionOptions = props.dnd?.canAcceptDrop(params) ?? noDropOptions;

        // Y Offset of the middle of drag ghost, relative to the destination top.
        const offset = params.offsetTop - params.srcOffsetTop + params.srcHeight / 2;

        const position: DropPosition = offset > (params.targetHeight / 2) ? 'bottom' : 'top';

        if (!positionOptions[position]) {
            return null;
        }

        // const depthDelta = Math.round(params.mouseDx / 32);
        let depth = props.depth; // + depthDelta;

        const maxDepth = props.depth + 1;
        const minDepth = 0; // Math.max(0, props.depth - );
        depth = Math.min(depth, maxDepth);
        depth = Math.max(minDepth, depth);

        return { position, depth } as DataRowDropPosition;
    }, [props.dnd?.canAcceptDrop]);

    let dndProps: IDndActor<any, any, DataRowDropPosition> = null;

    if (props.dnd) {
        dndProps = {
            ...props.dnd,
            canAcceptDrop: null,
            getDropPosition: getRowDropPosition,
        };
    }

    if (props.dnd && (props.dnd.srcData || props.dnd.canAcceptDrop)) {
        return (
            <DndActor<any, any, DataRowDropPosition>
                { ...dndProps }
                render={ (params) => renderRow(params, clickHandler) }
            />
        );
    } else {
        return renderRow(null, clickHandler);
    }
});

export const DataTableRow = React.memo(DataTableRowImpl, compareProps);
