import { ItemsMap, ItemsMapParams } from './ItemsMap';

export type OnUpdate<TId, TItem> = (newItemsMap: ItemsMap<TId, TItem>) => void;

export interface ModificationOptions {
    reset?: boolean;
    on?: 'load' | 'patch'
}

export interface ItemsStorageParams<TItem, TId> {
    items?: TItem[];
    params: ItemsMapParams<TItem, TId>;
}

/**
 * Storage of items with subscriptions. Enables sharing loaded data between multiple consumers.
 * @internal For internal usage only. API can be changed in future releases.
 */
export class ItemsStorage<TItem, TId> {
    private subs: Map<OnUpdate<TId, TItem>, void> = new Map();
    private _itemsMap: ItemsMap<TId, TItem>;

    constructor({ items, params }: ItemsStorageParams<TItem, TId>) {
        this._itemsMap = new ItemsMap(
            null,
            params,
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
        const itemsMap = options?.reset
            ? this._itemsMap.clear().setItems(items)
            : this._itemsMap.setItems(items);

        if (itemsMap !== this._itemsMap) {
            this._itemsMap = itemsMap;
            this.subs.forEach((_, onUpdate) => onUpdate(itemsMap));
        }

        return this._itemsMap;
    };

    public getItemsMap = () => {
        return this._itemsMap;
    };
}
