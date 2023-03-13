import { useCallback, useMemo } from "react";
import { ItemsComparator } from "../../processing";

interface UseMemoComparatorProps<TItem, TId> {
    comparator: ItemsComparator<TItem>;
    getId: (item: TItem) => TId;
}

export const useMemoComparator = <TItem, TId>(
    { comparator, getId }: UseMemoComparatorProps<TItem, TId>,
    deps: any[],
) => {
    const cache = useMemo(() => new Map(), deps);
    const compare = useCallback((existingItem: TItem, newItem: TItem, cacheIsAbsent?: boolean) => {
        const id = getId(newItem);
        if (!cache.has(id)) {
            if (!cacheIsAbsent) {
                return 0;
            }

            cache.set(id, newItem);
        }

        return comparator(cache.get(id), existingItem);

    }, deps);
    console.log('cache', cache);
    console.log('deps', deps);
    return compare;
};
