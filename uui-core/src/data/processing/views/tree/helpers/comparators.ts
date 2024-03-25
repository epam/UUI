import { ApplySortOptions } from '../newTree/treeState/types';

export const buildComparators = <TItem, TId, TFilter>(options: ApplySortOptions<TItem, TId, TFilter>) => {
    const compareScalars = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' }).compare;
    const comparators: ((a: TItem, b: TItem) => number)[] = [];

    if (options.sorting) {
        options.sorting.forEach((sortingOption) => {
            const sortByFn = options.sortBy || ((i: TItem) => i[sortingOption.field as keyof TItem] ?? '');
            const sign = sortingOption.direction === 'desc' ? -1 : 1;
            comparators.push((a, b) => sign * compareScalars(sortByFn(a, sortingOption) + '', sortByFn(b, sortingOption) + ''));
        });
    }

    return comparators;
};

export const composeComparetors = <TItem>(comparators: ((a: TItem, b: TItem) => number)[]) => {
    return (a: TItem, b: TItem) => {
        for (let n = 0; n < comparators.length; n++) {
            const compare = comparators[n];
            const result = compare(a, b);
            if (result !== 0) {
                return result;
            }
        }
        return 0;
    };
};

export const buildSorter = <TItem, TId, TFilter>(options: ApplySortOptions<TItem, TId, TFilter>) => {
    const comparators = buildComparators(options);
    const composedComparator = composeComparetors(comparators);
    return (items: TItem[]) => {
        if (comparators.length === 0) {
            return items;
        }

        const indexes = new Map<TItem, number>();
        items.forEach((item, index) => indexes.set(item, index));

        const comparer = (a: TItem, b: TItem) => {
            const result = composedComparator(a, b);
            if (result !== 0) {
                return result;
            }
            // to make sort stable, compare items indices if other comparers return 0 (equal)
            return indexes.get(a) - indexes.get(b);
        };

        items = [...items];
        items.sort(comparer);
        return items;
    };
};
