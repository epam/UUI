import { useEffect, useMemo, useState } from 'react';
import { ItemsStorage, ItemsMap } from '../../../../../processing';
import { TreeState } from '../../newTree';
import { ItemsMapParams } from '../../ItemsMap';

export interface UseItemsStorageProps<TItem, TId> {
    itemsMap?: ItemsMap<TId, TItem>;
    setItems?: ItemsStorage<TItem, TId>['setItems'];

    items?: TItem[] | TreeState<TItem, TId>;
    params: ItemsMapParams<TItem, TId>;
}

export function useItemsStorage<TItem, TId>({ itemsMap: outerItemsMap, setItems, items, params }: UseItemsStorageProps<TItem, TId>) {
    const treeOrItems = useMemo(
        () => items instanceof TreeState ? items : items,
        [items],
    );
    const itemsStorage = useMemo(() => {
        if (!outerItemsMap && !(treeOrItems instanceof TreeState)) {
            return new ItemsStorage({ items: treeOrItems, params });
        }
        return null;
    }, [outerItemsMap]);

    const [itemsMap, setItemsMap] = useState(outerItemsMap ?? (
        treeOrItems instanceof TreeState
            ? treeOrItems.itemsMap
            : itemsStorage.getItemsMap()
    ));

    useEffect(() => {
        if (itemsStorage) {
            const unsubscribe = itemsStorage.subscribe(() => {
                setItemsMap(itemsStorage.getItemsMap());
            });

            return () => {
                unsubscribe();
            };
        }
    }, []);

    useEffect(() => {
        if (Array.isArray(items)) {
            if (itemsStorage) {
                itemsStorage.setItems(items);
            } else {
                setItems(items);
            }
        }
    }, [items]);

    const currentItemsMap = outerItemsMap ?? itemsMap;
    return {
        itemsMap: currentItemsMap,
        setItems: setItems ?? (
            treeOrItems instanceof TreeState
                ? treeOrItems.setItems
                : itemsStorage?.setItems ?? currentItemsMap.setItems
        ),
    };
}
