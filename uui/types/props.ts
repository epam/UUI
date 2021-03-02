import { Link, CX, Icon } from './objects';
import * as CSS from 'csstype';
import {DataRowProps} from "./tables";
import {AnalyticsEvent} from "./contexts";
import * as types from "../index";
import * as React from "react";

/** Component value can be invalid */
export interface ICanBeInvalid {
    isInvalid?: boolean;
    validationMessage?: string;
    /** If T is a complex value (object or array), this property contains validation states of inner items */
    validationProps?: { [key: string]: ICanBeInvalid };
}

/** Components has an editable value. Text Input is a basic example. */
export interface IEditable<T> extends ICanBeInvalid, IDisableable, ICanBeReadonly, ICanBeRequired {
    value: T;
    onValueChange(newValue: T): void;
}

/** Component supports click action */
export interface IClickable {
    onClick?(e?: any): void;
}

export interface ICanRedirect {
    link?: Link;
    href?: string;
    isLinkActive?: boolean;
    target?: '_blank';
}

/** Component can be disabled */
export interface IDisableable {
    isDisabled?: boolean;
}

/** Component can be not editable */
export interface ICanBeReadonly {
    isReadonly?: boolean;
}

export interface ICanBeRequired {
    isRequired?: boolean;
}

/** Component has caption. E.g. Button */
export interface IHasCaption {
    caption?: any;
}

/** Component has label. E.g. User Name */
export interface IHasLabel {
    label?: any;
}

/** Component has direction of child components. */
export interface IHasDirection {
    direction?: 'vertical' | 'horizontal';
}

/** Component can be used as Toggler control for dropdown menus */
export interface IDropdownToggler extends IHasCaption, IClickable {
    isOpen?: boolean;
    isDropdown?: boolean;
}

/**
 * Component can be used as Toggler control for pickers.
 * This interface is enough for basic pickers.
 * Picker togglers with search or advanced selection display should implement IPickerToggler interface
 */
export interface IBasicPickerToggler extends IDropdownToggler {
    onClear?(e?: any): void;
}

/**
 * Component can be used as Toggler control for pickers.
 * Only IDropdownToggler implementation is necessary for the picker to function.
 * Other props can be implemented for full-featured picker togglers.
 */
export interface IPickerToggler<TItem = any, TId = any> extends IBasicPickerToggler, Partial<IEditable<string>>, Partial<IHasPlaceholder>, Partial<IDisableable>, Partial<ICanBeInvalid> {
    selection?: DataRowProps<TItem, TId>[];
}

/**
 * Component can accept cx variable, which is more convenient shortcut for 'classname' property
 * It accepts string, arrays, object, recursively. All falsy values are thrown away. Examples:
 * - 'red' => 'red'
 * - ['red', 0, false, 'blue' ] => 'red blue'
 * - { 'red': true, 'blue': false, ['green', 'white']} => 'red green white'
 */
export interface IHasCX {
    cx?: CX;
}

export interface IHasIcon {
    icon?: Icon;
    iconPosition?: 'left' | 'right';
    onIconClick?(): void;
}

export interface IHasChildren {
    children?: any;
}

export interface IHasPlaceholder {
    placeholder?: any;
}

export interface IAdaptiveItem {
    estimatedWidth?: number;
    priority?: number;
    showInBurgerMenu?: boolean;
    collapseToMore?: boolean;
}

export interface IModal<TResult> {
    isActive: boolean;
    key: string;
    zIndex: number;
    success(result: TResult): void;
    abort(): void;
    disallowClickOutside?: boolean;
}

export interface INotification {
    onClose(): void;
    onSuccess(): void;
    clearTimer?(): void;
    refreshTimer?(): void;
    id: number;
    key: string;
}

export interface IHasRawProps<T> {
    rawProps?: T;
}

export type FlexRowProps = IHasCX
    & IClickable
    & React.Attributes
    & IHasRawProps<React.HTMLAttributes<HTMLDivElement>>
    & {
        alignItems?: 'top' | 'center' | 'bottom' | 'stretch';
        children?: any;
    };

export type FlexCellProps = IHasCX
    & IClickable
    & IHasRawProps<React.HTMLAttributes<HTMLDivElement>>
    & React.Attributes
    & {
        width?: number | 'auto' | '100%';
        minWidth?: number;
        grow?: number;
        shrink?: number;
        textAlign?: 'left' | 'center' | 'right';
        alignSelf?: CSS.AlignSelfProperty;
        children?: any;
    };

export type VPanelProps = types.IHasCX & types.IHasChildren & types.IClickable & types.IHasRawProps<React.HTMLAttributes<HTMLDivElement>> & IAnalyticableClick & {
    style?: React.CSSProperties;
};

export type ICheckable = IEditable<boolean> & IDisableable & {
    indeterminate?: boolean;
};

export interface IAnalyticableClick {
    clickAnalyticsEvent?: AnalyticsEvent;
}

export interface IAnalyticableOnChange<T> {
    getValueChangeAnalyticsEvent?: (newValue: T | null, oldValue: T | null) => AnalyticsEvent;
}