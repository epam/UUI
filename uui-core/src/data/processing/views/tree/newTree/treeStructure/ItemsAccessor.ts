import { ItemsMap } from '../../ItemsMap';
import { NOT_FOUND_RECORD } from '../constants';

export class ItemsAccessor<TItem, TId> {
    constructor(
        private itemsMap: ItemsMap<TId, TItem>,
    ) {}

    get = (id: TId) =>
        this.itemsMap.has(id) ? this.itemsMap.get(id) : NOT_FOUND_RECORD;

    public static toItemsAccessor<TId, TItem>(itemsMap: ItemsMap<TId, TItem>) {
        return new ItemsAccessor(itemsMap);
    }
}
