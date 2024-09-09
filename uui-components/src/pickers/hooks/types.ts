import {
    CX, DataSourceState, ICanBeReadonly, ICanFocus, IDisableable, IEditable, IHasCaption, IHasIcon, IHasPlaceholder,
    IHasRawProps, IModal, PickerBaseOptions, PickerBaseProps, PickerFooterProps, PickerInputEditMode, PickerInputSearchPosition, SortingOption,
} from '@epam/uui-core';
import { Placement } from '@popperjs/core';
import { PickerTogglerProps } from '../PickerToggler';
import { Dispatch, SetStateAction } from 'react';

export type PickerInputBaseProps<TItem, TId> = PickerBaseProps<TItem, TId>
& ICanFocus<HTMLElement> &
IHasPlaceholder &
IDisableable &
ICanBeReadonly &
IHasIcon & {
    /** dropdown (default) - show selection in dropdown; modal - opens modal window to select items */
    editMode?: PickerInputEditMode;

    /** Maximum number of tags to display in input, before collapsing to "N items selected" mode */
    maxItems?: number;

    /** Minimum width of dropdown body */
    minBodyWidth?: number;

    /** Prevents selected items tags to occupy multiple lines  */
    isSingleLine?: boolean;

    /** Dropdown position relative to the input. See [Popper Docs](@link https://popper.js.org/) */
    dropdownPlacement?: Placement;

    /** Replaces default 'toggler' - an input to which Picker attaches dropdown */
    renderToggler?: (props: PickerTogglerProps<TItem, TId>) => React.ReactNode;

    /**
      *  Defines where search field is:
      * 'input' - try to place search inside the toggler (default for single-select),
      * 'body' - put search inside the dropdown (default for multi-select)
      * 'none' - disables search completely
      *
      * Note: 'searchPosition' cannot be 'input' if 'editMode' is 'modal'
      */
    searchPosition?: PickerInputSearchPosition;

    /** Disallow to clear Picker value (cross icon) */
    disableClear?: boolean;

    /**
     * Minimum characters to type, before search will trigger. If input characters number is less then 'minCharsToSearch', it will disable opening dropdown body.
     * By default search triggers after input value is changed.
     *
     * Note: defined minCharsToSearch isn't compatible with searchPosition=body.
     */
    minCharsToSearch?: number;

    /** Overrides default height of the dropdown body */
    dropdownHeight?: number;

    /** Sets focus to component when it's mounted */
    autoFocus?: boolean;

    /** HTML attributes to put directly to the PickerInput parts */
    rawProps?: {
        /** HTML attributes to put directly to the input element */
        input?: IHasRawProps<React.HTMLAttributes<HTMLDivElement>>['rawProps'];
        /** HTML attributes to put directly to the body root element */
        body?: IHasRawProps<React.HTMLAttributes<HTMLDivElement>>['rawProps'];
    };

    /** Adds custom footer to the dropdown body */
    renderFooter?: (props: PickerInputFooterProps<TItem, TId>) => React.ReactNode;

    /** Disables moving the dropdown body, when togglers is moved. Used in filters panel, to prevent filter selection to 'jump' after adding a filter. */
    fixedBodyPosition?: boolean;

    /**
     * Node of portal target, where to render the dropdown body.
     * By default, will be used global portal node.
     */
    portalTarget?: HTMLElement;

    /** CSS class(es) to put on input-part component. See https://github.com/JedWatson/classnames#usage for details */
    inputCx?: CX;
    /** CSS class(es) to put on body-part component. See https://github.com/JedWatson/classnames#usage for details */
    bodyCx?: CX;

    /**
     * Enables highlighting of the items' text with search-matching results.
     * */
    highlightSearchMatches?: boolean;

    /** Search input debounce delay in ms. Default value is 500ms */
    searchDebounceDelay?: number;

    /** HTML ID attribute for the input in toggler */
    id?: string;
};

export interface PickerInputFooterProps<TItem, TId> extends PickerFooterProps<TItem, TId> {
    onClose: () => void;
}

export type UsePickerInputProps<TItem, TId, TProps> = PickerInputBaseProps<TItem, TId> & TProps & {
    toggleModalOpening?(opened: boolean): void;
    shouldShowBody?(): boolean;
};

export interface UsePickerInputStateProps extends UsePickerStateProps {}

export interface PickerInputState extends PickerState {
    opened: boolean;
    setOpened: Dispatch<SetStateAction<boolean>>;
    isSearchChanged: boolean;
    setIsSearchChanged: Dispatch<SetStateAction<boolean>>;
}

export interface UsePickerStateProps {
    dataSourceState?: Partial<DataSourceState>;
}

export interface PickerState {
    dataSourceState: DataSourceState;
    setDataSourceState: Dispatch<SetStateAction<DataSourceState>>;
    showSelected: boolean;
    setShowSelected: Dispatch<SetStateAction<boolean>>;
}

export type PickerListBaseProps<TItem, TId> = Exclude<PickerBaseProps<TItem, TId>, 'cascadeSelection'> & {
    /**
     * Number of default items to show initially, when nothing is selected.
     * @default 10
     */
    maxDefaultItems?: number;

    /**
     * Maximum total number of items to show, including selected
     * @default 50
     */
    maxTotalItems?: number;

    /**
     * Ids of items to show first.
     * If not specified, top props.maxDefaultItems will be shown according to the DataSource sorting settings (default is 10)
     */
    defaultIds?: TId[];

    /** If provided, top picks will be automatically adjusted based on last user selection, and stored as user setting under provided key */
    settingsKey?: string;

    sortBy?(item: TItem, sorting: SortingOption): string;
};

export type UsePickerListProps<TItem, TId, TProps> = PickerListBaseProps<TItem, TId> & TProps & {};

export interface PickerModalOptions<TItem, TId> extends IHasRawProps<React.HTMLAttributes<HTMLDivElement>> {
    /** Render callback for custom filters block. This block will be rendered befor the items list.
     If omitted, nothing will be rendered.
     */
    renderFilter?(editableFilter: IEditable<any>): React.ReactNode;
    /** Render callback for modal footer.
     If omitted, default footer will be rendered.
     */
    renderFooter?: (props: PickerFooterProps<TItem, TId> & Partial<IModal<any>>) => React.ReactNode;
    /**
     * If true, prevent modal window closing by click outside modal
     * @default false
     */
    disallowClickOutside?: boolean;
}

export type PickerModalScalarProps<TId, TItem> =
    | ({ selectionMode: 'single'; valueType: 'id'; initialValue: TId } & IModal<TId>)
    | ({ selectionMode: 'single'; valueType: 'entity'; initialValue: TItem } & IModal<TItem>);
export type PickerModalArrayProps<TId, TItem> =
    | ({ selectionMode: 'multi'; valueType: 'id'; initialValue: TId[] } & IModal<TId[]>)
    | ({ selectionMode: 'multi'; valueType: 'entity'; initialValue: TItem[] } & IModal<TItem[]>);

export type UsePickerModalProps<TItem, TId> = PickerBaseOptions<TItem, TId> &
IHasCaption &
(PickerModalScalarProps<TId, TItem> | PickerModalArrayProps<TId, TItem>) &
PickerModalOptions<TItem, TId>;
