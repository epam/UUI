import { useMemo } from 'react';
import { ItemsMap } from '../../ItemsMap';
import { TreeState } from '../../treeState';
import { ItemsStorage } from '../../ItemsStorage';

interface UseActualItemsStorageProps<TItem, TId> {
    tree: TreeState<TItem, TId>;
    itemsMap: ItemsMap<TId, TItem>;
    setItems: ItemsStorage<TItem, TId>['setItems'];
}

export function useActualItemsStorage<TItem, TId>({
    tree, itemsMap, setItems,
}: UseActualItemsStorageProps<TItem, TId>) {
    return useMemo(() => {
        const updatedTree = tree.updateSetItems(setItems);
        // if clear cache was executed, itemsMap should not be rewritten.
        if (!itemsMap.size) {
            return updatedTree;
        }

        return updatedTree.updateItemsMap(itemsMap);
    }, [tree, itemsMap, setItems]);
}
