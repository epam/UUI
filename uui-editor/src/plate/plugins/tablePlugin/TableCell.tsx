// @ts-nocheck
import * as React from 'react';
import css from './Table.scss';

// TODO: improve usage with babel?
import styled from 'styled-components/macro';

import {
    PlateTableCellElement,
    TableCellElementRootProps,
    getCssTableCellRoot,
    useTableCellElementState,
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
    AnyObject
} from '@udecode/plate';

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

    // let colIndex = 0;

    let cIndex = 0

    trNode.children.some((item, index) => {
        if (item === cellNode) {
            cIndex = index;
            return true;
        }
        return false;
    });

    // needs to calc index of cell within row which contains merged cells
    const _realIndex = (trNode.children as TDescendant[]).reduce<number>((acc, cur, index) => {
        if (index < cIndex) {
            const c1 = (cur.colSpan as number);
            // console.log('cur', cur);
            return acc + c1;
        }

        return acc;
    }, 0);

    const cellColSpan = (cellNode.colSpan as number);


    // if it merged cell, we need to increase col index by col span value
    const realColIndex = cellColSpan !== 1 ? (cellColSpan - 1) + _realIndex : _realIndex;


    // console.log('cIndex', cIndex, 'realIndex', realIndex);



    return realColIndex;
};

export const TableCellElement1 = (props: PlateTableCellElementProps) => {
    const { children, hideBorder, isHeader, ...rootProps } = props;

    const {
        // colIndex: _colIndex,
        rowIndex,
        readOnly,
        selected,
        // hovered,
        // hoveredLeft,
        rowSize,
        borders,
    } = useTableCellElementState();

    const editor = usePlateEditorRef();
    const cellElement = useElement<TTableCellElement>();

    const colIndex = getColIndex(editor, cellElement, rootProps.nodeProps);

    const colSpan = rootProps.nodeProps.colSpan;
    // const colIndex = colSpan !== 1 ? (colSpan - 1) + _colIndex : _colIndex;
    const isFirstCell = colIndex === 0;

    const hoveredColIndex = useTableStore().get.hoveredColIndex();

    const hovered = hoveredColIndex === colIndex;
    const hoveredLeft = isFirstCell && hoveredColIndex === -1;

    if (hovered || hoveredLeft) {
        console.log('colIndex', colIndex, 'rowIndex', rowIndex, 'hovered', hovered, 'hoveredLeft', hoveredLeft);
    }



    // const showColResizeHandle = colSpan === 1;
    const showColResizeHandle = true;


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

                { showColResizeHandle && !readOnly && hovered && (
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
