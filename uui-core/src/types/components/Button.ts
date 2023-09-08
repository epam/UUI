import * as React from 'react';
import { ICanRedirect, IClickable, IDisableable, IHasCaption, IHasCX, IHasIcon, IAnalyticableClick, IHasTabIndex, IHasRawProps } from '../props';
import { IBasicPickerToggler, IDropdownToggler } from '../pickers';
import { Icon } from '../objects';

export interface ButtonBaseCoreProps extends IHasCX, IClickable, ICanRedirect, IDisableable, IHasIcon, IAnalyticableClick, IHasTabIndex,
    IHasRawProps<React.ButtonHTMLAttributes<HTMLButtonElement>> {}

export interface ButtonCoreProps extends ButtonBaseCoreProps, IHasCaption, IBasicPickerToggler, IDropdownToggler {
    /** Icon for drop-down toggler */
    dropdownIcon?: Icon;

    /** Position of the dropdown icon ('left' of 'right') */
    dropdownIconPosition?: 'left' | 'right';

    countPosition?: 'left' | 'right';
    count?: number | React.ReactNode;
}

export interface ButtonSemanticProps {
    type?: 'success' | 'cancel' | 'action';
}
