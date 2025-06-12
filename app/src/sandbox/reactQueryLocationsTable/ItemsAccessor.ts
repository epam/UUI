import { IMap, IItemsAccessor, NOT_FOUND_RECORD } from '@epam/uui-core';

export class ItemsAccessor<TItem, TId> implements IItemsAccessor<TItem, TId> {
    constructor(private readonly itemsMap: IMap<TId, TItem>) {}

    public get(id: TId) {
        if (this.itemsMap.has(id)) {
            return this.itemsMap.get(id);
        }

        return NOT_FOUND_RECORD;
    }

    forEach(action: (item: TItem, id: TId) => void) {
        for (const [id, item] of this.itemsMap) {
            action(item, id);
        }
    }
}
