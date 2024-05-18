import React from 'react';
import cx from 'classnames';
import { PlateElement, PlateElementProps, Value, getPluginType, useEditorRef } from '@udecode/plate-common';
import {
    ELEMENT_TH,
    TTableCellElement,
    useTableCellElement, useTableCellElementResizable, useTableCellElementResizableState, useTableCellElementState,
} from '@udecode/plate-table';

import css from './TableCell.module.scss';
import { ResizeHandle } from '../../implementation/Resizable';

export interface TableCellElementProps
    extends PlateElementProps<Value, TTableCellElement> {
    hideBorder?: boolean;
    isHeader?: boolean;
}

const TableCellElement = React.forwardRef<
React.ElementRef<typeof PlateElement>,
TableCellElementProps
>(({ children, className, style, hideBorder, ...props }, ref) => {
    const editor = useEditorRef();

    const {
        colIndex,
        rowIndex,
        readOnly,
        selected,
        hovered,
        hoveredLeft,
        rowSize,
        borders,
        isSelectingCell,
        colSpan,
    } = useTableCellElementState();
    const { props: cellProps } = useTableCellElement({ element: props.element });
    const resizableState = useTableCellElementResizableState({
        colIndex,
        rowIndex,
        colSpan,
    });
    const { rightProps, bottomProps, leftProps, hiddenLeft } = useTableCellElementResizable(resizableState);
    const isHeader = props.element.type === getPluginType(editor, ELEMENT_TH);
    const Cell = isHeader ? 'th' : 'td';

    return (
        <PlateElement
            asChild
            ref={ ref }
            className={
                cx(
                    css.tableCellWrapper,
                    isHeader && css.headerCell,
                    hideBorder && css.hideBorder,
                    !hideBorder && cx(
                        isHeader && css.textLeft,
                        selected && css.selected,
                        borders && cx(
                            borders.bottom?.size && css.borderBottom,
                            borders.right?.size && css.borderRight,
                            borders.left?.size && css.borderLeft,
                            borders.top?.size && css.borderTop,
                        ),
                    ),
                    className,
                )
            }
            { ...props }
            { ...cellProps }
            style={
                {
                    '--cellBackground': props.element.background,
                    ...style,
                } as React.CSSProperties
            }
        >
            <Cell>
                <div className={ css.cell } style={ { minHeight: rowSize } }>
                    { children }
                </div>

                {!isSelectingCell && (
                    <div
                        className={ css.resizableWrapper }
                        contentEditable={ false }
                    >
                        {!readOnly && (
                            <>
                                <ResizeHandle
                                    { ...rightProps }
                                    className={ css.resizeHolderRight }
                                />
                                <ResizeHandle
                                    { ...bottomProps }
                                    className={ css.resizeHolderBottom }
                                />
                                {!hiddenLeft && (
                                    <ResizeHandle
                                        { ...leftProps }
                                        className={ css.resizeHolderLeft }
                                    />
                                )}

                                {hovered && (
                                    <div
                                        className={ cx(css.resizeHandleRight) }
                                    />
                                )}
                                {hoveredLeft && (
                                    <div
                                        className={ cx(css.resizeHandleLeft) }
                                    />
                                )}
                            </>
                        )}
                    </div>
                ) }
            </Cell>
        </PlateElement>
    );
});
TableCellElement.displayName = 'TableCellElement';

const TableCellHeaderElement = React.forwardRef<
React.ElementRef<typeof TableCellElement>,
TableCellElementProps
>((props, ref) => {
    return <TableCellElement ref={ ref } { ...props } isHeader />;
});
TableCellHeaderElement.displayName = 'TableCellHeaderElement';

export { TableCellElement, TableCellHeaderElement };
