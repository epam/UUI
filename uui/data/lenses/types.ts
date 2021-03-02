import { ICanBeInvalid, IEditable } from '../../types';

export type ArrayElement<ArrayType> = ArrayType extends (infer ElementType)[] ? ElementType : never;

export interface ILens<TFocused> {
    get(): TFocused;
    set(value: TFocused): void;
    update(fn: (current: TFocused) => TFocused): void;   
    prop<K extends keyof TFocused>(name: K): ILens<TFocused[K]>;
    index(index: number): ILens<ArrayElement<TFocused>>;
    onChange(fn: (oldValue: TFocused, newValue: TFocused) => TFocused): ILens<TFocused>;
    default(value: TFocused): ILens<TFocused>;
    toProps(): IEditable<TFocused>;
}