import { ICanBeInvalid, ICanBeRequired, IHasChildren, IHasCX, IHasLabel, IHasRawProps, IHasForwardedRef } from "../props";

export interface LabeledInputCoreProps extends ICanBeInvalid, IHasCX, IHasLabel, IHasChildren, ICanBeRequired, IHasRawProps<HTMLDivElement>, IHasForwardedRef<HTMLDivElement> {
    labelPosition?: 'top' | 'left';
    info?: string;
    isOptional?: boolean;
    htmlFor?: string;
}