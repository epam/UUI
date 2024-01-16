import { useEffect, useMemo, useState } from 'react';
import { ItemsStorage, ItemsMap, NewTree } from '../../../../../processing';

export interface UseItemsStorageProps<TItem, TId> {
    itemsMap?: ItemsMap<TId, TItem>;
    setItems?: ItemsStorage<TItem, TId>['setItems'];

    items?: TItem[] | NewTree<TItem, TId>;
    getId: (item: TItem) => TId;

}

export function useItemsStorage<TItem, TId>({ itemsMap: outerItemsMap, setItems, items, getId }: UseItemsStorageProps<TItem, TId>) {
    const itemsStorage = useMemo(() => {
        if (!outerItemsMap && !(items instanceof NewTree)) {
            return new ItemsStorage({ items, getId });
        }
        return null;
    }, [outerItemsMap]);

    const [itemsMap, setItemsMap] = useState(outerItemsMap ?? (items instanceof NewTree ? items.itemsMap : itemsStorage.getItemsMap()));

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

    const currentItemsMap = outerItemsMap ?? itemsMap;
    return {
        itemsMap: currentItemsMap,
        setItems: setItems ?? (items instanceof NewTree ? items.setItems : itemsStorage?.setItems ?? currentItemsMap.setItems),
    };
}
