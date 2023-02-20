import * as React from 'react';
import {
    ICanBeInvalid,
    ICanBeReadonly,
    ICheckable,
    IHasCX,
    IHasLabel,
    IAnalyticableOnChange,
    IHasRawProps,
    IHasForwardedRef,
    ICanFocus,
} from '../props';

export interface CheckboxCoreProps
    extends ICheckable,
        ICanFocus<HTMLInputElement>,
        IHasCX,
        ICanBeInvalid,
        IHasLabel,
        ICanBeReadonly,
        IAnalyticableOnChange<boolean>,
        IHasRawProps<React.LabelHTMLAttributes<HTMLLabelElement>>,
        IHasForwardedRef<HTMLLabelElement> {}
