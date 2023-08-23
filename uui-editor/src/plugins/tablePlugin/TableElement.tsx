import React, { useRef } from 'react';
import {
    PlateElement,
    PlateElementProps,
    getPluginOptions,
} from '@udecode/plate-common';
import { ELEMENT_TABLE, TTableElement, TablePlugin, getTableColumnCount, useTableElement, useTableStore } from '@udecode/plate-table';
import cx from 'classnames';
import css from './TableElement.module.scss';
import { DEFAULT_COL_WIDTH, EMPTY_COL_WIDTH } from './constants';

interface OldTableElement extends TTableElement {
    data?: {
        cellSizes?: number[];
    }
}

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
        element.colSizes = (element as OldTableElement).data?.cellSizes || getDefaultColWidths(getTableColumnCount(element));
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
