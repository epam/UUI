import { ItemsMap } from './ItemsMap';
import { NOT_FOUND_RECORD } from './constants';
import { IItemsAccessor } from './treeStructure/types';

export class ItemsAccessor<TItem, TId> implements IItemsAccessor<TItem, TId> {
    constructor(
        private itemsMap: ItemsMap<TId, TItem>,
    ) {}

    get = (id: TId) =>
        this.itemsMap.has(id) ? this.itemsMap.get(id) : NOT_FOUND_RECORD;

    forEach(action: (item: TItem, id: TId) => void): void {
        this.itemsMap.forEach(action);
    }

    public static toItemsAccessor<TId, TItem>(itemsMap: ItemsMap<TId, TItem>) {
        return new ItemsAccessor(itemsMap);
    }
}
