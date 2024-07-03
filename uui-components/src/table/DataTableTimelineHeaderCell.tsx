import * as React from 'react';
import { DataTableHeaderCellProps, IHasCX } from '@epam/uui-core';
import { FlexCell } from '../layout';

export interface DataTableTimelineHeaderCellProps<TItem, TId> extends DataTableHeaderCellProps<TItem, TId>, IHasCX {
    renderCellContent: () => React.ReactNode;
    children: React.ReactNode; 
}

export function DataTableTimelineHeaderCell<TItem, TId>(props: DataTableTimelineHeaderCellProps<TItem, TId>) {
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
