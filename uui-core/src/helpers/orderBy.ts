import { compareScalars } from '../data/querying/getOrderComparer';

export function orderBy<T>(arr: T[], by: (item: T) => string | number | null | undefined, order: 'asc' | 'desc' = 'asc') {
    const sortedArr = [...arr];
    const sign = order === 'desc' ? -1 : 1;
    return sortedArr.sort((a, b) => {
        const aBy = by(a);
        const bBy = by(b);
        return compareScalars(aBy, bBy, sign);
    });
}
