import * as React from 'react';
import css from './Table.module.scss';
import cx from 'classnames';

import {
    TableCellElementRootProps,
    TableCellElement,
    useTableStore,
    TElement,
    usePlateEditorRef,
    useElement,
    getTableRowIndex,
    TTableRowElement,
    ELEMENT_TR,
    TTableElement,
    ELEMENT_TABLE,
} from '@udecode/plate';
import { useReadOnly } from 'slate-react';
import { ExtendedTTableCellElement } from './types';

interface PlateTableCellElementProps extends TableCellElementRootProps {
    hideBorder?: boolean;
    isHeader?: boolean;
}

/**
 * TODO: create issue about merged cells resize functionality
 */
export const TableCellRenderer = (props: PlateTableCellElementProps) => {
    const { children, hideBorder, isHeader, ...rootProps } = props;

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

    const colIndex = cellElement.colIndex;
    const tableElement = useElement<TTableElement>(ELEMENT_TABLE);

    const isFirstRow = tableElement.children[0] === rowElement;

    const hoveredColIndex = useTableStore().get.hoveredColIndex();

    const hovered = hoveredColIndex === colIndex;
    const hoveredLeft = isFirstCell(colIndex, cellElement) && hoveredColIndex === -1;

    return (
        <TableCellElement.Root
            { ...rootProps }
            asAlias={ isHeader ? 'th' : 'td' }
            className={ cx(
                css.tableCellWrapper,
                isFirstCell(colIndex, cellElement) && css.tableCellBorderLeft,
                isFirstRow && css.tableCellBorderTop,
                selected && css.tableCellSelected
            ) }
        >
            <TableCellElement.Content style={ { minHeight: rowSize } } className={ css.tableCellContent }>
                { children }
            </TableCellElement.Content>

            <TableCellElement.ResizableWrapper className={ css.tableCellResizable }>
                <TableCellElement.Resizable
                    colIndex={ colIndex }
                    rowIndex={ rowIndex }
                    readOnly={ readOnly }
                />

                { !readOnly && hovered && (
                    <TableCellElement.Handle className={ css.tableCellResizeRightHandle } />
                ) }

                { !readOnly && hoveredLeft && (
                    <TableCellElement.Handle className={ css.tableCellResizeLeftHandle } />
                ) }
            </TableCellElement.ResizableWrapper>
        </TableCellElement.Root>
    );
};

const isFirstCell = (colIndex: number, cellNode: TElement) => {
    const cellColSpan = (cellNode.colSpan as number);
    const isFirstMergedCell = colIndex + 1 === cellColSpan;
    return colIndex === 0 || isFirstMergedCell;
};