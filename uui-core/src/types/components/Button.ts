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
    IDropdownToggler,
} from '../props';
import { IBasicPickerToggler } from '../pickers';
import { Icon, Link } from '../objects';

export interface ButtonBaseCoreProps
    extends IHasCX,
    IClickable,
    IDisableable,
    IHasIcon,
    IAnalyticableClick,
    IHasTabIndex {}

export interface ButtonCoreProps extends ButtonBaseCoreProps, IHasCaption, IBasicPickerToggler, IDropdownToggler, IHasPlaceholder {
    /** Icon for drop-down toggler */
    dropdownIcon?: Icon;

    /** Position of the dropdown icon ('left' of 'right') */
    dropdownIconPosition?: 'left' | 'right';

    countPosition?: 'left' | 'right';
    count?: number | null;
}

type HrefButtonProps = ButtonCoreProps & {
    href: string | never;
    rawProps?: React.AnchorHTMLAttributes<HTMLAnchorElement>;
    link?: never;
};

type LinkObjectButtonProps = ButtonCoreProps & {
    link: Link;
    rawProps?: React.AnchorHTMLAttributes<HTMLAnchorElement>;
    href?: never;
};

type TrueButtonProps = ButtonCoreProps & {
    rawProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
    href?: never;
    link?: never;
};

type TrueAnchorProps = ButtonCoreProps & {
    rawProps?: React.AnchorHTMLAttributes<HTMLAnchorElement>;
    href?: string;
    link?: Link;
};

// Discuss this
// type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;

// export type OmitFromUnion<T, K extends string | number | symbol> = T extends {} ? Omit<T, K> : never;

export type ButtonComponentProps = ICanRedirect & (HrefButtonProps | LinkObjectButtonProps | TrueButtonProps | TrueAnchorProps);

export interface ButtonSemanticProps {
    type?: 'success' | 'cancel' | 'action';
}
