import { ItemsMap } from '../../ItemsMap';
import { IMap } from '../../../../../../types';
import { LOADING_RECORD, NOT_FOUND_RECORD, RecordStatus } from '../constants';
import { IItemsAccessor } from './types';

export class ItemsAccessor<TItem, TId> implements IItemsAccessor<TItem, TId> {
    constructor(
        private itemsMap: ItemsMap<TId, TItem>,
        private itemsStatusMap: IMap<TId, RecordStatus>,
    ) {}

    get(id: TId) {
        if (this.itemsMap.has(id)) {
            return this.itemsMap.get(id);
        }

        return this.itemsStatusMap?.get(id) === LOADING_RECORD
            ? LOADING_RECORD
            : NOT_FOUND_RECORD;
    }

    forEach(action: (item: TItem, id: TId) => void): void {
        this.itemsMap.forEach(action);
    }

    public static toItemsAccessor<TId, TItem>(itemsMap: ItemsMap<TId, TItem>, itemsStatusMap: IMap<TId, RecordStatus>) {
        return new ItemsAccessor(itemsMap, itemsStatusMap);
    }
}
