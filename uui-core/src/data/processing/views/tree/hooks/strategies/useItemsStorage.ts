import { useEffect, useMemo, useState } from 'react';
import { IMap } from '../../../../../../types';
import { ItemsStorage, ItemsMap } from '../../../../../processing';
import { RecordStatus, TreeState } from '../../newTree';
import { ItemsMapParams } from '../../ItemsMap';

export interface UseItemsStorageProps<TItem, TId> {
    itemsMap?: ItemsMap<TId, TItem>;
    itemsStatusMap?: IMap<TId, RecordStatus>;
    setItems?: ItemsStorage<TItem, TId>['setItems'];
    setLoadingStatus?: ItemsStorage<TItem, TId>['setLoadingStatus'];

    items?: TItem[] | TreeState<TItem, TId>;
    params: ItemsMapParams<TItem, TId>;
}

export function useItemsStorage<TItem, TId>({
    itemsMap: outerItemsMap,
    itemsStatusMap: outerItemsStatusMap,
    setItems,
    setLoadingStatus,
    items,
    params,
}: UseItemsStorageProps<TItem, TId>) {
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
            : itemsStorage?.getItemsMap()
    ));

    const [itemsStatusMap, setItemsStatusMap] = useState(outerItemsStatusMap ?? (
        treeOrItems instanceof TreeState
            ? treeOrItems.itemsStatusMap
            : itemsStorage?.getItemsStatusMap()
    ));

    useEffect(() => {
        if (itemsStorage) {
            const unsubscribe = itemsStorage.subscribe((newItemsMap, newItemsStatusMap) => {
                if (itemsMap !== newItemsMap) {
                    setItemsMap(newItemsMap);
                }

                if (itemsStatusMap !== newItemsStatusMap) {
                    setItemsStatusMap(newItemsStatusMap);
                }
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
        itemsStatusMap: outerItemsStatusMap ?? itemsStatusMap,
        setLoadingStatus: setLoadingStatus ?? (
            treeOrItems instanceof TreeState
                ? treeOrItems.setLoadingStatus
                : itemsStorage?.setLoadingStatus
        ),
        setItems: setItems ?? (
            treeOrItems instanceof TreeState
                ? treeOrItems.setItems
                : itemsStorage.setItems
        ),
    };
}
