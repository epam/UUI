import { getComparator, simpleComparator } from '../processing/views';
import { ApplySortOptions } from '../processing/views/tree/treeState/types';

const eqPredicate = () => 0;

// Previous versions use this comparer. While it works great for human-readable strings, it's broken for dates. Also, we need a plain sort in case of 'order' fields.
// const compareScalars = (new Intl.Collator(undefined, {numeric: true, sensitivity: 'base'})).compare;

export function compareScalars(a: any, b: any, order: number) {
    if (a == null) {
        if (b == null) {
            return 0;
        }
        return -order;
    }
    if (b == null) return order;
    if (a < b) return -order;
    if (a === b) return 0;

    return order;
}

export function getOrderComparer<TEntity, TId>({ sorting, sortingSettings, ...rest }: ApplySortOptions<TEntity, TId, any>): (a: TEntity, b: TEntity) => number {
    if (!sorting || sorting.length === 0) {
        return eqPredicate;
    }

    return getComparator({
        sorting,
        sortingSettings,
        comparator: simpleComparator,
        ...rest,
    });
}
