import { IEditable } from '../../types';
import { ITree } from '../processing';

export type ArrayElement<ArrayType> = ArrayType extends (infer ElementType)[] ? ElementType : never;
export type TreeElement<TTree> = TTree extends ITree<infer TItem, infer TId> ? TItem : never;
export type TreeId<TTree> = TTree extends ITree<infer TItem, infer TId> ? TId : never;

export interface ILens<TFocused> {
    get(): TFocused;
    set(value: TFocused): void;
    update(fn: (current: TFocused) => TFocused): void;
    prop<K extends keyof TFocused>(name: K): ILens<NonNullable<TFocused[K]>>;
    index(index: number): ILens<ArrayElement<TFocused>>;
    getById(id: TreeId<TFocused>): ILens<TreeElement<TFocused>>;
    onChange(fn: (oldValue: TFocused, newValue: TFocused) => TFocused): ILens<TFocused>;
    default(value: TFocused): ILens<TFocused>;
    toProps(): IEditable<TFocused>;
}