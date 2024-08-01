import * as React from 'react';
import { cx, DataColumnProps, IHasCX, uuiDataTableHeaderCell } from '@epam/uui-core';
import { FlexCell } from '../layout';
import css from './DataTableCellContainer.module.scss';
 
/**
 * Header cell props of DataTable with Timeline.
 */
export interface DataTableCellContainerProps extends IHasCX, React.PropsWithChildren {
    /** DataColumnProps object for the column the cell is at */
    column: DataColumnProps;
}
 
export function DataTableCellContainer(props: DataTableCellContainerProps) {
    return (
        <FlexCell
            { ...props.column }
            minWidth={ props.column.width }
            rawProps={ {
                role: 'columnheader',
                'aria-sort': 'none',
            } }
            cx={
                cx(
                    'uui-dt-vars',
                    uuiDataTableHeaderCell.uuiTableHeaderCell,
                    css.cell,
                    props.column.cx,
                    props.cx,
                ) 
            }
        >
            { props.children }
        </FlexCell>
    );
}
