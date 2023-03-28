import { ItemsComparator } from "../data";

export const memoComparator = <TItem, TId>(
    comparator: ItemsComparator<TItem>,
    getId: (item: TItem) => TId,
    withSkipIfNotInCache?: boolean,
): ItemsComparator<TItem> => {
    if (withSkipIfNotInCache) {
        return memoComparatorWithSkip(comparator, getId);
    }

    return defaultMemoComparator(comparator, getId);
};

const defaultMemoComparator = <TItem, TId>(
    comparator: ItemsComparator<TItem>,
    getId: (item: TItem) => TId,
): ItemsComparator<TItem> => {
    const cache = new Map();
    return (a: TItem, b: TItem,) => {
        const id = getId(b);
        if (!cache.has(id)) {
            cache.set(id, b);
        }

        return comparator(a, cache.get(id));
    };
};

const memoComparatorWithSkip = <TItem, TId>(
    comparator: ItemsComparator<TItem>,
    getId: (item: TItem) => TId,
): ItemsComparator<TItem> => {
    const cache = new Map();
    return (a: TItem, b: TItem, zeroIfNotInCache = true) => {
        const id = getId(b);
        if (!cache.has(id)) {
            if (zeroIfNotInCache) {
                return 0;
            }
            cache.set(id, b);
        }

        return comparator(a, cache.get(id));
    };
};
