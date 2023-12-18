import { DataRowOptions, DataRowProps } from '../../../../types';

interface UseUpdateRowProps<TItem, TId> {
    rows: DataRowProps<TItem, TId>[];
    updateRowOptions: (row: DataRowProps<TItem, TId>) => DataRowProps<TItem, TId>;
    getRowOptions?: (item: TItem, index?: number) => DataRowOptions<TItem, TId>
}

export function useUpdateRowOptions<TItem, TId>({
    rows, updateRowOptions, getRowOptions,
}: UseUpdateRowProps<TItem, TId>) {
    if (!getRowOptions) {
        return rows;
    }

    return rows.map((row) => {
        if (!row.isLoading) {
            return updateRowOptions(row);
        }
        return row;
    });
}
