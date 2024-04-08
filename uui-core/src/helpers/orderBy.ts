import { compareScalars, getOrderComparer } from '../data/querying/getOrderComparer';

export function orderBy<T>(arr: T[], by: ((item: T) => string | number | null) | keyof T, order: 'asc' | 'desc' = 'asc') {
    const sortedArr = [...arr];

    if (typeof by === 'function') {
        const sign = order === 'desc' ? -1 : 1;
        return sortedArr.sort((a, b) => {
            const aBy = by(a);
            const bBy = by(b);
            return compareScalars(aBy, bBy, sign);
        });
    }

    const comparer = getOrderComparer([{ field: by, direction: order }]);
    return sortedArr.sort(comparer);
}
