import * as React from 'react';
import css from './Table.scss';
import cx from 'classnames';

import {
    TableCellElementRootProps,
    TableCellElement,
    cssTableCellResizable,
    useTableStore,
    findNodePath,
    getParentNode,
    TReactEditor,
    TElement,
    Value,
    usePlateEditorRef,
    useElement,
    TTableCellElement,
    TDescendant,
    getTableRowIndex,
    useIsCellSelected,
    TTableRowElement,
    ELEMENT_TR,
    TTableElement,
    ELEMENT_TABLE,
} from '@udecode/plate';
import { useReadOnly } from 'slate-react';

export interface PlateTableCellElementProps extends TableCellElementRootProps {
    hideBorder?: boolean;
    isHeader?: boolean;
}

export const TableCellRenderer = (props: PlateTableCellElementProps) => {
    const { children, hideBorder, isHeader, ...rootProps } = props;

    const editor = usePlateEditorRef();
    const cellElement = useElement<TTableCellElement>();
    const rowIndex = getTableRowIndex(editor, cellElement);
    const readOnly = useReadOnly();
    const selected = useIsCellSelected(cellElement);

    const rowSizeOverrides = useTableStore().get.rowSizeOverrides();
    const rowElement = useElement<TTableRowElement>(ELEMENT_TR);
    const rowSize = rowSizeOverrides.get(rowIndex) ?? rowElement?.size ?? undefined;

    const colIndex = getColIndex(editor, cellElement);

    const tableElement = useElement<TTableElement>(ELEMENT_TABLE);
    const isFirstRow = tableElement.children[0] === rowElement;
    const isFirstCell = colIndex === 0;

    const hoveredColIndex = useTableStore().get.hoveredColIndex();
    const hovered = hoveredColIndex === colIndex;
    const hoveredLeft = isFirstCell && hoveredColIndex === -1;

    return (
        <TableCellElement.Root
            { ...rootProps }
            asAlias={ isHeader ? 'th' : 'td' }
            className={ cx(
                css.tableCellWrapper,
                isFirstCell && css.tableCellBorderLeft,
                isFirstRow && css.tableCellBorderTop,
                selected && css.tableCellSelected
            ) }
        >
            <TableCellElement.Content style={ { minHeight: rowSize } } className={ css.tableCellContent }>
                { children }
            </TableCellElement.Content>

            <TableCellElement.ResizableWrapper
                css={ cssTableCellResizable }
                className="group"
            >
                <TableCellElement.Resizable
                    colIndex={ colIndex }
                    rowIndex={ rowIndex }
                    readOnly={ readOnly }
                />

                { !readOnly && hovered && (
                    <TableCellElement.Handle className={ css.tableCellResizeRightHandle }
                    />
                ) }

                { !readOnly && hoveredLeft && (
                    <TableCellElement.Handle className={ css.tableCellResizeLeftHandle } />
                ) }
            </TableCellElement.ResizableWrapper>
        </TableCellElement.Root >
    );
};

/**
 * TODO: create issue about merged cells resize functionality
 * Plate should consider merged cells in getColumnIndex function.
 * Basically getColIndex is the main reason why TableCellRenderer component exists on UUI editor side.
 */
const getColIndex = <V extends Value>(
    editor: TReactEditor<V>,
    cellNode: TElement
) => {
    const path = findNodePath(editor, cellNode);
    if (!path) return 0;

    const [trNode] = getParentNode(editor, path) ?? [];
    if (!trNode) return 0;

    let cIndex = 0
    trNode.children.some((item, index) => {
        if (item === cellNode) {
            cIndex = index;
            return true;
        }
        return false;
    });

    // shift colIndex by colSpan values of prev merged cells in this row
    const shiftedIndex = (trNode.children as TDescendant[]).reduce<number>((acc, cur, index) => {
        if (index < cIndex) {
            const curCellColSpan = (cur.colSpan as number);
            return acc + curCellColSpan;
        }

        return acc;
    }, 0);

    const cellColSpan = (cellNode.colSpan as number);

    // if it merged cell, we need to increase col index by col span value
    const realColIndex = cellColSpan !== 1 ? (cellColSpan - 1) + shiftedIndex : shiftedIndex;

    return realColIndex;
};