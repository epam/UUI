import { ItemsMap, OnUpdate } from './ItemsMap';

export interface ModificationOptions {
    isDirty?: boolean;
    reset?: boolean;
    on?: 'load' | 'patch'
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
        onUpdate(this._itemsMap);
        return () => this.subs.delete(onUpdate);
    }

    setItems = (items: TItem[], options?: ModificationOptions) => {
        const itemsMap = this._itemsMap.setItems(items, options);

        if (itemsMap !== this._itemsMap) {
            this._itemsMap = itemsMap;
            this.subs.forEach((_, onUpdate) => onUpdate(itemsMap));
        }

        return this._itemsMap;
    };

    public getItemsMap() {
        return this._itemsMap;
    }
}
