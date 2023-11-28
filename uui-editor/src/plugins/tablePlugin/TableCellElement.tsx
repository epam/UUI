import React from 'react';
import cx from 'classnames';
import { useReadOnly } from 'slate-react';
import { PlateElement, PlateElementProps, TElement, useElement, useEditorRef, Value } from '@udecode/plate-common';
import {
    ELEMENT_TABLE, ELEMENT_TR, TTableCellElement, TTableElement, TTableRowElement, getTableCellBorders,
    getTableRowIndex, useIsCellSelected, useTableCellElement, useTableCellElementResizable, useTableCellElementResizableState, useTableCellElementState, useTableStore,
} from '@udecode/plate-table';
import { ExtendedTTableCellElement } from './types';

import css from './TableCell.module.scss';
import { ResizeHandle } from '../../implementation/Resizable';

// export interface TableCellElementProps extends PlateElementProps {
//     hideBorder?: boolean;
//     isHeader?: boolean;
// }

export interface TableCellElementProps
    extends PlateElementProps<Value, TTableCellElement> {
    hideBorder?: boolean;
    isHeader?: boolean;
}

const checkIsFirstCell = (colIndex: number, cellNode: TElement) => {
    const cellColSpan = (cellNode.colSpan as number);
    const isFirstMergedCell = colIndex + 1 === cellColSpan;
    return colIndex === 0 || isFirstMergedCell;
};

const TableCellElement = React.forwardRef<
React.ElementRef<typeof PlateElement>,
TableCellElementProps
>(({ children, className, style, hideBorder, isHeader, ...props }, ref) => {
    const { element } = props;

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

    console.log('cell', props.element.children.map((item) => (item.children as any)[0].text), 'indices', rowIndex, colIndex);
    // console.log('rightProps', rightProps);
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
            // { ...rootProps }
            style={
                {
                    '--cellBackground': element.background,
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
                                    // visible={ hovered }
                                    // className="-top-3 right-[-5px] w-[10px]"
                                    className={ css.resizeHolderRight }
                                />
                                <ResizeHandle
                                    { ...bottomProps }
                                    // className="bottom-[-5px] h-[10px]"
                                    className={ css.resizeHolderBottom }
                                />
                                {!hiddenLeft && (
                                    <ResizeHandle
                                        { ...leftProps }
                                        // className="-top-3 left-[-5px] w-[10px]"
                                        className={ css.resizeHolderLeft }
                                    />
                                )}

                                {hovered && (
                                    <div
                                        // className={ cn(
                                        //     'absolute -top-3 z-30 h-[calc(100%_+_12px)] w-1 bg-ring',
                                        //     'right-[-1.5px]',
                                        // ) }
                                        className={ cx(css.resizeHandleRight) }
                                    />
                                )}
                                {hoveredLeft && (
                                    <div
                                        // className={ cn(
                                        //     'absolute -top-3 z-30 h-[calc(100%_+_12px)] w-1 bg-ring',
                                        //     'left-[-1.5px]',
                                        // ) }
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
