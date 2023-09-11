import { DataRowProps } from '@epam/uui-core';

export const getChildrenAndRest = <TItem, TId>(row: DataRowProps<TItem, TId>, rows: DataRowProps<TItem, TId>[]) => {
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
