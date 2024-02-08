import { IMap } from '../../../../../../../types';
import { TreeParams } from '../types';

export function cloneMap<TKey, TValue>(map: IMap<TKey, TValue>) {
    return new (map.constructor as any)(map) as IMap<TKey, TValue>;
}

export function newMap<TKey, TValue>(params: Partial<TreeParams<any, any>>) {
    if (params.complexIds) {
        return new CompositeKeysMap<TKey, TValue>();
    } else {
        return new Map<TKey, TValue>();
    }
}

export class CompositeKeysMap<TKey, TValue> implements IMap<TKey, TValue> {
    map: Map<string, TValue>;
    constructor(original?: CompositeKeysMap<TKey, TValue>) {
        if (original) {
            this.map = new Map(original.map);
        } else {
            this.map = new Map();
        }
    }

    private keyToString(key: TKey) {
        return key === undefined ? undefined : JSON.stringify(key);
    }

    public get(key: TKey) {
        return this.map.get(this.keyToString(key));
    }

    public set(key: TKey, value: TValue) {
        this.map.set(this.keyToString(key), value);
        return this;
    }

    public delete(key: TKey) {
        return this.map.delete(this.keyToString(key));
    }

    * [Symbol.iterator](): IterableIterator<[TKey, TValue]> {
        for (const [key, value] of this.map) {
            yield [key !== undefined ? JSON.parse(key) : undefined, value];
        }
    }

    public has(key: TKey) {
        return this.map.has(this.keyToString(key));
    }

    get size() {
        return this.map.size;
    }
}
