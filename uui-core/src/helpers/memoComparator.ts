import { ItemsComparator } from "../data";

export const memoComparator = <TItem, TId>(
    comparator: ItemsComparator<TItem>,
    getId: (item: TItem) => TId,
) => {
    const cache = new Map();
    return (newItem: TItem, existingItem: TItem) => {
        const id = getId(newItem);
        if (!cache.has(id)) {
            cache.set(id, newItem);
        }

        return comparator(cache.get(id), existingItem);
    };
};
