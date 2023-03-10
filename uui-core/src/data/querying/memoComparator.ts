import { ItemsComparator } from "../processing";

export const memorizedComparator = <TItem, TId>(
    comparator: ItemsComparator<TItem>,
    getId: (item: TItem) => TId,
) => {
    const cache = new Map();
    return (existingItem: TItem, newItem: TItem, cacheIsAbsent?: boolean) => {
        const id = getId(newItem);
        if (!cache.has(id)) {
            if (!cacheIsAbsent) {
                return 0;
            }

            cache.set(id, newItem);
        }

        return comparator(cache.get(id), existingItem);
    };
};
