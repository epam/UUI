import { ICanBeInvalid, ICanBeRequired, IHasChildren, IHasCX, IHasLabel, IHasRawProps, IHasValidationMessage } from '../props';
import { ReactNode } from 'react';

export interface LabeledInputCoreProps
    extends ICanBeInvalid,
    IHasCX,
    IHasLabel,
    IHasChildren,
    ICanBeRequired,
    IHasValidationMessage,
    IHasRawProps<React.HTMLAttributes<HTMLDivElement>> {
    /** Position of the label, relative to the wrapped component (top of left) */
    labelPosition?: 'top' | 'left';
    /** Info hint text to show in tooltip */
    info?: ReactNode;
    /** Marks related field as optional */
    isOptional?: boolean;
    /** HTML 'for' tag to bind the label to a component.
     * Can be used when component can't be wrapped by the LabeledInput, e.g. when form is layed out as table with labels and inputs placed into different columns
     */
    htmlFor?: string;
    /** A value from LabeledInput children */
    value?: any;
    /** Maximum text length, in characters */
    maxLength?: number;
    /** Showing current text length, in characters and maxLength */
    charCounter?: boolean
    /** Additional info positioned at the bottom of LabeledInput */
    footnote?: ReactNode;
    /** Additional info positioned to the right side of label */
    sidenote?: ReactNode;
}
