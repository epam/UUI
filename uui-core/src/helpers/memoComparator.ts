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
    return (newItem: TItem, existingItem: TItem) => {
        const id = getId(newItem);
        if (!cache.has(id)) {
            cache.set(id, newItem);
        }

        return comparator(cache.get(id), existingItem);
    };
};

const memoComparatorWithSkip = <TItem, TId>(
    comparator: ItemsComparator<TItem>,
    getId: (item: TItem) => TId,
): ItemsComparator<TItem> => {
    const cache = new Map();
    return (newItem: TItem, existingItem: TItem, zeroIfNotInCache = true) => {
        const id = getId(newItem);
        if (!cache.has(id)) {
            if (zeroIfNotInCache) {
                return 0;
            }
            cache.set(id, newItem);
        }

        return comparator(cache.get(id), existingItem);
    };
};
