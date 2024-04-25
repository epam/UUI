import { useMemo } from 'react';
import { ItemsMap } from '../../ItemsMap';
import { TreeState } from '../../treeState';

interface UseActualItemsMapProps<TItem, TId> {
    tree: TreeState<TItem, TId>;
    itemsMap: ItemsMap<TId, TItem>;
}

export function useActualItemsMap<TItem, TId>({
    tree, itemsMap,
}: UseActualItemsMapProps<TItem, TId>) {
    return useMemo(() => {
        // if clear cache was executed, itemsMap should not be rewritten.
        if (!itemsMap.size) {
            return tree;
        }

        return tree.updateItemsMap(itemsMap);
    }, [tree, itemsMap]);
}
