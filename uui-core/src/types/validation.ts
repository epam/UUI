import { ICanBeReadonly, ICanBeRequired, IDisableable } from './props';

type ElementType<ArrayOrObject> = ArrayOrObject extends readonly (infer ElementType)[]
    ? ElementType
    : ArrayOrObject extends Record<any, infer ValueType>
        ? ValueType
        : never;

export interface Metadata<T> extends IDisableable, ICanBeReadonly, ICanBeRequired {
    props?: {
        [P in keyof T]?: Metadata<T[P]>;
    };
    all?: Metadata<ElementType<T>>;
    minValue?: number;
    maxValue?: number;
    maxLength?: number;
    validators?: CustomValidator<T>[];
}

type CustomValidator<T> = (value: T, ...parentValues: any[]) => (string | boolean)[];
