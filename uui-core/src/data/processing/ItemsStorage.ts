import { ItemsMap, OnUpdate } from './ItemsMap';

export interface ModificationOptions {
    isDirty?: boolean;
    reset?: boolean;
}

interface ItemsStorageParams<TItem, TId> {
    items?: TItem[];
    getId: (item: TItem) => TId;
}

export class ItemsStorage<TItem, TId> {
    private subs: Map<OnUpdate<TId, TItem>, void> = new Map();
    private _itemsMap: ItemsMap<TId, TItem>;

    constructor({ items, getId }: ItemsStorageParams<TItem, TId>) {
        this._itemsMap = new ItemsMap(
            null,
            getId,
        );
        if (items?.length) {
            this.setItems(items);
        }
    }

    subscribe(onUpdate: OnUpdate<TId, TItem>) {
        this.subs.set(onUpdate);

        return () => this.subs.delete(onUpdate);
    }

    setItems = (items: TItem[], options?: ModificationOptions) => {
        return this._itemsMap.setItems(items, options);
    };

    onUpdate = (newItemsMap: ItemsMap<TId, TItem>) => {
        this._itemsMap = newItemsMap;
        this.subs.forEach((_, onUpdate) => onUpdate(newItemsMap));
    };

    public getItemsMap() {
        return this._itemsMap;
    }
}
