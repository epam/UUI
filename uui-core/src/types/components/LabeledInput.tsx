import { ICanBeInvalid, ICanBeRequired, IHasChildren, IHasCX, IHasLabel, IHasRawProps, IHasForwardedRef } from '../props';

export interface LabeledInputCoreProps
    extends ICanBeInvalid,
        IHasCX,
        IHasLabel,
        IHasChildren,
        ICanBeRequired,
        IHasRawProps<React.HTMLAttributes<HTMLDivElement>>,
        IHasForwardedRef<HTMLDivElement> {
    /** Position of the label, relative to the wrapped component (top of left) */
    labelPosition?: 'top' | 'left';
    /** Info hint text to show in tooltip */
    info?: string;
    /** Marks related field as optional */
    isOptional?: boolean;
    /** HTML 'for' tag to bind the label to a component.
     * Can be used when component can't be wrapped by the LabeledInput, e.g. when form is layed out as table with labels and inputs placed into different columns
     */
    htmlFor?: string;
}
