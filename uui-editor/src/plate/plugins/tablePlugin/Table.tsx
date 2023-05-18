import React, { useEffect } from 'react';
import {
    TableElement,
    TableElementRootProps,
} from '@udecode/plate-table';
import { type TTableElement, useTableStore, TTableRowElement, usePlateEditorRef, HTMLPropsAs, collapseSelection, useElementProps, createComponentAs, createElementAs, useEditorRef, getTableGridAbove } from '@udecode/plate';
import { cx } from '@epam/uui-core'

import tableCSS from './Table.scss';
import { DEFAULT_COL_WIDTH, EMPTY_COL_WIDTH } from './constants';
import { useReadOnly, useSelected } from 'slate-react';

const getDefaultColWidths = (columnsNumber: number) => Array.from({ length: columnsNumber }, () => DEFAULT_COL_WIDTH);

interface OldTableElement extends TTableElement {
    data?: {
        cellSizes?: number[];
    }
}

const getTableColumnCount = (element: TTableElement) => {
    const colNumberPerRow = element.children.map((cur) => (cur.children as TTableRowElement).length);
    const colCount = Math.max.apply(null, colNumberPerRow);
    return colCount;
}

/**
 * Many grid cells above and diff -> set
 * No many grid cells above and diff -> unset
 * No selection -> unset
 */
export const useSelectedCells = () => {
    const readOnly = useReadOnly();
    const selected = useSelected();
    const editor = useEditorRef();

    const [selectedCells, setSelectedCells] = useTableStore().use.selectedCells();

    useEffect(() => {
        if (!selected || readOnly) {
            console.log('set selected cells to null')
            setSelectedCells(null);
        }
    }, [selected, editor, setSelectedCells, readOnly]);

    useEffect(() => {
        console.log('readOnly', readOnly);
        if (readOnly) return;

        const cellEntries = getTableGridAbove(editor, { format: 'cell' });
        console.log('cellEntries', cellEntries);
        if (cellEntries.length > 1) {
            const cells = cellEntries.map((entry) => entry[0]);
            console.log('cells', cells);

            console.log(
                'JSON.stringify(cells)',
                JSON.stringify(cells),
                'JSON.stringify(selectedCells)',
                JSON.stringify(selectedCells)
            );
            if (JSON.stringify(cells) !== JSON.stringify(selectedCells)) {
                console.log('setting selected cells', cells)
                setSelectedCells(cells);
            }
        } else if (selectedCells) {
            console.log('selectedCells 2', selectedCells);
            setSelectedCells(null);
        }
    }, [editor, editor.selection, readOnly, selectedCells, setSelectedCells]);

    return selectedCells;
};

export const useTableElementRootProps = (
    props: TableElementRootProps
): HTMLPropsAs<'table'> => {
    const editor = usePlateEditorRef();

    const selectedCells = useSelectedCells();

    return {
        onMouseDown: () => {
            // until cell dnd is supported, we collapse the selection on mouse down
            console.log('onMouseDown selectedCells', selectedCells);
            if (selectedCells) {
                console.log('collapseSelection', editor);
                collapseSelection(editor);
            }
        },
        ...useElementProps(props),
    };
};

export const TableElementRoot = createComponentAs<TableElementRootProps>(
    (props) => {
        const htmlProps = useTableElementRootProps(props);

        return createElementAs('table', htmlProps);
    }
);

export const Table = (props: TableElementRootProps) => {
    const { as, children, element, editor, ...rootProps } = props;

    if (!element.colSizes) {
        element.colSizes = (element as OldTableElement).data?.cellSizes || getDefaultColWidths(getTableColumnCount(element));
    }

    const isCellsSelected = !!useTableStore().get.selectedCells();
    const colSizeOverrides = useTableStore().get.colSizeOverrides();
    const currentColSizes = element.colSizes.map((size, index) => colSizeOverrides?.get(index) || size || EMPTY_COL_WIDTH);

    const tableWidth = currentColSizes.reduce((acc, cur) => acc + cur, 0);

    const [selectedCellsFromUse] = useTableStore().use.selectedCells();

    if (!!selectedCellsFromUse?.length) {
        console.log('compare selected cells',selectedCellsFromUse);
    }

    return (
        <TableElementRoot
            { ...rootProps }
            onMouseDown={ () => {
                console.log('my handler used', selectedCellsFromUse);
                // until cell dnd is supported, we collapse the selection on mouse down
                if (selectedCellsFromUse) {
                    collapseSelection(editor);
                }
            } }
            editor={ editor }
            element={ element }
            className={ cx(
                tableCSS.table,
                isCellsSelected && tableCSS.cellsSelectionActive
            ) }
            style={ { width: tableWidth } }
        >
            <TableElement.ColGroup>
                { currentColSizes.map((width, index) => (
                    <TableElement.Col
                        key={ index }
                        style={ { minWidth: 0, width: width || undefined } }
                    />
                )) }
            </TableElement.ColGroup>

            <TableElement.TBody className={ tableCSS.tbody }>{ children }</TableElement.TBody>
        </TableElementRoot>
    );
};
