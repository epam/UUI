import { IEditable } from '../../types';
import * as Impl from './lensesImpl';
import { ILensImpl } from './lensesImpl';
import { ILens, ArrayElement, IMapElement } from './types';

export class LensBuilder<TRoot = any, TFocused = any> implements ILens<TFocused> {
    public readonly handleValueChange: (newValue: TFocused) => void = null;
    constructor(public readonly lens: ILensImpl<TRoot, TFocused>) {
        this.handleValueChange = (newValue: TFocused) => {
            this.lens.set(null, newValue);
        };
    }

    public get(): TFocused {
        return this.lens.get(null);
    }

    public key<TId>(id: TId): LensBuilder<TRoot, IMapElement<TFocused>> {
        return this.compose(Impl.key(id) as any, id);
    }

    public set(value: TFocused) {
        this.lens.set(null, value);
    }

    public update(fn: (current: TFocused) => TFocused) {
        this.lens.set(null, fn(this.lens.get(null)));
    }

    public static MAX_CACHE_SIZE = 1000;
    private cache = new Map();
    public compose<TSmall>(lens: ILensImpl<TFocused, TSmall>, cacheKey?: any): LensBuilder<TRoot, TSmall> {
        if (cacheKey != null && this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        const result = new LensBuilder(Impl.compose(this.lens, lens));

        if (cacheKey != null) {
            this.cache.set(cacheKey, result);
        }

        if (this.cache.size > LensBuilder.MAX_CACHE_SIZE) {
            const { value } = this.cache.keys().next();
            this.cache.delete(value);
        }

        return result;
    }

    public prop<K extends keyof TFocused>(name: K): LensBuilder<TRoot, NonNullable<TFocused[K]>> {
        return this.compose(Impl.prop(name), name) as any;
    }

    public index(index: number): LensBuilder<TRoot, ArrayElement<TFocused>> {
        return this.compose(Impl.index(index) as any, index);
    }

    public onChange(fn: (oldValue: TFocused, newValue: TFocused) => TFocused): LensBuilder<TRoot, TFocused> {
        return this.compose({
            get: (i) => i, set: fn, getValidationState: this.lens.getValidationState, getMetadata: this.lens.getMetadata as any,
        }, fn);
    }

    public default(value: TFocused): LensBuilder<TRoot, TFocused> {
        return this.compose(Impl.defaultValue(value), value);
    }

    public toProps(): IEditable<TFocused> {
        const validationState = this.lens.getValidationState && this.lens.getValidationState(null);
        const metadata = this.lens.getMetadata && this.lens.getMetadata(null);
        return {
            value: this.lens.get(null),
            onValueChange: this.handleValueChange,
            ...validationState,
            ...metadata,
        };
    }

    // pick<K extends keyof TFocused>(...keys: K[]): IEditable<Pick<TFocused, K>> {
    //     throw "Not implemented";
    // }
}
