import React, { useRef } from 'react';
import { DataRowProps } from '@epam/uui-core';
import css from './DataRowsContainer.module.scss';
import { getChildrenAndRest } from './utils';

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
            <div className={ row.isPinned ? css.stickyHeader : css.header } style={ { zIndex: row.depth + 10, top } } ref={ rowRef }>
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

export function DataRowsGroups<TItem, TId>({
    rows,
    renderRow,
    top = 1,
}: DataRowsGroupsProps<TItem, TId>) {
    if (!rows.length) return null;
    const [row, ...rest] = rows;
    
    if (!rest.length) {
        return <>{renderRow(row)}</>;
    }
    const [next] = rest;
    if (next.depth <= row.depth && !row.isPinned) {
        return (
            <>
                {renderRow(row)}
                <DataRowsGroups rows={ rest } renderRow={ renderRow } top={ top } />
            </>
        );
    }

    const [childRows, otherRows] = getChildrenAndRest(row, rest);
    return (
        <>
            <DataRowsGroup row={ row } childRows={ childRows } renderRow={ renderRow } top={ top } key={ row.rowKey } />
            <DataRowsGroups rows={ otherRows } renderRow={ renderRow } top={ top } />
        </>
    );
}
