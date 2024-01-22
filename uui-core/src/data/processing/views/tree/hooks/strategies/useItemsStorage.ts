import { useEffect, useMemo, useState } from 'react';
import { ItemsStorage, ItemsMap, PureTreeState } from '../../../../../processing';
import { ConvertableTreeState, TreeState } from '../../newTree';

export interface UseItemsStorageProps<TItem, TId> {
    itemsMap?: ItemsMap<TId, TItem>;
    setItems?: ItemsStorage<TItem, TId>['setItems'];

    items?: TItem[] | PureTreeState<TItem, TId> | TreeState<TItem, TId>;
    getId: (item: TItem) => TId;

}

export function useItemsStorage<TItem, TId>({ itemsMap: outerItemsMap, setItems, items, getId }: UseItemsStorageProps<TItem, TId>) {
    const treeOrItems = useMemo(
        // eslint-disable-next-line no-nested-ternary
        () => items instanceof TreeState
            ? items
            : items instanceof PureTreeState
                ? ConvertableTreeState.toTreeState(items)
                : items,
        [items],
    );
    const itemsStorage = useMemo(() => {
        if (!outerItemsMap && !(treeOrItems instanceof PureTreeState)) {
            return new ItemsStorage({ items: treeOrItems, getId });
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
