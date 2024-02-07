import { ItemsMap, ItemsMapParams } from './ItemsMap';
import { IMap } from '../../../../types';
import { LOADED_RECORD, LOADING_RECORD, RecordStatus, cloneMap, newMap } from './newTree';

export type OnUpdate<TId, TItem> = (
    newItemsMap: ItemsMap<TId, TItem>,
    itemsStatusMap: IMap<TId, RecordStatus>,
) => void;

export interface ModificationOptions {
    isDirty?: boolean;
    reset?: boolean;
    on?: 'load' | 'patch'
}

interface ItemsStorageParams<TItem, TId> {
    items?: TItem[];
    params: ItemsMapParams<TItem, TId>;
}

export class ItemsStorage<TItem, TId> {
    private subs: Map<OnUpdate<TId, TItem>, void> = new Map();
    private _itemsMap: ItemsMap<TId, TItem>;
    private _itemsStatusMap: IMap<TId, RecordStatus>;
    private _params: ItemsMapParams<TItem, TId>;

    constructor({ items, params }: ItemsStorageParams<TItem, TId>) {
        this._params = params;
        this._itemsMap = new ItemsMap(null, params);
        this._itemsStatusMap = newMap(params);
        if (items?.length) {
            this.setItems(items);
        }
    }

    subscribe(onUpdate: OnUpdate<TId, TItem>) {
        this.subs.set(onUpdate);
        onUpdate(this._itemsMap, this._itemsStatusMap);
        return () => this.subs.delete(onUpdate);
    }

    setItems = (items: TItem[], options?: ModificationOptions) => {
        const itemsMap = this._itemsMap.setItems(items, options);
        let itemsStatusMap = this._itemsStatusMap;
        items.forEach((item) => {
            const id = this._params.getId(item);
            const currentStatus = itemsStatusMap.get(id);
            if (currentStatus === LOADING_RECORD) {
                itemsStatusMap = itemsStatusMap === this._itemsStatusMap
                    ? cloneMap(this._itemsStatusMap)
                    : itemsStatusMap;

                itemsStatusMap.set(id, LOADED_RECORD);
            }
        });

        if (itemsMap !== this._itemsMap || itemsStatusMap !== this._itemsStatusMap) {
            this._itemsMap = itemsMap;
            this._itemsStatusMap = itemsStatusMap;
            this.subs.forEach((_, onUpdate) => onUpdate(itemsMap, itemsStatusMap));
        }

        return { itemsMap: this._itemsMap, itemsStatusMap: this._itemsStatusMap };
    };

    public setLoadingStatus = (ids: TId[]) => {
        let itemsStatusMap = this._itemsStatusMap;
        ids.forEach((id) => {
            itemsStatusMap = itemsStatusMap === this._itemsStatusMap
                ? cloneMap(itemsStatusMap)
                : itemsStatusMap;

            itemsStatusMap.set(id, LOADING_RECORD);
        });
        if (itemsStatusMap !== this._itemsStatusMap) {
            this._itemsStatusMap = itemsStatusMap;
            this.subs.forEach((_, onUpdate) => onUpdate(this._itemsMap, itemsStatusMap));
        }
        return this._itemsStatusMap;
    };

    public getItemsMap() {
        return this._itemsMap;
    }

    public getItemsStatusMap() {
        return this._itemsStatusMap;
    }
}
