import React from 'react';
import { getPluginOptions } from '@udecode/plate-common';
import {
    ELEMENT_TABLE,
    TableElement,
    TableElementRootProps,
    TablePlugin,
} from '@udecode/plate-table';
import { getTableColumnCount, type TTableElement, useTableStore } from '@udecode/plate';
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

    if (!element.colSizes) {
        element.colSizes = (element as OldTableElement).data?.cellSizes || getDefaultColWidths(getTableColumnCount(element));
    }

    const colSizeOverrides = useTableStore().get.colSizeOverrides();
    const currentColSizes = element.colSizes.map((size, index) => colSizeOverrides?.get(index) ?? size ?? EMPTY_COL_WIDTH);

    return (
        <TableElement.Root
            { ...rootProps }
            editor={ editor }
            element={ element }
            className={ cx(
                tableCSS.table,
                isCellsSelected && tableCSS.cellsSelectionActive
            ) }
        >
            <TableElement.ColGroup>
                { currentColSizes.map((width, index) => (
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
