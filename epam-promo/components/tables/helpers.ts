import { DataColumnProps, DataRowProps, IEditable, Lens, RowsData } from "@epam/uui-core";

// TODO: move to core helpers...

export const getTableRowsData = <TItem, TId>(rows: DataRowProps<TItem, TId>[], columns: DataColumnProps<TItem, TId>[]): RowsData<TItem> =>
    rows.map((row, rowIndex) =>
        columns.reduce<Record<string, any>>((acc, column, columnIndex) => {
            const rowLens = Lens.onEditable(row as IEditable<TItem>);
            return {
                ...acc,
                [columnIndex]: {
                    key: column.key,
                    columnIndex,
                    rowIndex,
                    rowLens,
                    canCopy: column.canCopy,
                    canAcceptCopy: column.canAcceptCopy,
                },
            };
        }, {}),
    );
