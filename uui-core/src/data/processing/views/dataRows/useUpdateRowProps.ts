import { DataRowProps } from '../../../../types';

interface UseUpdateRowProps<TItem, TId> {
    rows: DataRowProps<TItem, TId>[];
    updateRowOptions: (row: DataRowProps<TItem, TId>) => DataRowProps<TItem, TId>;
}

export function useUpdateRowOptions<TItem, TId>({
    rows, updateRowOptions,
}: UseUpdateRowProps<TItem, TId>) {
    return rows.map((row) => {
        if (!row.isLoading) {
            return updateRowOptions(row);
        }
        return row;
    });
}
