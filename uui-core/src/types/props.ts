import {
    Attributes, CSSProperties, HTMLAttributes, ForwardedRef, ReactNode,
} from 'react';
import { FloatingArrowProps, Placement } from '@floating-ui/react';
import { Link, CX, Icon, AnalyticsEvent } from './objects';
import * as CSS from 'csstype';
import * as React from 'react';

/** Component value can be invalid */
export interface ICanBeInvalid {
    /** True if component contains invalid input */
    isInvalid?: boolean;
}

export interface IHasValidationMessage {
    /** Message describing why the value is invalid */
    validationMessage?: ReactNode;
}

export interface IControlled<T> {
    /** The current value of component */
    value: T;

    /** Called when value needs to be changed (usually due to user interaction) */
    onValueChange(newValue: T): void;
}

/** Component displays an editable value. Text Input is a basic example. */
export interface IEditable<T> extends ICanBeInvalid, IDisableable, ICanBeReadonly, ICanBeRequired, IControlled<T> { }

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

    /** Controls where the link should be opened */
    target?: '_blank';
}

export interface ICanBeActive {
    /**
     * @deprecated Use `isActive` instead
     * Highlights component to show that link is active (browser is displaying the page to which link is pointing)
     */
    isLinkActive?: boolean;
    /** Highlights component to show that it is active (e.g. selected in a list) */
    isActive?: boolean;
}

/** Component can be disabled */
export interface IDisableable {
    /** Disable editing, and visually de-emphasize value of the component */
    isDisabled?: boolean;
}

/** Component can be made read-only */
export interface ICanBeReadonly {
    /** Disable editing. Unlike isDisabled, keep component's value readable. */
    isReadonly?: boolean;
}

export interface ICanBeRequired {
    /** Marks that component's value is required and shouldn't be empty */
    isRequired?: boolean;
}

/** Component can get input focus */
export interface ICanFocus<T> {
    /** Called when component gets input focus */
    onFocus?: (e: React.FocusEvent<T>) => void;
    /** Called when component looses input focus */
    onBlur?: (e: React.FocusEvent<T>) => void;
}

/** Component has a caption. E.g. Button */
export interface IHasCaption {
    /** Caption. Can be a string, or React.Element. Certain components supports minimal markup (<b>,<i>,<a>) in captions. */
    caption?: ReactNode;
}

/** Component has label. E.g. User Name */
export interface IHasLabel {
    /** Component label. Can be a string, or React.Element. Certain components supports minimal markup (<b>,<i>,<a>) in labels. */
    label?: ReactNode;
}

/** Component has direction of child components. */
export interface IHasDirection {
    /** Direction of child components. */
    direction?: 'vertical' | 'horizontal';
}

/**
 * Component can accept cx property, allowing to pass classes to put on component.
 * CX is a shortcut for 'classnames'.
 * The props accept string, arrays, object, recursively. All falsy values are thrown away. Examples:
 * - 'red' => 'red'
 * - ['red', 0, false, 'blue' ] => 'red blue'
 * - { 'red': true, 'blue': false, ['green', 'white']} => 'red green white'
 */
export interface IHasCX {
    /** CSS class(es) to put on component's root. See {@link https://github.com/JedWatson/classnames#usage} for details */
    cx?: CX;
}

/** An icon can be added to component */
export interface IHasIcon {
    /** Icon can be a React element (usually an SVG element) */
    icon?: Icon;

    /** Position of the icon (left of right) */
    iconPosition?: 'left' | 'right';

    /** Click handler for the icon */
    onIconClick?(): void;
}

/** Component can have child components */
export interface IHasChildren {
    /** Component children */
    children?: ReactNode;
}

/**
 * Represents placeholder component prop
 */
export interface IHasPlaceholder {
    /** Placeholder to display when empty */
    placeholder?: any;
}

// TBD: merge with ICanFocus?
export interface IHasTabIndex {
    /** Controls the order of keyboard navigation between components */
    tabIndex?: React.HTMLAttributes<HTMLElement>['tabIndex'];
}

export interface IHasStyleAttrs {
    /** CSS style prop to put on the component */
    style?: React.CSSProperties;
}

// TBD: remove when MainMenu old api of items providing will be removed
export interface IAdaptiveItem {
    estimatedWidth?: number;
    priority?: number;
    showInBurgerMenu?: boolean;
    collapseToMore?: boolean;
    collapsedContainer?: boolean;
}

export interface IModal<TResult, TParameters = any> {
    /** Indicates whether the modal is currently displayed */
    isActive?: boolean;
    /** Unique key of the modal */
    key: string;
    /** Modal zIndex value. Calculated via LayoutContext. */
    zIndex: number;
    /** Call to successfully close the modal. It's resolves `modalContext.show()` promise with provided value. */
    success(result: TResult): void;
    /** Call to close the modal with abort action. It's rejects `modalContext.show()` promise with provided value. */
    abort(result?: any): void;
    /** Parameters that provided via second param of `modalContext.show` method */
    parameters?: TParameters;
    /** Depth of current modal layer */
    depth?: number;
}

export interface INotification {
    /** Call to close the notification with abort action. It's rejects `notificationContext.show()` promise. */
    onClose?(): void;
    /** Call to close the notification with success action. It's resolved `notificationContext.show()` promise. */
    onSuccess?(): void;
    /** Cancel notification closing timer */
    clearTimer?(): void;
    /** Reinitialize notification closing timer. It will be set to the provided notification duration.  */
    refreshTimer?(): void;
    /** Unique id of the notification */
    id: number;
    /** Unique key of the notification */
    key: string;
}

// Component allows to pass raw HTML props to put on the DOM element
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
    /** Flexbox align-items property [Flexbox Guide](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)
     * @default 'center'
     * */
    alignItems?: CSSProperties['alignItems'];
    /** Flexbox justifyContent property [Flexbox Guide](https://css-tricks.com/snippets/css/a-guide-to-flexbox/) */
    justifyContent?: CSSProperties['justifyContent'];
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
    /** Native style attributes */
    style?: CSSProperties;
};

export type ICheckable = IEditable<boolean> & IDisableable & {
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

export interface IDropdownBodyProps {
    /** Call to close the Dropdown body */
    onClose?: () => void;
    /** The width of the toggler, which can be used to adjust the body width to it */
    togglerWidth?: number;
    /** The height of the toggler */
    togglerHeight?: number;
    /** Call to force recompute dropdown position */
    scheduleUpdate?: () => void;
    /** Indicates that dropdown is open */
    isOpen?: boolean;
    /** Props that should be provided to the arrow component */
    arrowProps?: Omit<FloatingArrowProps, 'ref' | 'context'> & React.ComponentPropsWithRef<'div'>;
    /** Dropdown position relative to the input. See [Floating UI Docs](@link https://floating-ui.com/docs/useFloating#placement) */
    placement?: Placement;
}

/** Component can be used as Toggler control for dropdown menus */
export interface IDropdownToggler {
    /** When isDropdown=true, indicate that dropdown is open with chevron icon */
    isOpen?: boolean;
    /** Shows chevron icon, enabling component to act as dropdown toggler */
    isDropdown?: boolean;
}

export interface IDropdownTogglerProps extends IDropdownToggler, IClickable, ICanFocus<any> {
    /** Called when associated dropdown should open or close  */
    toggleDropdownOpening?: (value: boolean) => void;
    /** Called when component is interacted outside, to close the dropdown */
    isInteractedOutside?: (event: Event) => boolean;
    /** Toggler component ref */
    ref?: React.Ref<any>;
}
