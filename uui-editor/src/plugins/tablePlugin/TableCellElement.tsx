import React from 'react';
import { PlateElement, PlateElementProps, TElement, useElement, usePlateEditorRef } from '@udecode/plate-common';
import {
    ELEMENT_TABLE,
    ELEMENT_TR,
    TTableElement,
    TTableRowElement,
    TableCellElementResizable,
    getTableCellBorders,
    getTableRowIndex,
    useTableCellElement,
    useTableStore,
} from '@udecode/plate-table';
import cx from 'classnames';
import css from './TableCell.module.scss';
import { ExtendedTTableCellElement } from './types';
import { useReadOnly } from 'slate-react';

export interface TableCellElementProps extends PlateElementProps {
    hideBorder?: boolean;
    isHeader?: boolean;
}

const isFirstCell = (colIndex: number, cellNode: TElement) => {
    const cellColSpan = (cellNode.colSpan as number);
    const isFirstMergedCell = colIndex + 1 === cellColSpan;
    return colIndex === 0 || isFirstMergedCell;
};

const TableCellElement = React.forwardRef<
    React.ElementRef<typeof PlateElement>,
    TableCellElementProps
>(({ className, ...props }, ref) => {
    const { children, hideBorder, ...rootProps } = props;

    const editor = usePlateEditorRef();
    const cellElement = useElement<ExtendedTTableCellElement>();
    const rowIndex = getTableRowIndex(editor, cellElement);
    const readOnly = useReadOnly();

    const [selectedCells] = useTableStore().use.selectedCells();
    const selected = React.useMemo(() => !!selectedCells?.includes(cellElement), [
        cellElement,
        selectedCells,
    ]);

    const rowSizeOverrides = useTableStore().get.rowSizeOverrides();
    const rowElement = useElement<TTableRowElement>(ELEMENT_TR);
    const rowSize = rowSizeOverrides.get(rowIndex) ?? rowElement?.size ?? undefined;

    // TODO: move to plate
    const colIndex = cellElement.colIndex;
    const tableElement = useElement<TTableElement>(ELEMENT_TABLE);

    const isFirstRow = tableElement.children[0] === rowElement;

    const firstCell = isFirstCell(colIndex, cellElement)
    const borders = getTableCellBorders(cellElement, {
        isFirstCell: firstCell,
        isFirstRow,
    });

    const hoveredColIndex = useTableStore().get.hoveredColIndex();

    const hovered = hoveredColIndex === colIndex;
    const hoveredLeft = firstCell && hoveredColIndex === -1;

    const { props: cellProps } = useTableCellElement({ element: props.element });

    const isHeader = cellElement.type === 'table_header_cell';
    const Cell = isHeader ? 'th' : 'td';

    return (
        <PlateElement
            asChild
            ref={ ref }
            className={
                cx(
                    css.tableCellWrapper,
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

