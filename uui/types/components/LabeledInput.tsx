import { ICanBeInvalid, ICanBeRequired, IHasChildren, IHasCX, IHasLabel, IHasRawProps } from "../props";

export interface LabeledInputCoreProps extends ICanBeInvalid, IHasCX, IHasLabel, IHasChildren, ICanBeRequired, IHasRawProps<HTMLLabelElement> {
    labelPosition?: 'top' | 'left';
    info?: string;
    isOptional?: boolean;
}