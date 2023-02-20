import * as React from 'react';
import {
    IBasicPickerToggler,
    ICanRedirect,
    IClickable,
    IDisableable,
    IDropdownToggler,
    IHasCaption,
    IHasCX,
    IHasIcon,
    IHasPlaceholder,
    IAnalyticableClick,
    IHasTabIndex,
    IHasRawProps,
} from '../props';
import { Icon } from '../objects';

export interface ButtonBaseCoreProps
    extends IHasCX,
        IClickable,
        ICanRedirect,
        IDisableable,
        IHasIcon,
        IAnalyticableClick,
        IHasTabIndex,
        IHasRawProps<React.ButtonHTMLAttributes<HTMLButtonElement>> {}

export interface ButtonCoreProps extends ButtonBaseCoreProps, IHasCaption, IBasicPickerToggler, IDropdownToggler, IHasPlaceholder {
    /** Icon for drop-down toggler */
    dropdownIcon?: Icon;

    /** Position of the dropdown icon ('left' of 'right') */
    dropdownIconPosition?: 'left' | 'right';

    countPosition?: 'left' | 'right';
    count?: number | null;
}

export interface ButtonSemanticProps {
    type?: 'success' | 'cancel' | 'action';
}
