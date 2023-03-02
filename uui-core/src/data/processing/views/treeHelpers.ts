import { IMap } from "../../../types";
import { CompositeKeysMap } from "./CompositeKeysMap";

export interface TreeParams<TItem, TId> {
    getId?(item: TItem): TId;
    getParentId?(item: TItem): TId | undefined;
    complexIds?: boolean;
}

export function newMap<TKey, TValue>(params: TreeParams<any, any>) {
    if (params.complexIds) {
        return new CompositeKeysMap<TKey, TValue>();
    } else {
        return new Map<TKey, TValue>();
    }
}

export const deleteFromList = <TId>(id: TId, list: TId[]) => {
    const foundIndex = list.findIndex((childId) => childId === id);
    if (foundIndex !== -1) {
        list.splice(foundIndex, 1);
    }

    return list;
};

const pasteNewItemIntoList = <TItem, TId>(
    id: TId,
    newItem: TItem,
    byId: IMap<TId, TItem>,
    list: TId[],
    comparator: (newItem: TItem, existingItem: TItem) => number,
) => {
    const listWithNewItem: TId[] = [];
    list.forEach((itemId) => {
        const comparisonResult = comparator(newItem, byId.get(itemId));
        if (comparisonResult === 1) {
            const foundIndex = listWithNewItem.findIndex((itemId) => itemId === id);
            if (foundIndex !== -1) {
                listWithNewItem.splice(foundIndex, 1);
            }

            listWithNewItem.push(itemId, id);
        } else {
            const foundIndex = listWithNewItem.findIndex((childId) => childId === id);
            listWithNewItem.push(...(foundIndex === -1 ? [id, itemId] : [itemId]));
        }
    });

    return listWithNewItem;
};

export const patchList = <TItem, TId>(
    list: TId[] | undefined,
    { getId, getParentId }: { getId: (item: TItem) => TId, getParentId: (item: TItem) => TId },
    { existingItem, newItem }: { existingItem: TItem | undefined, newItem: TItem },
    { byId, byParentId }: { byId: IMap<TId, TItem>, byParentId: IMap<TId, TId[]> },
    comparator: (newItem: TItem, existingItem: TItem) => number,
) => {
    const id = getId(newItem);
    const parentId = getParentId(newItem);
    if (!list || list === byParentId.get(parentId)) {
        list = list ? [...list] : [];
    }

    if (!existingItem && comparator) {
        return pasteNewItemIntoList(id, newItem, byId, list, comparator);
    }

    return [...list, id];
};
