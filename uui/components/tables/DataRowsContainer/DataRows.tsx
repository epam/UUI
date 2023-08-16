import React, { useRef } from 'react';
import { DataRowProps } from '@epam/uui-core';
import css from './DataRowsContainer.module.scss';
import { getChildrenAndRest } from './utils';

interface GroupProps<TItem, TId> {
    row: DataRowProps<TItem, TId>;
    childrenRows: DataRowProps<TItem, TId>[];
    renderRow: (props: DataRowProps<TItem, TId>) => React.ReactNode;
    top: number;
}

export interface DataRowsProps<TItem, TId> {
    rows: DataRowProps<TItem, TId>[],
    renderRow: (props: DataRowProps<TItem, TId>) => React.ReactNode;
    top: number;
}

function DataRowGroup<TItem, TId>({
    row,
    childrenRows,
    renderRow,
    top = 1,
}: GroupProps<TItem, TId>) {
    const rowRef = useRef<HTMLDivElement>();
    const childrenPinnedTop = row.isPinned ? (top + (rowRef.current?.clientHeight ?? 0)) : top;
    return ( 
        <div className={ css.group } key={ row.rowKey }>
            <div className={ row.isPinned ? css.stickyHeader : css.header } style={ { zIndex: row.depth + 10, top } } ref={ rowRef }>
                {renderRow(row)}
            </div>
            {childrenRows.length > 0 && (
                <div>
                    <DataRows rows={ childrenRows } renderRow={ renderRow } top={ childrenPinnedTop } />
                </div>
            )}
        </div>
    );
}
export function DataRows<TItem, TId>({
    rows,
    renderRow,
    top = 1,
}: DataRowsProps<TItem, TId>) {
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
                <DataRows rows={ rest } renderRow={ renderRow } top={ top } />
            </>
        );
    }

    const [children, otherRows] = getChildrenAndRest(row, rest);
    return (
        <>
            <DataRowGroup row={ row } childrenRows={ children } renderRow={ renderRow } top={ top } key={ row.rowKey } />
            <DataRows rows={ otherRows } renderRow={ renderRow } top={ top } />
        </>
    );
}
