import React from 'react';
import { PlateElement, PlateElementProps, TElement, useElement, usePlateEditorRef } from '@udecode/plate-common';
import { ELEMENT_TABLE, ELEMENT_TR, TTableElement, TTableRowElement, getTableCellBorders, getTableRowIndex, useIsCellSelected, useTableStore } from '@udecode/plate-table';
import cx from 'classnames';
import css from './TableCell.module.scss';
import { ExtendedTTableCellElement } from './types';
import { TableCellElementResizable } from './resize/TableCellResizable';
import { useReadOnly } from 'slate-react';

export interface TableCellElementProps extends PlateElementProps {
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
>(({ className, ...props }, ref) => {
    const { children, hideBorder, ...rootProps } = props;
    const editor = usePlateEditorRef();
    const cellElement = useElement<ExtendedTTableCellElement>();

    /**
     * Apply valid spans to element
     */
    const attrColSpan = isNaN(cellElement.attributes?.colspan) ? 1 : Number(cellElement.attributes?.colspan);
    const attrRowSpan = isNaN(cellElement.attributes?.rowspan) ? 1 : Number(cellElement.attributes?.rowspan);
    const appliedSpans = {
        colSpan: cellElement?.data?.colSpan ?? attrColSpan,
        rowSpan: cellElement?.data?.rowSpan ?? attrRowSpan,
    };
    cellElement.colSpan = appliedSpans.colSpan;
    cellElement.rowSpan = appliedSpans.rowSpan;

    // TODO: move to plate
    const colIndex = cellElement.colIndex;
    // const colIndex = getTableColumnIndex(editor, cellElement);
    const rowIndex = getTableRowIndex(editor, cellElement);

    const readOnly = useReadOnly();

    const isCellSelected = useIsCellSelected(cellElement);
    const hoveredColIndex = useTableStore().get.hoveredColIndex();

    const tableElement = useElement<TTableElement>(ELEMENT_TABLE);
    const rowElement = useElement<TTableRowElement>(ELEMENT_TR);
    const rowSizeOverrides = useTableStore().get.rowSizeOverrides();
    const rowSize = rowSizeOverrides.get(rowIndex) ?? rowElement?.size ?? undefined;

    // const isFirstCell = colIndex === 0;
    const isFirstRow = tableElement.children?.[0] === rowElement;

    const borders = getTableCellBorders(cellElement, {
        isFirstCell: checkIsFirstCell(colIndex, cellElement),
        isFirstRow,
    });

    const selected = isCellSelected;
    const hovered = hoveredColIndex === colIndex;
    const hoveredLeft = checkIsFirstCell(colIndex, cellElement) && hoveredColIndex === -1;

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
                            borders.top?.size && css.borderTop,
                        ),
                    ),
                    className,
                )
            }
            { ...rootProps }
        >
            <Cell colSpan={ cellElement.colSpan } rowSpan={ cellElement.rowSpan }>
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
                        <div className={ cx(css.resizeHandleLeft) } />
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
