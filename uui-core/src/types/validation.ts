import { IImmutableMap, IMap } from './objects';
import { ICanBeReadonly, ICanBeRequired, IDisableable } from './props';

type ElementType<ArrayOrObject> = ArrayOrObject extends readonly (infer ArrayType)[]
    ? ArrayType
    : ArrayOrObject extends IMap<any, infer ValueType>
        ? ValueType
        : ArrayOrObject extends IImmutableMap<any, infer ValueType>
            ? ValueType
            : ArrayOrObject extends Record<any, infer ValueType>
                ? ValueType
                : never;

export interface Metadata<T> extends IDisableable, ICanBeReadonly, ICanBeRequired {
    /** Metadata for the nested fields */
    props?: {
        [P in keyof T]?: Metadata<T[P]>;
    };
    /**
     * Metadata for all fields of current level of object.
     * Usually used for consistent validation of arrays.
     */
    all?: Metadata<ElementType<T>>;
    /** Defines minimal value to pass the validation */
    minValue?: number;
    /** Defines maximal value to pass the validation */
    maxValue?: number;
    /** Defines maximal length of the string to pass the validation */
    maxLength?: number;
    /** Array of your custom validators.
     * Validator is a pure function that accept value and should return error message if this field is invalid.
     * If validators provided, all other metadata options(e.g. isRequired, maxLength) will be ignored.
     * */
    validators?: CustomValidator<T>[];
}

type CustomValidator<T> = (value: T, ...parentValues: any[]) => (string | boolean)[];
