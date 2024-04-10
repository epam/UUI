import { SortingOption } from '../../types/dataSources';

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

export function getOrderComparer<TEntity>(sorting: SortingOption[]): (a: TEntity, b: TEntity) => number {
    if (!sorting || sorting.length === 0) {
        return eqPredicate;
    }

    const sortingOrders = sorting.map((s) => (s.direction === 'desc' ? -1 : 1));

    const comparer = (a: any, b: any) => {
        for (let n = 0; n < sorting.length; n++) {
            const fieldName = sorting[n].field;
            const compareResult = compareScalars(a[fieldName], b[fieldName], sortingOrders[n]);
            if (compareResult !== 0) {
                return compareResult;
            }
        }
        return 0;
    };

    return comparer;
}
