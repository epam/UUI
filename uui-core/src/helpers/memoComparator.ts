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
            const aId = getId(a);
            if (!cache.has(aId)) {
                cache.set(aId, a);
            }

            const bId = getId(b);
            if (!cache.has(bId)) {
                cache.set(bId, b);
            }

            return comparator(cache.get(aId), cache.get(bId));
        };
};

const memoComparatorBuilderWithSkip = <TItem, TId>(
    getId: (item: TItem) => TId,
): ItemsComparatorBuilder<TItem> => {
    const cache = new Map();
    return (comparator, shouldApplyComparator) =>
        (a: TItem, b: TItem, zeroIfNotInCache = true) => {
            const id = getId(b);
            if (!cache.has(id)) {
                if (zeroIfNotInCache) {
                    return 0;
                }
                cache.set(id, b);
            }

            if (shouldApplyComparator && !shouldApplyComparator(b)) {
                return 0;
            }

            return comparator(a, cache.get(id));
        };
};
