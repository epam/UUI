interface ForEachOptions {
    on?: 'patch' | 'original' | 'all';
}

export class ItemsMap<TId, TItem> {
    private _itemsMap: Map<TId, TItem>;
    private _dirtyItemsMap: Map<TId, TItem>;

    constructor(
        itemsMap: Map<TId, TItem>,
        dirtyItemsMap: Map<TId, TItem>,
    ) {
        this._itemsMap = new Map(itemsMap);
        this._dirtyItemsMap = new Map(dirtyItemsMap);
    }

    get(id: TId) {
        if (this._dirtyItemsMap.has(id)) {
            return this._dirtyItemsMap.get(id);
        }

        return this._itemsMap.has(id) ? this._itemsMap.get(id) : undefined;
    }

    has(id: TId) {
        return this._dirtyItemsMap.has(id) || this._itemsMap.has(id);
    }

    forEach(action: (item: TItem, id: TId) => void, options: ForEachOptions = { on: 'all' }) {
        if (options.on === 'original') {
            const keys = new Set(this._itemsMap.keys());
            keys.forEach((id) => {
                action(this._itemsMap.get(id), id);
            });
            return;
        }

        if (options.on === 'patch') {
            const keys = new Set(this._dirtyItemsMap.keys());
            keys.forEach((id) => {
                action(this._dirtyItemsMap.get(id), id);
            });
            return;
        }

        const keys = new Set([...this._itemsMap.keys(), ...this._dirtyItemsMap.keys()]);
        keys.forEach((id) => {
            action(this.get(id), id);
        });
    }
}
