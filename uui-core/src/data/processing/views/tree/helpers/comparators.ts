import { ApplySortOptions } from '../treeState/types';

export const simpleComparator = <T extends string | number>(a: T, b: T) => {
    if (a < b) {
        return -1;
    }

    return a === b ? 0 : 1;
};

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

export const composeComparators = <TItem, TId>(comparators: ((a: TItem, b: TItem) => number)[], getId: (item: TItem) => TId) => {
    return (a: TItem, b: TItem) => {
        for (let n = 0; n < comparators.length; n++) {
            const compare = comparators[n];
            const result = compare(a, b);
            if (result !== 0) {
                return result;
            }
        }

        const aId = getId(a);
        const bId = getId(b);

        const aCompareId = typeof aId === 'object' && aId !== null ? JSON.stringify(aId) : aId as string | number;
        const bCompareId = typeof bId === 'object' && bId !== null ? JSON.stringify(bId) : bId as string | number;

        return simpleComparator(aCompareId, bCompareId);
    };
};

export const buildSorter = <TItem, TId, TFilter>(options: ApplySortOptions<TItem, TId, TFilter>) => {
    const comparators = buildComparators(options);
    const composedComparator = composeComparators(comparators, options.getId);
    return (items: TItem[]) => {
        if (comparators.length === 0) {
            return items;
        }

        items = [...items];
        items.sort(composedComparator);
        return items;
    };
};
