import React, { useRef } from 'react';
import { PlateElement, PlateElementProps, useElement, usePlateEditorRef } from '@udecode/plate-common';
import { ELEMENT_TABLE, ELEMENT_TR, TTableCellElement, TTableElement, TTableRowElement, getTableCellBorders, getTableColumnIndex, getTableRowIndex, useIsCellSelected, useTableStore } from '@udecode/plate-table';
import cx from 'classnames';
import css from './TableCell.module.scss';
import { ExtendedTTableCellElement } from './types';
import { TableCellElementResizable } from './resize/TableCellResizable';
import { useReadOnly } from 'slate-react';
import { getClosest } from './utils';

export interface TableCellElementProps extends PlateElementProps {
    hideBorder?: boolean;
    isHeader?: boolean;
}

const TableCellElement = React.forwardRef<
React.ElementRef<typeof PlateElement>,
TableCellElementProps
>(({ className, ...props }, ref) => {
    const { children, hideBorder, ...rootProps } = props;
    const editor = usePlateEditorRef();
    const cellElement = useElement<ExtendedTTableCellElement>();
    const cellRef = useRef<HTMLTableDataCellElement>();

    const attrColSpan = Number(cellElement.attributes?.colspan);
    const attrRowSpan = Number(cellElement.attributes?.rowspan);
    cellElement.colSpan = cellElement.colSpan || attrColSpan || 1;
    cellElement.rowSpan = cellElement.rowSpan || attrRowSpan || 1;

    const rowIndex = getTableRowIndex(editor, cellElement) + cellElement.rowSpan - 1;

    const readOnly = useReadOnly();

    const isCellSelected = useIsCellSelected(cellElement);
    const hoveredColIndex = useTableStore().get.hoveredColIndex();

    const tableElement = useElement<TTableElement>(ELEMENT_TABLE);
    const rowElement = useElement<TTableRowElement>(ELEMENT_TR);
    const rowSizeOverrides = useTableStore().get.rowSizeOverrides();
    const rowSize = rowSizeOverrides.get(rowIndex) ?? rowElement?.size ?? undefined;

    const isFirstRow = tableElement.children?.[0] === rowElement;

    const isHeader = cellElement.type === 'table_header_cell';
    const Cell = isHeader ? 'th' : 'td';

    const colSizes = tableElement.colSizes;

    const endColIndex = useRef<number>(getTableColumnIndex(editor, cellElement));
    const startCIndex = useRef<number>(getTableColumnIndex(editor, cellElement));
    // const path = findNodePath(editor, cellElement);

    if (cellRef.current && hoveredColIndex === null) {
        const cellOffset = cellRef.current?.offsetLeft;

        const { offsets } = colSizes.reduce((acc, current) => {
            const currentOffset = acc.prevOffset + current;
            acc.offsets.push(currentOffset);
            acc.prevOffset = currentOffset;
            return acc;
        }, {
            offsets: [0],
            prevOffset: 0,
        });

        const startColIndex = getClosest(cellOffset, offsets);
        cellElement.colIndex = startColIndex;
        startCIndex.current = startColIndex;
        endColIndex.current = startColIndex + cellElement.colSpan - 1;

        // const content = cellElement.children
        // .map((node) => (node as TTableCellElement).children[0].text)
        // .join(' ');
        // console.log(
        //     'content',
        //     content,
        //     // 'rowIndex',
        //     // rowIndex,
        //     // 'colIndex',
        //     // cIndex.current,
        //     // 'path',
        //     // path,
        //     // 'props.nodeProps',
        //     // props.nodeProps,
        //     // 'cellRef.current',
        //     // cellRef.current,
        //     // 'offset',
        //     // cellOffset,
        //     // 'colIndex',
        //     // startCIndex.current,
        //     // 'cellElement.colSpan',
        //     // cellElement.colSpan,
        //     // 'endColIndex.current',
        //     // endColIndex.current,
        //     // 'hoveredColIndex',
        //     // hoveredColIndex,
        //     // 'cellWidth',
        //     // cellWidth,
        //     // 'offsets',
        //     // offsets,
        //     // 'startColIndex',
        //     // startColIndex,
        //     'colSpan',
        //     cellElement.colSpan,
        //     'rowSpan',
        //     cellElement.rowSpan,
        //     // colSizes,
        // );
    }

    const isFirstCell = startCIndex.current === 0;
    const borders = getTableCellBorders(cellElement, {
        isFirstCell,
        isFirstRow,
    });

    const selected = isCellSelected;
    const hovered = hoveredColIndex === endColIndex.current;
    const hoveredLeft = isFirstCell && hoveredColIndex === -1;

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

                <div
                    className={ css.resizableWrapper }
                    contentEditable={ false }
                >
                    <TableCellElementResizable
                        colIndex={ endColIndex.current }
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
