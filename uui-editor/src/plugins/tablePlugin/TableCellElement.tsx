import React, { useEffect, useRef, useState } from 'react';
import { PlateElement, PlateElementProps, TElement, findNodePath, useElement, usePlateEditorRef } from '@udecode/plate-common';
import { ELEMENT_TABLE, ELEMENT_TR, TTableCellElement, TTableElement, TTableRowElement, getTableCellBorders, getTableColumnIndex, getTableRowIndex, useIsCellSelected, useTableStore } from '@udecode/plate-table';
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

export function getCellFromTarget(node: Node): Node | null {
    let currentNode: ParentNode | Node | null = node;

    while (currentNode != null) {
        const nodeName = currentNode.nodeName;

        if (nodeName === 'TD' || nodeName === 'TH') {
            return currentNode;
        }

        currentNode = currentNode.parentNode;
    }

    return null;
}

const TableCellElement = React.forwardRef<
React.ElementRef<typeof PlateElement>,
TableCellElementProps
>(({ className, ...props }, ref) => {
    const { children, hideBorder, ...rootProps } = props;
    const editor = usePlateEditorRef();
    const cellElement = useElement<ExtendedTTableCellElement>();
    const cellRef = useRef<HTMLTableDataCellElement>();

    /**
     * Apply valid spans to element
     */
    // const attrColSpan = isNaN(cellElement.attributes?.colspan) ? 1 : Number(cellElement.attributes?.colspan);
    // const attrRowSpan = isNaN(cellElement.attributes?.rowspan) ? 1 : Number(cellElement.attributes?.rowspan);
    // const appliedSpans = {
    //     colSpan: cellElement?.data?.colSpan ?? attrColSpan,
    //     rowSpan: cellElement?.data?.rowSpan ?? attrRowSpan,
    // };
    cellElement.colSpan = cellElement.colSpan || 1;
    cellElement.rowSpan = cellElement.rowSpan || 1;

    // TODO: move to plate
    // const colIndex = cellElement.colIndex;
    // let colIndex = getTableColumnIndex(editor, cellElement);
    const rowIndex = getTableRowIndex(editor, cellElement) + cellElement.rowSpan - 1;

    const readOnly = useReadOnly();

    const isCellSelected = useIsCellSelected(cellElement);
    const hoveredColIndex = useTableStore().get.hoveredColIndex();

    const tableElement = useElement<TTableElement>(ELEMENT_TABLE);
    const rowElement = useElement<TTableRowElement>(ELEMENT_TR);
    const rowSizeOverrides = useTableStore().get.rowSizeOverrides();
    const rowSize = rowSizeOverrides.get(rowIndex) ?? rowElement?.size ?? undefined;

    // const isFirstCell = colIndex === 0;
    const isFirstRow = tableElement.children?.[0] === rowElement;

    const isHeader = cellElement.type === 'table_header_cell';
    const Cell = isHeader ? 'th' : 'td';

    const colSizes = tableElement.colSizes;
    // const currentColSizes = element.colSizes.map((size, index) => colSizeOverrides?.get(index) || size || EMPTY_COL_WIDTH);

    const content = cellElement.children
        .map((node) => (node as TTableCellElement).children[0].text)
        .join(' ');

    const cIndex = useRef<number>(0);
    const path = findNodePath(editor, cellElement);
    const pathString = path.join();
    const prevPathStringRef = useRef<string>();

    // if (pathString !== prevPathStringRef.current) {
    //     prevPathStringRef.current = pathString;
    //     console.log('path changed', prevPathStringRef.current, content);
    // }

    if (cellRef.current && hoveredColIndex === null && pathString !== prevPathStringRef.current) {
        prevPathStringRef.current = pathString;
        // console.log('path changed', prevPathStringRef.current, content);

        const cellOffset = cellRef.current?.offsetLeft;
        const cellWidth = cellRef.current?.offsetWidth;

        const { offsets } = colSizes.reduce((acc, current) => {
            const currentOffset = acc.prevOffset + current;

            acc.offsets.push(currentOffset);
            acc.prevOffset = currentOffset;

            return acc;
        }, {
            offsets: [],
            prevOffset: 0,
        });

        const startColIndex = offsets.findIndex((current) => current === cellOffset + cellWidth);
        // const colIndex = cellElement.colSpan - 1 + startColIndex;
        // const colIndex = startColIndex;

        if (startColIndex !== -1) {
            cellElement.colIndex = startColIndex;
            cIndex.current = startColIndex;
        }

        console.log(
            'content',
            content,
            // 'cellRef.current',
            // cellRef.current,
            // 'offset',
            // cellOffset,
            'colIndex',
            cIndex.current,
            // 'cellElement.colSpan',
            // cellElement.colSpan,
            // 'cIndex.current',
            // cIndex.current,
            'hoveredColIndex',
            hoveredColIndex,
            // 'cellWidth',
            // cellWidth,
            // 'offsets',
            // offsets,
            // 'startColIndex',
            // startColIndex,
            // 'colSpan',
            // cellElement.colSpan,

            // colSizes,
        );
    }

    console.log('hoveredColIndex', hoveredColIndex);

    const borders = getTableCellBorders(cellElement, {
        isFirstCell: checkIsFirstCell(cIndex.current, cellElement),
        isFirstRow,
    });

    const selected = isCellSelected;
    const hovered = hoveredColIndex === cIndex.current;
    // const hoveredLeft = checkIsFirstCell(colIndex, cellElement) && hoveredColIndex === -1;

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
            <Cell colSpan={ cellElement.colSpan } rowSpan={ cellElement.rowSpan } ref={ cellRef }>
                <div className={ css.cell } style={ { minHeight: rowSize } }>
                    { children }
                </div>

                {cellRef.current && (
                    <div
                        className={ css.resizableWrapper }
                        contentEditable={ false }
                    >
                        <TableCellElementResizable
                            colIndex={ cIndex.current }
                            rowIndex={ rowIndex }
                            readOnly={ readOnly }
                        />

                        { !readOnly && hovered && (
                            <div className={ cx(css.resizeHandleRight) } />
                        ) }

                        {/* { !readOnly && hoveredLeft && (
                        <div className={ cx(css.resizeHandleLeft) } />
                    ) } */}
                    </div>
                )}
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
