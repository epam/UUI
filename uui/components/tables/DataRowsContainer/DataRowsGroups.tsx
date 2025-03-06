import React, { useRef } from 'react';
import { DataRowProps } from '@epam/uui-core';
import { getChildrenAndRest } from './utils';

import css from './DataRowsContainer.module.scss';

interface DataRowsGroupProps<TItem, TId> {
    row: DataRowProps<TItem, TId>;
    childRows: DataRowProps<TItem, TId>[];
    renderRow: (props: DataRowProps<TItem, TId>) => React.ReactNode;
    top: number;
}

export interface DataRowsGroupsProps<TItem, TId> {
    rows: DataRowProps<TItem, TId>[],
    renderRow: (props: DataRowProps<TItem, TId>) => React.ReactNode;
    top: number;
}

function DataRowsGroup<TItem, TId>({
    row,
    childRows,
    renderRow,
    top = 1,
}: DataRowsGroupProps<TItem, TId>) {
    const rowRef = useRef<HTMLDivElement>();
    const childrenPinnedTop = row.isPinned ? (top + (rowRef.current?.clientHeight ?? 0)) : top;
    return ( 
        <div className={ css.group } key={ row.rowKey }>
            <div
                className={ row.isPinned ? css.stickyHeader : css.header }
                // Gaps between pinned parents should be removed by -1 from top height.
                // Otherwise, sometimes top value is rounded top.
                style={ { zIndex: row.depth + 10, top: top - 1 } }
                ref={ rowRef }
            >
                {renderRow(row)}
            </div>
            {childRows.length > 0 && (
                <div>
                    <DataRowsGroups rows={ childRows } renderRow={ renderRow } top={ childrenPinnedTop } />
                </div>
            )}
        </div>
    );
}

export const renderRows = <TItem, TId>(
    rows: DataRowProps<TItem, TId>[],
    renderRow: (props: DataRowProps<TItem, TId>) => React.ReactNode,
    top?: number,
): React.ReactNode[] => {
    if (!rows.length) return [];

    const [row, ...rest] = rows;
    
    if (!rest.length) {
        return [renderRow(row)];
    }
    const [next] = rest;
    if (next.depth <= row.depth && !row.isPinned) {
        return [renderRow(row)].concat(renderRows(rest, renderRow, top));
    }
    
    const [children, otherRows] = getChildrenAndRest(row, rest);
    const group: React.ReactNode = (
        <DataRowsGroup 
            row={ row } 
            childRows={ children }
            renderRow={ renderRow }
            top={ top }
            key={ row.rowKey }
        />
    );

    return [group].concat(renderRows(otherRows, renderRow, top) as JSX.Element[]);
};

export function DataRowsGroups<TItem, TId>({
    rows,
    renderRow,
    top = 1,
}: DataRowsGroupsProps<TItem, TId>) {
    const rowsWithGroups = renderRows(rows, renderRow, top);
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return (<>{ rowsWithGroups }</>);
}
