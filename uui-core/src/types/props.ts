import {
    Attributes, CSSProperties, HTMLAttributes, ForwardedRef, ReactNode,
} from 'react';
import { Link, CX, Icon, AnalyticsEvent } from './objects';
import * as CSS from 'csstype';
import { PopperArrowProps } from 'react-popper';
import { Placement } from '@popperjs/core';
import { IDndActor } from './dnd';

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

/** Component can be used as Toggler control for dropdown menus */
export interface IDropdownToggler extends IHasCaption, IClickable {
    /** When component acts as dropdown, indicate that dropdown is open */
    isOpen?: boolean;
    /** Enabled dropdown mode - component can toggle dropdown */
    isDropdown?: boolean;
    /** Called when associated dropdown should open or close  */
    toggleDropdownOpening?: (value: boolean) => void;
    /** Called when component is interacted outside, to close the dropdown */
    isInteractedOutside?: (event: Event) => boolean;
    /** Component's ref */
    ref?: React.Ref<any>;
    /** Disables component */
    isDisabled?: boolean;
}

export interface IDropdownBodyProps {
    onClose?: () => void;
    togglerWidth?: number;
    togglerHeight?: number;
    scheduleUpdate?: () => void;
    isOpen?: boolean;
    arrowProps?: PopperArrowProps;

    /** Dropdown position relative to the input. See [Popper Docs](@link https://popper.js.org/) */
    placement?: Placement;
}

/**
 * Component can be used as Toggler control for pickers.
 * This interface is enough for basic pickers.
 * Picker togglers with search or advanced selection display should implement IPickerToggler interface
 */
export interface IBasicPickerToggler extends IDropdownToggler {
    onClear?(e?: any): void;
}

/** Holds parent info for data rows */
export interface DataRowPathItem<TId, TItem> {
    id: TId;
    value: TItem;
    isLastChild: boolean;
}

/** A part of the DataRowProps, which can be configured for each data row via getRowOptions callback.
 * Other props in DataRowProps are computed when generating rows.
 */
export interface DataRowOptions<TItem, TId> extends IDisableable, Partial<IEditable<TItem>> {
    /** If row needs a checkbox, this field should be specified and it props can be configured here */
    checkbox?: { isVisible: boolean } & IDisableable & ICanBeInvalid;

    /** True if row is selectable (for whole-row single-selection, multi-selection via checkbox are configured with the checkbox prop) */
    isSelectable?: boolean;

    /** Configures row drag-n-drop options - if it can be dragged, can rows can be dropped into it, etc. */
    dnd?: IDndActor<any, any>;

    /** Row click handler */
    onClick?(rowProps: DataRowProps<TItem, TId>): void;

    /** Can be specified to make row act as a link (plain or SPA) */
    link?: Link;
}

/** DataRowProps is a base shape of props, passed to items in various lists or trees.
 *
 * Despite 'Row' in it's name, it doesn't directly connected to a table.
 * We use DataRowProps as a base for DataTableRowProps and DataPickerRowProps.
 * But it can also be used for any user-built list, tree, custom picker rows, or even a grid of cards.
 *
 * Array of DataRowProps describes a part of hierarchical list, while still being a flat array (not a tree of some kind).
 * We use depth, indent, path, and other props to show row's place in the hierarchy.
 * This is very handy to handle rendering, especially in virtual scrolling scenarios.
 *
 * DataSources primary job is to convert various data stores into arrays of DataRowProps.
 */
export type DataRowProps<TItem, TId> = FlexRowProps &
DataRowOptions<TItem, TId> & {
    /** ID of the TItem rows displays */
    id: TId;

    /** Key to be used as component's key when rendering. Usually, it's stringified ID */
    rowKey: string;

    /** Index of the row, from the top of the list. This doesn't account any hierarchy. */
    index: number;

    /** The data item (TItem) row displays. Will be undefined if isLoading = true. */
    value: TItem | undefined;

    /** ID of the parent TItem */
    parentId?: TId;

    /** Hierarchical path from the root node to the item (excluding the item itself) */
    path?: DataRowPathItem<TId, TItem>[];

    /* visual */

    /** Depth of the row in tree, 0 for the top-level */
    depth?: number;

    /** Indent of the item, to show hierarchy.
         *  Unlike depth, it contains additional logic, to not add unnecessary indents:
         *  if all children of node has no children, all nodes would get the same indent as parent.
         */
    indent?: number;

    /** True if row is in loading state. 'value' is empty in this case */
    isLoading?: boolean;

    isUnknown?: boolean;

    /** True if row be folded or unfolded (usually because it contains children) */
    isFoldable?: boolean;

    /** True if row is currently folded */
    isFolded?: boolean;

    /** True if row is checked with checkbox */
    isChecked?: boolean;

    /** True if row has checkbox and can be checkable */
    isCheckable?: boolean;

    /** True if some of row's children are checked.
         * Used to show 'indefinite' checkbox state, to show user that something inside is checked */
    isChildrenChecked?: boolean;

    /** True if row is selected (in single-select mode, or in case when interface use both single row selection and checkboxes) */
    isSelected?: boolean;

    /** True if any of row's children is selected. */
    isChildrenSelected?: boolean;

    /** True if row is focused. Focus can be changed via keyboard arrow keys, or by hovering mouse on top of the row */
    isFocused?: boolean;

    /** True if row is the last child of his parent */
    isLastChild?: boolean;

    /* events */

    /** Handles row folding change.
         * We demand to pass the row as well, to avoid creating closures for each row.
         */
    onFold?(rowProps: DataRowProps<TItem, TId>): void;

    /** Handles row click.
         * We demand to pass the row as well, to avoid creating closures for each row.
         */
    onClick?(rowProps: DataRowProps<TItem, TId>): void;

    /** Handles row checkbox change.
         * We demand to pass the row as well, to avoid creating closures for each row.
         */
    onCheck?(rowProps: DataRowProps<TItem, TId>): void;

    /** Handles row selection.
         * We demand to pass the row as well, to avoid creating closures for each row.
         */
    onSelect?(rowProps: DataRowProps<TItem, TId>): void;

    /** Handles row focusing.
         */
    onFocus?(focusedIndex: number): void;
};

/**
 * Component can be used as Toggler control for pickers.
 * Only IDropdownToggler implementation is necessary for the picker to function.
 * Other props can be implemented for full-featured picker togglers.
 */
export interface IPickerToggler<TItem = any, TId = any>
    extends IBasicPickerToggler,
    Partial<IEditable<string>>,
    Partial<IHasPlaceholder>,
    Partial<IDisableable>,
    Partial<ICanBeInvalid> {
    selection?: DataRowProps<TItem, TId>[];
    selectedRowsCount?: number;
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
