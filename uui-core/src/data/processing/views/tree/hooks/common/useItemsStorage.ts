import { useEffect, useMemo, useState } from 'react';
import { ItemsStorage } from '../../../..';
import { ItemsMapParams } from '../../ItemsMap';
import { SharedItemsState } from '../strategies/types';

export interface UseItemsStorageProps<TItem, TId> extends SharedItemsState<TItem, TId> {
    items?: TItem[];
    params: ItemsMapParams<TItem, TId>;
}

export function useItemsStorage<TItem, TId>({ itemsMap: outerItemsMap, setItems, items, params }: UseItemsStorageProps<TItem, TId>) {
    const itemsStorage = useMemo(() => {
        if (!outerItemsMap) {
            return new ItemsStorage({ items, params });
        }
        return null;
    }, [outerItemsMap, items]);

    const [itemsMap, setItemsMap] = useState(outerItemsMap ?? itemsStorage?.getItemsMap());

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
            }
            setItems?.(items);
        }
    }, [items]);

    const currentItemsMap = outerItemsMap ?? itemsMap;
    return {
        itemsMap: currentItemsMap,
        setItems: setItems ?? (itemsStorage?.setItems ?? currentItemsMap.setItems),
    };
}
