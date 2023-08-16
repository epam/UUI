import React, { useRef } from 'react';
import css from './DataTable.module.scss';
import { DataRowProps } from '@epam/uui-core';

interface GroupProps<TItem, TId> {
    row: DataRowProps<TItem, TId>;
    childrenRows: DataRowProps<TItem, TId>[];
    renderRow: (props: DataRowProps<TItem, TId>) => React.ReactNode;
    top: number;
}

const getChildrenAndRest = <TItem, TId>(row: DataRowProps<TItem, TId>, rows: DataRowProps<TItem, TId>[]) => {
    const firstNotChildIndex = rows.findIndex((other) => other.depth < row.depth || (row.depth === other.depth && other.isPinned));
    if (firstNotChildIndex === -1) {
        return [rows, []];
    }
    if (firstNotChildIndex === 0) {
        return [[], rows];
    }
    
    const children = rows.slice(0, firstNotChildIndex);
    const rest = rows.slice(firstNotChildIndex, rows.length);
    return [children, rest];
};

function RowsGroup<TItem, TId>({
    row,
    childrenRows,
    renderRow,
    top = 1,
}: GroupProps<TItem, TId>) {
    const rowRef = useRef<HTMLDivElement>();
    return ( 
        <div className={ css.group } key={ row.rowKey }>
            <div className={ row.isPinned ? css.stickyHeader : css.header } style={ { zIndex: row.depth + 10, top } } ref={ rowRef }>
                {renderRow(row)}
            </div>
            {childrenRows.length > 0 && (
                <div className={ css.children }>
                    {renderRows(childrenRows, renderRow, top + (rowRef.current?.clientHeight ?? 0))}
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
        return [renderRow(row), ...renderRows(rest, renderRow, top)];
    }
    
    const [children, otherRows] = getChildrenAndRest(row, rest);
    const group = (<RowsGroup row={ row } childrenRows={ children } renderRow={ renderRow } top={ top } key={ row.rowKey } />); 
    return [group, ...renderRows(otherRows, renderRow, top)];
};
