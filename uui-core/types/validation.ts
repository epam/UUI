import { ICanBeReadonly, ICanBeRequired, IDisableable} from "./props";

export interface Metadata<T> extends IDisableable, ICanBeReadonly, ICanBeRequired {
    props?: {
        [P in keyof T]?: Metadata<T[P]>
    };
    all?: Metadata<any>;
    minValue?: number;
    maxValue?: number;
    maxLength?: number;
    validators?: CustomValidator<T>[];
}

type CustomValidator<T> = (value: T, ...parentValues: any[]) => (string | boolean)[];