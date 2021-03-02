import { IEditable, ICanBeInvalid } from "../../types";
import * as Impl from './lensesImpl';
import { ILensImpl } from './lensesImpl';
import { ILens, ArrayElement } from './types';

export class LensBuilder<TRoot = any, TFocused = any> implements ILens<TFocused> {
    public readonly handleValueChange: (newValue: TFocused) => void = null;

    constructor(
        public readonly lens: ILensImpl<TRoot, TFocused>,
    ) {
        this.handleValueChange = (newValue: TFocused) => {
            this.lens.set(null, newValue);
        };
    }

    public get(): TFocused {
        return this.lens.get(null);
    }

    public set(value: TFocused) {
        this.lens.set(null, value);
    }

    public update(fn: (current: TFocused) => TFocused) {
        this.lens.set(null, fn(this.lens.get(null)));
    }

    public compose<TSmall>(lens: ILensImpl<TFocused, TSmall>): LensBuilder<TRoot, TSmall> {
        return new LensBuilder(Impl.compose(this.lens, lens));
    }

    public prop<K extends keyof TFocused>(name: K): LensBuilder<TRoot, TFocused[K]> {
        return this.compose(Impl.prop(name));
    }

    public index(index: number): LensBuilder<TRoot, ArrayElement<TFocused>> {
        return this.compose(Impl.index(index) as any);
    }

    public onChange(fn: (oldValue: TFocused, newValue: TFocused) => TFocused): LensBuilder<TRoot, TFocused> {
        return this.compose({ get: i => i, set: fn, getValidationState: this.lens.getValidationState, getMetadata: this.lens.getMetadata as any });
    }

    public default(value: TFocused): LensBuilder<TRoot, TFocused> {
        return this.compose(Impl.defaultValue(value));
    }

    public toProps(): IEditable<TFocused> {
        let validationState = this.lens.getValidationState && this.lens.getValidationState(null);
        let metadata = this.lens.getMetadata && this.lens.getMetadata(null);
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