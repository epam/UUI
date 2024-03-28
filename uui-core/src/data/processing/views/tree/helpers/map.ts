import { IImmutableMap, IMap } from '../../../../../types';
import { ITreeParams } from '../treeStructure/types';

export function cloneMap<T extends IMap<any, any> | IImmutableMap<any, any>>(map: T): T extends IMap<infer TKey, infer TValue>
    ? IMap<TKey, TValue>
    : T extends IImmutableMap<infer TKey, infer TValue>
        ? IImmutableMap<TKey, TValue> : never {
    return new (map.constructor as any)(map);
}

export function newMap<TKey, TValue>(params: Partial<ITreeParams<any, any>>) {
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

    public get(key: TKey): TValue | undefined {
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
