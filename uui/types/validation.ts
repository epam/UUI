import {ICanBeInvalid, ICanBeReadonly, ICanBeRequired, IDisableable} from "./props";

export interface Metadata<T> extends IDisableable, ICanBeReadonly, ICanBeRequired {
    props?: {
        [P in keyof T]?: Metadata<T[P]>
    };
    all?: Metadata<any>;
    minValue?: number;
    maxValue?: number;
    maxLength?: number;
    validators?: CustomValidator[];
}

export interface FormState<T> {
    form: T;
    validationState: ICanBeInvalid;
    serverValidationState: ICanBeInvalid;
    lastSentForm?: T;
    isChanged: boolean;
}

type CustomValidator = (value: any) => (string | boolean)[];