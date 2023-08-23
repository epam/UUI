import React, { useRef } from 'react';
import {
    PlateElement,
    PlateElementProps,
    TElement,
    getPluginOptions,
} from '@udecode/plate-common';
import { ELEMENT_TABLE, TTableElement, TablePlugin, useTableElement, useTableStore } from '@udecode/plate-table';
import cx from 'classnames';
import css from './TableElement.module.scss';
import { DEFAULT_COL_WIDTH, EMPTY_COL_WIDTH } from './constants';
import { ExtendedTTableCellElement } from './types';

interface OldTableElement extends TTableElement {
    data?: {
        cellSizes?: number[];
    }
}

const getTableColumnCount = (tableNode: TElement) => {
    const firstRow = (tableNode.children as TElement[])?.[0];
    const colCount = firstRow?.children.reduce((acc, current) => {
        let next = acc + 1;

        const cellElement = current as ExtendedTTableCellElement;
        const attrColSpan = Number(cellElement.attributes?.colspan);
        const colSpan = cellElement.colSpan || attrColSpan;
        if (colSpan && colSpan > 1) {
            next += colSpan - 1;
        }

        return next;
    }, 0);
    return colCount;
};

const getDefaultColWidths = (columnsNumber: number) =>
    Array.from({ length: columnsNumber }, () => DEFAULT_COL_WIDTH);

const TableElement = React.forwardRef<
React.ElementRef<typeof PlateElement>,
PlateElementProps
>(({ className, children, ...props }, ref) => {
    const { editor } = props;
    const element: OldTableElement = props.element;
    const tableStore = useTableStore().get;
    const tableRef = useRef<HTMLTableElement>();
    const { props: tableProps, colGroupProps } = useTableElement();

    const { minColumnWidth, disableMarginLeft } = getPluginOptions<TablePlugin>(
        editor,
        ELEMENT_TABLE,
    );
    const marginLeftOverride = useTableStore().get.marginLeftOverride();
    const marginLeft = disableMarginLeft
        ? 0
        : marginLeftOverride ?? element.marginLeft ?? 0;

    if (!element.colSizes) {
        const cellSizes = (element as OldTableElement).data?.cellSizes;
        const colCount = getTableColumnCount(element);
        const colWidths = getDefaultColWidths(colCount);
        element.colSizes = cellSizes || colWidths;
    }

    const isCellsSelected = !!tableStore.selectedCells();
    const colSizeOverrides = tableStore.colSizeOverrides();
    const currentColSizes = element.colSizes.map((size, index) => colSizeOverrides?.get(index) || size || EMPTY_COL_WIDTH);

    const tableWidth = currentColSizes.reduce((acc, cur) => acc + cur, 0);

    return (
        <div className={ css.tableWrapper } style={ { paddingLeft: marginLeft } }>
            <PlateElement
                asChild
                ref={ ref }
                className={ cx(
                    css.table,
                    isCellsSelected && css.cellsSelectionActive,
                    className,
                ) }
                { ...tableProps }
                { ...props }
            >
                <table ref={ tableRef } style={ { width: tableWidth } }>
                    <colgroup { ...colGroupProps }>
                        { currentColSizes.map((width, index) => (
                            <col
                                key={ index }
                                style={ {
                                    minWidth: minColumnWidth,
                                    width: width || undefined,
                                } }
                            />
                        )) }
                    </colgroup>

                    <tbody className={ css.tbody }>{ children }</tbody>
                </table>
            </PlateElement>
        </div>
    );
});
TableElement.displayName = 'TableElement';

export { TableElement };
