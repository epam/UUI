import { useEffect, useMemo, useState } from 'react';
import { ItemsStorage, ItemsMap } from '../../../../../processing';

export interface UseItemsStorageProps<TItem, TId> {
    itemsMap?: ItemsMap<TId, TItem>;
    setItems?: ItemsStorage<TItem, TId>['setItems'];

    items?: TItem[];
    getId: (item: TItem) => TId;

}

export function useItemsStorage<TItem, TId>({ itemsMap: outerItemsMap, setItems, items, getId }: UseItemsStorageProps<TItem, TId>) {
    const [itemsMap, setItemsMap] = useState(outerItemsMap);

    const itemsStorage = useMemo(() => {
        if (!outerItemsMap) {
            return new ItemsStorage({ items, getId });
        }
        return null;
    }, [outerItemsMap]);

    useEffect(() => {
        if (itemsStorage) {
            const unsubscribe = itemsStorage.subscribe(() => {
                setItemsMap(itemsStorage.itemsMap);
            });

            return () => {
                unsubscribe();
            };
        }
    }, []);

    return {
        itemsMap: outerItemsMap ?? itemsMap,
        setItems: setItems ?? itemsStorage.setItems,
    };
}
