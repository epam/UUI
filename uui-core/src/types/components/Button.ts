import * as React from 'react';
import {
    ICanRedirect,
    IClickable,
    IDisableable,
    IHasCaption,
    IHasCX,
    IHasIcon,
    IHasPlaceholder,
    IAnalyticableClick,
    IHasTabIndex,
    IHasRawProps,
} from '../props';
import { IBasicPickerToggler, IDropdownToggler } from '../pickers';
import { Icon } from '../objects';

export interface ButtonBaseCoreProps
    extends IHasCX,
    IClickable,
    IDisableable,
    IHasIcon,
    IAnalyticableClick,
    IHasTabIndex {}

type ResolveRawProps<T> =
    T extends { href: string } | { link: any }
        ? IHasRawProps<React.AnchorHTMLAttributes<HTMLAnchorElement>>
        : IHasRawProps<React.ButtonHTMLAttributes<HTMLButtonElement>>;

export type ResolveICanRedirect<T> =
    T extends { href: string } | { link: any }
        ? ICanRedirect
        : {};

type ButtonBaseCorePropsWithRawProps<T> = ButtonBaseCoreProps & ResolveRawProps<T>;

interface ButtonSpecificCoreProps extends IHasCaption, IBasicPickerToggler, IDropdownToggler, IHasPlaceholder {

    /** Icon for drop-down toggler */
    dropdownIcon?: Icon;

    /** Position of the dropdown icon ('left' of 'right') */

    dropdownIconPosition?: 'left' | 'right';

    countPosition?: 'left' | 'right';

    count?: number | null;
}

export type ButtonCoreProps<T> = ButtonSpecificCoreProps & ButtonBaseCorePropsWithRawProps<T>;

export interface ButtonSemanticProps {
    type?: 'success' | 'cancel' | 'action';
}
