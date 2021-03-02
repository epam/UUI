import {ICanBeInvalid, ICanBeRequired, IHasChildren, IHasCX, IHasLabel} from "../props";

export interface LabeledInputCoreProps extends ICanBeInvalid, IHasCX, IHasLabel, IHasChildren, ICanBeRequired {
    labelPosition?: 'top' | 'left';
    info?: string;
    isOptional?: boolean;
}