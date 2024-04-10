import { compareScalars } from '../data/querying/getOrderComparer';

/**
 * Function, which orders array of items by criteria in some direction.
 * @param arr - list of items to be ordered.
 * @param by - criteria of ordering.
 * @param order - direction of ordering. Default: 'asc'.
 * @returns - array of data, ordered by criteria.
 */
export function orderBy<T>(arr: T[], by: (item: T) => string | number | null | undefined, order: 'asc' | 'desc' = 'asc') {
    const sortedArr = [...arr];
    const sign = order === 'desc' ? -1 : 1;
    return sortedArr.sort((a, b) => {
        const aBy = by(a);
        const bBy = by(b);
        return compareScalars(aBy, bBy, sign);
    });
}
