import React from 'react';
import {
    PlateElement,
    PlateElementProps,
} from '@udecode/plate-common';
import {
    TTableElement,
    getTableColumnCount,
    useTableElement,
    useTableElementState,
    useTableStore,
} from '@udecode/plate-table';
import cx from 'classnames';
import css from './TableElement.module.scss';
import { DEFAULT_COL_WIDTH, EMPTY_COL_WIDTH } from './constants';

interface OldTableElement extends TTableElement {
    data?: {
        cellSizes?: number[];
    };
}

const getDefaultColWidths = (columnsNumber: number) =>
    Array.from({ length: columnsNumber }, () => DEFAULT_COL_WIDTH);

const TableElement = React.forwardRef<
React.ElementRef<typeof PlateElement>,
PlateElementProps
>(({ className, children, ...props }, ref) => {
    const { isSelectingCell, minColumnWidth, marginLeft } = useTableElementState();
    const { props: tableProps, colGroupProps } = useTableElement();

    const element: OldTableElement = props.element;
    const tableStore = useTableStore().get;

    if (!element.colSizes) {
        element.colSizes = (element as OldTableElement).data?.cellSizes
            || getDefaultColWidths(getTableColumnCount(element));
    }

    const colSizeOverrides = tableStore.colSizeOverrides();
    const currentColSizes = element.colSizes.map(
        (size, index) => colSizeOverrides?.get(index) || size || EMPTY_COL_WIDTH,
    );

    const tableWidth = currentColSizes.reduce((acc, cur) => acc + cur, 0);

    return (
        <div className={ css.tableWrapper } style={ { paddingLeft: marginLeft } }>
            <PlateElement
                asChild
                ref={ ref }
                className={ cx(
                    css.table,
                    isSelectingCell && css.cellsSelectionActive,
                    className,
                ) }
                { ...tableProps }
                { ...props }
            >
                <table style={ { width: tableWidth } }>
                    <colgroup { ...colGroupProps }>
                        {currentColSizes.map((width, index) => (
                            <col
                                key={ index }
                                style={ {
                                    minWidth: minColumnWidth,
                                    width: width || undefined,
                                } }
                            />
                        ))}
                    </colgroup>

                    <tbody className={ css.tbody }>{children}</tbody>
                </table>
            </PlateElement>
        </div>
    );
});
TableElement.displayName = 'TableElement';

export { TableElement };
