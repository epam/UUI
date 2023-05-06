// @ts-nocheck
import * as React from 'react';
import css from './Table.scss';

// TODO: improve usage with babel?
import styled from 'styled-components/macro';

import {
    TableCellElementRootProps,
    getCssTableCellRoot,
    TableCellElement,
    cssTableCellResizable,
    getCssTableCellHandle,
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
    AnyObject,
    getTableRowIndex,
    useIsCellSelected,
    TTableRowElement,
    ELEMENT_TR,
    getTableCellBorders,
    TTableElement,
    ELEMENT_TABLE
} from '@udecode/plate';
import { useReadOnly } from 'slate-react';

export interface PlateTableCellElementProps extends TableCellElementRootProps {
    hideBorder?: boolean;
    isHeader?: boolean;
}

const getColIndex = <V extends Value>(
    editor: TReactEditor<V>,
    cellNode: TElement,
    nodeProps: AnyObject
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

export const TableCellElement1 = (props: PlateTableCellElementProps) => {
    const { children, hideBorder, isHeader, ...rootProps } = props;

    const editor = usePlateEditorRef();
    const cellElement = useElement<TTableCellElement>();
    const rowIndex = getTableRowIndex(editor, cellElement);
    const readOnly = useReadOnly();
    const selected = useIsCellSelected(cellElement);

    const rowSizeOverrides = useTableStore().get.rowSizeOverrides();
    const rowElement = useElement<TTableRowElement>(ELEMENT_TR);
    const rowSize = rowSizeOverrides.get(rowIndex) ?? rowElement?.size ?? undefined;

    const colIndex = getColIndex(editor, cellElement, rootProps.nodeProps);

    const tableElement = useElement<TTableElement>(ELEMENT_TABLE);
    const isFirstRow = tableElement.children[0] === rowElement;
    const isFirstCell = colIndex === 0;
    const borders = getTableCellBorders(cellElement, {
        isFirstCell,
        isFirstRow,
    });

    const hoveredColIndex = useTableStore().get.hoveredColIndex();
    const hovered = hoveredColIndex === colIndex;
    const hoveredLeft = isFirstCell && hoveredColIndex === -1;

    if (hovered || hoveredLeft) {
        console.log('colIndex', colIndex, 'rowIndex', rowIndex, 'hovered', hovered, 'hoveredLeft', hoveredLeft);
    }

    return (
        <TableCellElement.Root
            asAlias={ isHeader ? 'th' : 'td' }
            css={ getCssTableCellRoot({ borders, hideBorder, isHeader, selected }) }
            { ...rootProps }
        >
            <TableCellElement.Content
                style={ {
                    minHeight: rowSize,
                    padding: '6px 24px',
                    position: 'relative',
                    zIndex: 20,
                    boxSizing: 'border-box',
                    height: '100%'
                } }
            >
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
                    <TableCellElement.Handle css={ getCssTableCellHandle({ side: 'right' }) } />
                ) }

                { !readOnly && hoveredLeft && (
                    <TableCellElement.Handle css={ getCssTableCellHandle({ side: 'left' }) } />
                ) }
            </TableCellElement.ResizableWrapper>
        </TableCellElement.Root>
    );
};


export function TableCell(props: any) {
    const { attributes, element } = props;

    const appliedSpans = {
        colSpan: element?.data?.colSpan || Number(element.attributes?.colspan) || 1,
        rowSpan: element?.data?.rowSpan || Number(element.attributes?.rowspan) || 1,
    };


    if (!props.editor) {
        return null;
    }

    // needs for getColIndex function
    // TODO: think about, should we store colSpan in element
    element.colSpan = appliedSpans.colSpan;

    return (
        <TableCellElement1
            { ...props }
            className={ css.cell }
            { ...attributes }
            nodeProps={ appliedSpans }
        />
    );
}
