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
            const aId = getId(a);
            const bId = getId(b);
            const hasAInCache = cache.has(aId);
            const hasBInCache = cache.has(bId);

            if (!hasAInCache && !hasBInCache && zeroIfNotInCache) {
                return 0;
            }

            !hasAInCache && cache.set(aId, a);
            !hasBInCache && cache.set(bId, b);

            if (shouldApplyComparator && !shouldApplyComparator(a) && !shouldApplyComparator(b)) {
                return 0;
            }

            return comparator(hasAInCache ? cache.get(aId) : a, hasBInCache ? cache.get(bId) : b);
        };
};
