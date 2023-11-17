import * as React from 'react';
import { IClickable, ICanRedirect, IDisableable, IHasCaption, IHasCX, IHasIcon, IAnalyticableClick,
    IHasTabIndex, IDropdownToggler,
} from '../props';
import { IBasicPickerToggler } from '../pickers';
import { Icon, Link } from '../objects';

export interface ButtonBaseCoreProps extends IHasCX, IClickable, IDisableable, IHasIcon, IAnalyticableClick, IHasTabIndex
{}

export interface ButtonCoreProps extends ButtonBaseCoreProps, IHasCaption, IBasicPickerToggler, IDropdownToggler {
    /** Icon for drop-down toggler */
    dropdownIcon?: Icon;

    /** Position of the dropdown icon ('left' of 'right') */
    dropdownIconPosition?: 'left' | 'right';

    count?: React.ReactNode;
}

type HrefButtonRawProps = ButtonCoreProps & {
    rawProps?: React.AnchorHTMLAttributes<HTMLAnchorElement>;
    href: string | never;
    link?: never;
};

type LinkButtonRawProps = ButtonCoreProps & {
    rawProps?: React.AnchorHTMLAttributes<HTMLAnchorElement>;
    link: Link;
    href?: never;
};

type ButtonRawProps = ButtonCoreProps & {
    rawProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
    href?: never;
    link?: never;
};

type AnchorRawProps = ButtonCoreProps & {
    rawProps?: React.AnchorHTMLAttributes<HTMLAnchorElement>;
    href: string;
    link: Link;
};

export type MergedRawProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & React.ButtonHTMLAttributes<HTMLButtonElement>;

export type ButtonComponentProps = ICanRedirect & (HrefButtonRawProps | LinkButtonRawProps | ButtonRawProps | AnchorRawProps);

export interface ButtonSemanticProps {
    type?: 'success' | 'cancel' | 'action';
}
