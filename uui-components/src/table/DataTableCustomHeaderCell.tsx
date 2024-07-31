import * as React from 'react';
import { DataTableHeaderCellProps, IHasCX } from '@epam/uui-core';
import { FlexCell } from '../layout';

/**
 * Header cell props of DataTable with Timeline.
 */
export interface DataTableCustomHeaderCellProps<TItem, TId> extends DataTableHeaderCellProps<TItem, TId>, IHasCX {
    /**
     * Renders custom header cell for timeline.
     * @returns Header cell content.
     */
    renderCellContent: () => React.ReactNode;
}

export function DataTableCustomHeaderCell<TItem, TId>(props: DataTableCustomHeaderCellProps<TItem, TId>) {
    return (
        <FlexCell
            { ...props.column }
            minWidth={ props.column.width }
            cx={ props.cx }
            rawProps={ {
                role: 'columnheader',
                'aria-sort': 'none',
            } }
        >
            { props.renderCellContent() }
        </FlexCell>
    );
}
