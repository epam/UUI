import {
    Attributes, CSSProperties, HTMLAttributes, ForwardedRef, ReactNode,
} from 'react';
import { Link, CX, Icon, AnalyticsEvent } from './objects';
import * as CSS from 'csstype';

/** Component value can be invalid */
export interface ICanBeInvalid {
    /** True if component contains invalid input */
    isInvalid?: boolean;

    /** Message describing why the value is invalid */
    validationMessage?: string;
    /** If T is a complex value (object or array), this property contains validation states of inner items */
    validationProps?: { [key: string]: ICanBeInvalid };
}

/** Components has an editable value. Text Input is a basic example. */
export interface IEditable<T> extends ICanBeInvalid, IDisableable, ICanBeReadonly, ICanBeRequired {
    /** The current value of component */
    value: T;

    /** Called when value needs to be changed (usually due to user interaction) */
    onValueChange(newValue: T): void;
}

/** Component supports click action */
export interface IClickable {
    /** Called when component is clicked */
    onClick?(e?: any): void;
}

/** Component acts as a link, and can redirect */
export interface ICanRedirect {
    /** Link object to redirect to for SPA-redirects */
    link?: Link;

    /** Href (URL) to redirect to, for non-SPA redirects */
    href?: string;

    /** Highlights component to show that link is active (browser is displaying the page to which link is pointing) */
    isLinkActive?: boolean;

    /** Controls where the link should be opened */
    target?: '_blank';
}

/** Component can be disabled */
export interface IDisableable {
    /** Disable editing, and visually de-emphasize value of the component */
    isDisabled?: boolean;
}

/** Component can be not editable */
export interface ICanBeReadonly {
    /** Disable editing. Unlike isDisabled, keep component's value readable. */
    isReadonly?: boolean;
}

export interface ICanBeRequired {
    /** Marks that component's value is required */
    isRequired?: boolean;
}

/** Component can be focused */
export interface ICanFocus<T> {
    /** Called when component gets input focus */
    onFocus?: (e: React.FocusEvent<T>) => void;
    /** Called when component looses input focus */
    onBlur?: (e: React.FocusEvent<T>) => void;
}

/** Component has a caption. E.g. Button */
export interface IHasCaption {
    /** Caption. Can be a string, or React.Elements. Certain components supports minimal markup (<b>,<i>,<a>) in captions. */
    caption?: any;
}

/** Component has label. E.g. User Name */
export interface IHasLabel {
    /** Label. Can be a string, or React.Elements. Certain components supports minimal markup (<b>,<i>,<a>) in captions. */
    label?: any;
}

/** Component has direction of child components. */
export interface IHasDirection {
    direction?: 'vertical' | 'horizontal';
}

/**
 * Component can accept cx variable, which is more convenient shortcut for 'classname' property
 * It accepts string, arrays, object, recursively. All falsy values are thrown away. Examples:
 * - 'red' => 'red'
 * - ['red', 0, false, 'blue' ] => 'red blue'
 * - { 'red': true, 'blue': false, ['green', 'white']} => 'red green white'
 */
export interface IHasCX {
    /** CSS class(es) to put on component's root. See {@link https://github.com/JedWatson/classnames#usage} for details */
    cx?: CX;
}

export interface IHasIcon {
    /** Icon can be an React element (usually an SVG element) */
    icon?: Icon;

    /** Position of the icon (left of right) */
    iconPosition?: 'left' | 'right';

    /** Click handler for the icon */
    onIconClick?(): void;
}

export interface IHasChildren {
    children?: ReactNode;
}

export interface IHasPlaceholder {
    /** Placeholder to display when empty */
    placeholder?: any;
}

// TBD: merge with ICanFocus?
export interface IHasTabIndex {
    /** Controls the order of keyboard navigation between components */
    tabIndex?: React.HTMLAttributes<HTMLElement>['tabIndex'];
}

export interface IAdaptiveItem {
    estimatedWidth?: number;
    priority?: number;
    showInBurgerMenu?: boolean;
    collapseToMore?: boolean;
    collapsedContainer?: boolean;
}

export interface IModal<TResult> {
    isActive: boolean;
    key: string;
    zIndex: number;
    success(result: TResult): void;
    abort(result?: any): void;
}

export interface INotification {
    onClose?(): void;
    onSuccess?(): void;
    clearTimer?(): void;
    refreshTimer?(): void;
    id: number;
    key: string;
}

export type IHasRawProps<T> = {
    /** Any HTML attributes (native or 'data-') to put on the underlying component */
    rawProps?: T & Record<`data-${string}`, string>;
};

export interface IHasForwardedRef<T extends HTMLOrSVGElement> {
    /** this ref is passed to the underlying component */
    forwardedRef?: ForwardedRef<T>;
}

export type FlexRowProps = IHasCX &
IClickable &
Attributes &
IHasChildren &
IHasRawProps<HTMLAttributes<HTMLDivElement>> & {
    /** Flexbox align-items property [Flexbox Guide](https://css-tricks.com/snippets/css/a-guide-to-flexbox/) */
    alignItems?: 'top' | 'center' | 'bottom' | 'stretch';
    /** Flexbox column gap property [Flexbox Guide](https://css-tricks.com/snippets/css/a-guide-to-flexbox/#aa-gap-row-gap-column-gap) */
    columnGap?: number | '6' | '12' | '18' | '24' | '36';
    /** Flexbox row gap property [Flexbox Guide](https://css-tricks.com/snippets/css/a-guide-to-flexbox/#aa-gap-row-gap-column-gap) */
    rowGap?: number | '6' | '12' | '18' | '24' | '36';
};

export type FlexCellProps = IHasCX &
IClickable &
IHasRawProps<HTMLAttributes<HTMLDivElement>> &
Attributes &
IHasChildren & {
    /** CSS width. Set to 'auto' to make FlexCell resize to it's content */
    width?: number | 'auto' | '100%';
    /** CSS min-width */
    minWidth?: number;
    /** Flexbox flex-grow property [Flexbox Guide](https://css-tricks.com/snippets/css/a-guide-to-flexbox/#aa-flex-grow) */
    grow?: number;
    /** Flexbox shrink property [Flexbox Guide](https://css-tricks.com/snippets/css/a-guide-to-flexbox/#aa-flex-shrink) */
    shrink?: number;
    /** CSS text-align property */
    textAlign?: 'left' | 'center' | 'right';
    /** Flexbox align-self property. Aligns items vertically for horizontal flexbox. [Flexbox Guide](https://css-tricks.com/snippets/css/a-guide-to-flexbox/#aa-align-self) */
    alignSelf?: CSS.AlignSelfProperty;
    /** Standard style attribute. Styles are added to element style, overriding supplied flex styles */
    style?: React.CSSProperties;
};

export type VPanelProps = IHasCX &
IHasChildren &
IClickable &
IHasRawProps<HTMLAttributes<HTMLDivElement>> &
IHasForwardedRef<HTMLDivElement> &
IAnalyticableClick & {
    style?: CSSProperties;
};

export type ICheckable = IEditable<boolean> &
IDisableable & {
    /** Sets checkbox in indeterminate state (neither checked or unchecked), which usually means that children elements has both values */
    indeterminate?: boolean;
};

export interface IAnalyticableClick {
    /**
     * An analytics event to send (via AnalyticsContext) when component is clicked.
     * See [AnalyticsContext](@link https://uui.epam.com/documents?id=analyticsContext&mode=doc&skin=UUI4_promo&category=contexts).
     */
    clickAnalyticsEvent?: AnalyticsEvent;
}

export interface IAnalyticableOnChange<T> {
    /**
     * Given a value, returns an analytics event to send when component is edited.
     * See [AnalyticsContext](@link https://uui.epam.com/documents?id=analyticsContext&mode=doc&skin=UUI4_promo&category=contexts).
     */
    getValueChangeAnalyticsEvent?: (newValue: T | null, oldValue: T | null) => AnalyticsEvent;
}
