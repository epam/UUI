import { DataRowMap, DataRowProps } from '../../../../types';
import { NodeStats } from './stats';

interface UseUpdateRowProps<TItem, TId> {
    rows: DataRowProps<TItem, TId>[];
    rowsMap: DataRowMap<TItem, TId>;
    stats: NodeStats;
    updateRowOptions: (row: DataRowProps<TItem, TId>, rowsMap: DataRowMap<TItem, TId>, stats: NodeStats) => DataRowProps<TItem, TId>;
}

export function useUpdateRowOptions<TItem, TId>({
    rows, rowsMap, stats, updateRowOptions,
}: UseUpdateRowProps<TItem, TId>) {
    return rows.map((row) => {
        if (!row.isLoading) {
            return updateRowOptions(row, rowsMap, stats);
        }
        return row;
    });
}
