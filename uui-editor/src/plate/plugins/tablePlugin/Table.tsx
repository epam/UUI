import React from 'react';
import { getPluginOptions } from '@udecode/plate-common';
import {
    ELEMENT_TABLE,
    TableElement,
    TableElementRootProps,
    TablePlugin,
} from '@udecode/plate-table';
import { getTableColumnCount, type TTableElement, useTableColSizes, useTableStore } from '@udecode/plate';
import { cx } from '@epam/uui-core'

import tableCSS from './Table.scss';
import { DEFAULT_COL_WIDTH, EMPTY_COL_WIDTH } from './constants';

const getDefaultColWidths = (columnsNumber: number) => Array.from({ length: columnsNumber }, () => DEFAULT_COL_WIDTH);

interface OldTableElement extends TTableElement {
    data?: {
        cellSizes?: number[];
    }
}

export const Table = (props: TableElementRootProps) => {
    const { as, children, element, editor, ...rootProps } = props;

    const { minColumnWidth: minWidth } = getPluginOptions<TablePlugin>(
        editor,
        ELEMENT_TABLE
    );

    const isCellsSelected = !!useTableStore().get.selectedCells();

    const getCurrentColSizes = () =>
        (element.colSizes || (element as OldTableElement).data?.cellSizes || getDefaultColWidths(getTableColumnCount(element)));

    const currentColSizes =
        getCurrentColSizes()
            .map((current: number) => current === 0 ? EMPTY_COL_WIDTH : current);
    const tableWidth = currentColSizes.reduce((acc: number, cur: number) => acc + cur, 0);

    element.colSizes = useTableColSizes({ ...element, colSizes: currentColSizes });

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
                { element.colSizes.map((width, index) => (
                    <TableElement.Col
                        key={ index }
                        style={ { minWidth, width: width || undefined } }
                    />
                )) }
            </TableElement.ColGroup>

            <TableElement.TBody className={ tableCSS.tbody }>{ children }</TableElement.TBody>
        </TableElement.Root>
    );
};
