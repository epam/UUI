import { ItemsComparatorBuilder } from "../data";

export const memoComparatorBuilder = <TItem, TId>(
    getId: (item: TItem) => TId,
    withSkipIfNotInCache?: boolean,
): ItemsComparatorBuilder<TItem> => {
    if (withSkipIfNotInCache) {
        return memoComparatorBuilderWithSkip(getId);
    }

    return defaultMemoComparatorBuilder(getId);
};

const defaultMemoComparatorBuilder = <TItem, TId>(
    getId: (item: TItem) => TId,
): ItemsComparatorBuilder<TItem> => {
    const cache = new Map();
    return (comparator) =>
        (a: TItem, b: TItem,) => {
            const id = getId(b);
            if (!cache.has(id)) {
                cache.set(id, b);
            }

            return comparator(a, cache.get(id));
        };
};

const memoComparatorBuilderWithSkip = <TItem, TId>(
    getId: (item: TItem) => TId,
): ItemsComparatorBuilder<TItem> => {
    const cache = new Map();
    return (comparator, shouldApplyComparator) =>
        (a: TItem, b: TItem, zeroIfNotInCache = true) => {
            if (shouldApplyComparator && !shouldApplyComparator(b)) {
                return 0;
            }

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
