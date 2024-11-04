import React, { useMemo } from 'react';
import {
    PlateElement,
    withHOC,
    withRef,
} from '@udecode/plate-common';
import {
    TableProvider,
    useTableElement,
    useTableElementState,
    useTableStore,
} from '@udecode/plate-table';
import cx from 'classnames';
import css from './TableElement.module.scss';
import { EMPTY_COL_WIDTH } from './constants';
import { TableElementType } from './types';

const TableElement = withHOC(TableProvider, withRef<typeof PlateElement>(({ className, children, ...props }, ref) => {
    const { isSelectingCell, minColumnWidth, marginLeft } = useTableElementState();
    const { props: tableProps, colGroupProps } = useTableElement();

    const element = props.element as TableElementType;
    const tableStore = useTableStore().get;

    const colSizeOverrides = tableStore.colSizeOverrides();

    const currentColSizes = useMemo(() => {
        return element.colSizes?.map((size, index) => colSizeOverrides.get(index) || size || EMPTY_COL_WIDTH) || [];
    }, [colSizeOverrides, element]);

    const tableWidth = useMemo(() => currentColSizes.reduce((acc, cur) => acc + cur, 0), [currentColSizes]);

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
}));
TableElement.displayName = 'TableElement';

export { TableElement };
