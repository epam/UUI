import { IEditable } from '../../types';
import { ItemsMap } from '../processing';

export type ArrayElement<ArrayType> = ArrayType extends (infer ElementType)[] ? ElementType : never;
export type ItemsMapElement<MapType> = MapType extends ItemsMap<any, infer Item> ? Item : never;

export interface ILens<TFocused> {
    /** Get lens value */
    get(): TFocused;
    getItem<TId>(id: TId): ILens<NonNullable<ItemsMapElement<TFocused>>>;

    /** Set new lens value */
    set(value: TFocused): void;
    /** Updates lens value with returned value from provided callback.
     *  This callback received current lens value as a param
     *  */
    update(fn: (current: TFocused) => TFocused): void;
    /** Return a new lens on the provided field name */
    prop<K extends keyof TFocused>(name: K): ILens<NonNullable<TFocused[K]>>;

    /** Return a new lens on item of array by provided index */
    index(index: number): ILens<ArrayElement<TFocused>>;
    /** Add to the lens a setter callback, which received old and new value and should return new value for set.
     * This callback will be called on any lens update
     * */
    onChange(fn: (oldValue: TFocused, newValue: TFocused) => TFocused): ILens<TFocused>;
    /** Defines default lens value, which will be return in case of lens have 'null' or 'undefined' value */
    default(value: TFocused): ILens<TFocused>;
    /** Return IEditable interface, which accepted by UUI form components.
     * Usually you just need to spread it to the component, e.g. { ...lens.prop('name').toProps() }  */
    toProps(): IEditable<TFocused>;
}
