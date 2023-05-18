import React from 'react';
import {
    TableElement,
    TableElementRootProps,
} from '@udecode/plate-table';
import { type TTableElement, useTableStore, TTableRowElement } from '@udecode/plate';
import { cx } from '@epam/uui-core'

import tableCSS from './Table.scss';
import { DEFAULT_COL_WIDTH, EMPTY_COL_WIDTH } from './constants';

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

export const Table = (props: TableElementRootProps) => {
    const { as, children, element, editor, ...rootProps } = props;

    if (!element.colSizes) {
        element.colSizes = (element as OldTableElement).data?.cellSizes || getDefaultColWidths(getTableColumnCount(element));
    }

    const isCellsSelected = !!useTableStore().get.selectedCells();
    const colSizeOverrides = useTableStore().get.colSizeOverrides();
    const currentColSizes = element.colSizes.map((size, index) => colSizeOverrides?.get(index) ?? size ?? EMPTY_COL_WIDTH);

    const tableWidth = currentColSizes.reduce((acc, cur) => acc + cur, 0);
    return (
        <TableElement.Root
            { ...rootProps }
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
        </TableElement.Root>
    );
};
