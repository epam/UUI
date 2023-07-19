import React from 'react';
import { PlateElement, PlateElementProps, useElement } from '@udecode/plate-common';
import { useTableCellElement, useTableCellElementState } from '@udecode/plate-table';
import cx from 'classnames';
import css from './TableCell.module.scss';
import { ExtendedTTableCellElement } from './types';
import { TableCellElementResizable } from './resize/TableCellResizable';

export interface TableCellElementProps extends PlateElementProps {
    hideBorder?: boolean;
    isHeader?: boolean;
}

const TableCellElement = React.forwardRef<
    React.ElementRef<typeof PlateElement>,
    TableCellElementProps
>(({ className, ...props }, ref) => {
    const { children, hideBorder, ...rootProps } = props;
    const {
        colIndex,
        rowIndex,
        readOnly,
        selected,
        hovered,
        hoveredLeft,
        rowSize,
        borders,
    } = useTableCellElementState();
    const { props: cellProps } = useTableCellElement({ element: props.element });

    const cellElement: ExtendedTTableCellElement = useElement();
    const isHeader = cellElement.type === 'table_header_cell';
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
                            borders.top?.size && css.borderTop
                        ),
                    ),
                    className
                )
            }
            { ...cellProps }
            { ...rootProps }
        >
            <Cell>
                <div className={ css.cell } style={ { minHeight: rowSize } }>
                    { children }
                </div>

                <div
                    className={ css.resizableWrapper }
                    contentEditable={ false }
                >
                    <TableCellElementResizable
                        colIndex={ colIndex }
                        rowIndex={ rowIndex }
                        readOnly={ readOnly }
                    />

                    { !readOnly && hovered && (
                        <div className={ cx(css.resizeHandleRight) } />
                    ) }

                    { !readOnly && hoveredLeft && (
                        <div className={ cx(css.resizeHandleBottom) } />
                    ) }
                </div>
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

