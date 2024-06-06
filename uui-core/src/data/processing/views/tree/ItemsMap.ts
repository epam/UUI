import { IImmutableMap, IMap } from '../../../../types/objects';
import { cloneMap, newMap } from './helpers/map';

export interface ItemsMapParams<TItem, TId> {
    getId: (item: TItem) => TId;
    complexIds?: boolean;
}

export class ItemsMap<TId, TItem> implements IImmutableMap<TId, TItem> {
    private _itemsMap: IMap<TId, TItem>;
    private params: ItemsMapParams<TItem, TId>;

    constructor(
        itemsMap: IMap<TId, TItem>,
        params: ItemsMapParams<TItem, TId>,
    );

    constructor(itemsMap: ItemsMap<TId, TItem>);

    constructor(...args: [IMap<TId, TItem>, ItemsMapParams<TItem, TId>] | [ItemsMap<TId, TItem>]) {
        if (args.length === 1) {
            const [itemsMap] = args;
            this.params = itemsMap.params;
            this._itemsMap = cloneMap(itemsMap._itemsMap);
        } else {
            const [map, params] = args;
            this.params = params;
            this._itemsMap = map ? cloneMap(map) : newMap(params);
        }
    }

    get(id: TId) {
        return this._itemsMap.has(id) ? this._itemsMap.get(id) : undefined;
    }

    has(id: TId) {
        return this._itemsMap.has(id);
    }

    set(...args: [TId, TItem] | [TId]): ItemsMap<TId, TItem> {
        const [id, item] = args;
        let itemsMap = cloneMap(this._itemsMap);

        if (args.length > 1) {
            itemsMap.set(id, item);
        } else {
            itemsMap = itemsMap.set(id);
        }

        return new ItemsMap(itemsMap, this.params);
    }

    delete(id: TId) {
        const itemsMap = cloneMap(this._itemsMap);
        itemsMap.delete(id);
        return new ItemsMap(itemsMap, this.params);
    }

    forEach(action: (item: TItem, id: TId) => void) {
        for (const [id] of this._itemsMap) {
            action(this.get(id), id);
        }
    }

    clear() {
        return new ItemsMap(newMap<TId, TItem>(this.params), this.params);
    }

    setItems(items: TItem[]) {
        let updated = false;
        const itemsLink = cloneMap(this._itemsMap);

        items.forEach((item) => {
            const isExistingItem = itemsLink.has(this.params.getId(item));

            if (!isExistingItem || (isExistingItem && item !== itemsLink.get(this.params.getId(item)))) {
                itemsLink.set(this.params.getId(item), item);
                updated = true;
            }
        });

        if (updated) {
            return new ItemsMap(itemsLink, this.params);
        }

        return this;
    }

    get size() {
        return this._itemsMap.size;
    }

    [Symbol.iterator]() {
        return this._itemsMap[Symbol.iterator]();
    }

    public static fromObject<TId extends symbol | string | number, TItem>(
        obj: Record<TId, TItem>,
        params: ItemsMapParams<TItem, TId>,
    ) {
        const itemsMap = newMap<TId, TItem>(params);
        for (const [, value] of Object.entries<TItem>(obj)) {
            itemsMap.set(params.getId(value), value);
        }

        return new ItemsMap<TId, TItem>(itemsMap, params);
    }

    public static blank<TId, TItem>(
        params: ItemsMapParams<TItem, TId>,
    ) {
        return new ItemsMap<TId, TItem>(newMap<TId, TItem>(params), params);
    }
}
