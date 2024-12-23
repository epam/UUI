import { IEditable, Metadata } from '../../types';
import * as Impl from './lensesImpl';
import { ILensImpl } from './lensesImpl';
import { ILens, ArrayElement, IMapElement, ValidationState } from './types';

export interface LensBuilderProps<T> {
    get(): T;
    set(update: (current: T) => T): void;
    getValidationState?(): ValidationState;
    getMetadata?(): Metadata<T>;
}
export class LensBuilder<TRoot = any, TFocused = any> implements ILens<TFocused> {
    constructor(
        private props: LensBuilderProps<TRoot>,
        private lens: ILensImpl<TRoot, TFocused> = Impl.identity() as any,
    ) {
    }

    public get(): TFocused {
        const big = this.props.get();
        return this.lens.get(big);
    }

    public set(newValue: TFocused) {
        this.props.set((current) => this.lens.set(current, newValue));
    }

    // onValueChange should be bound to 'this', as it is returned from .toProps() in a separate object
    private handleOnValueChange = (newValue: TFocused) => this.set(newValue);

    public update(fn: (current: TFocused) => TFocused) {
        this.props.set((currentRoot) => {
            const currentFocused = this.lens.get(currentRoot);
            const updatedFocused = fn(currentFocused);
            const updatedRoot = this.lens.set(currentRoot, updatedFocused);
            return updatedRoot;
        });
    }

    // We cache LensBuilder instances to not re-create handleOnValueChange, as it would break memoization
    // in React.memo-wrapped components, which is especially critical for DataTableRow.
    public static MAX_CACHE_SIZE = 1000;
    private cache = new Map();

    public compose<TSmall>(lens: ILensImpl<TFocused, TSmall>, cacheKey?: any): LensBuilder<TRoot, TSmall> {
        if (cacheKey != null && this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        const result = new LensBuilder(this.props, Impl.compose(this.lens, lens));

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

    public key<TId>(id: TId): LensBuilder<TRoot, IMapElement<TFocused>> {
        return this.compose(Impl.key(id) as any, id);
    }

    public index(index: number): LensBuilder<TRoot, ArrayElement<TFocused>> {
        return this.compose(Impl.index(index) as any, index);
    }

    public onChange(fn: (oldValue: TFocused, newValue: TFocused) => TFocused): LensBuilder<TRoot, TFocused> {
        return this.compose({
            get: (i) => i,
            set: fn,
            getValidationState: this.lens.getValidationState,
            getMetadata: this.lens.getMetadata as any,
        }, fn);
    }

    public default(value: TFocused): LensBuilder<TRoot, TFocused> {
        return this.compose(Impl.defaultValue(value), value);
    }

    public toProps(): IEditable<TFocused> {
        const rootValue = this.props.get();
        const rootValidationsState = this.props.getValidationState?.() ?? {};
        const rootMetadata = this.props.getMetadata?.() ?? {};
        const value = this.lens.get(rootValue);
        const validationState = this.lens.getValidationState && this.lens.getValidationState(rootValidationsState);
        const metadata = this.lens.getMetadata && this.lens.getMetadata(rootMetadata);
        return {
            value,
            onValueChange: this.handleOnValueChange,
            ...validationState,
            ...metadata,
        };
    }

    // pick<K extends keyof TFocused>(...keys: K[]): IEditable<Pick<TFocused, K>> {
    //     throw "Not implemented";
    // }
}
