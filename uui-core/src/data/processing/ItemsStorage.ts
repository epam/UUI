import { ItemsMap } from './ItemsMap';

type OnUpdate<TItem> = (items: TItem[], options: ModificationOptions) => void;

interface ModificationOptions {
    isDirty?: boolean;
    reset?: boolean;
}

interface ItemsStorageParams<TItem, TId> {
    items?: TItem[];
    getId: (item: TItem) => TId;
}

export class ItemsStorage<TItem, TId> {
    private getId: (item: TItem) => TId;
    private subs: Map<OnUpdate<TItem>, void> = new Map();
    private _dirtyItems: Map<TId, TItem> = new Map();
    private _originalItems: Map<TId, TItem> = new Map();

    private _itemsMap: ItemsMap<TId, TItem> = new ItemsMap(this._originalItems, this._dirtyItems);

    constructor({ items, getId }: ItemsStorageParams<TItem, TId>) {
        this.getId = getId;

        if (items?.length) {
            this.setItems(items);
        }
    }

    subscribe(onUpdate: OnUpdate<TItem>) {
        this.subs.set(onUpdate);

        return () => this.subs.delete(onUpdate);
    }

    setItems = (items: TItem[], options?: ModificationOptions) => {
        if (options.reset) {
            this._dirtyItems = new Map(this._dirtyItems);
            this._dirtyItems.clear();

            this._originalItems = new Map(this._originalItems);
            this._originalItems.clear();
        }

        const itemsLink = options?.isDirty ? this._dirtyItems : this._originalItems;

        items.forEach((item) => {
            itemsLink.set(this.getId(item), item);
        });

        this._itemsMap = new ItemsMap(this._originalItems, this._dirtyItems);

        this.subs.forEach((_, onUpdate) => onUpdate(items, options));

        return this._itemsMap;
    };

    get itemsMap() {
        return this._itemsMap;
    }
}
