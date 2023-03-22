import { ITree } from "../data";
import { IMap } from "./objects";
import { ICanBeReadonly, ICanBeRequired, IDisableable } from "./props";

type ElementType<Store> =
    Store extends readonly (infer ElementType)[]
    ? ElementType
    : Store extends ITree<infer MapElementType, infer TId, infer TSubtotals>
    ? MapElementType
    : Store extends Record<any, (infer ValueType)>
    ? ValueType
    : never;

export interface Metadata<T> extends IDisableable, ICanBeReadonly, ICanBeRequired {
    props?: {
        [P in keyof T]?: Metadata<T[P]>
    };
    all?: Metadata<ElementType<T>>;
    minValue?: number;
    maxValue?: number;
    maxLength?: number;
    validators?: CustomValidator<T>[];
}

type CustomValidator<T> = (value: T, ...parentValues: any[]) => (string | boolean)[];