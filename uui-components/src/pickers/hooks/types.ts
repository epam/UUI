import {
    CX, DataSourceState, ICanBeReadonly, ICanFocus, IDisableable, IEditable, IHasCaption, IHasIcon, IHasPlaceholder,
    IHasRawProps, IModal, PickerBaseOptions, PickerBaseProps, PickerFooterProps, SortingOption,
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
    editMode?: 'dropdown' | 'modal';

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
      */
    searchPosition?: 'input' | 'body' | 'none';

    /** Disallow to clear Picker value (cross icon) */
    disableClear?: boolean;

    /** Minimum characters to type, before search will trigger (default is 1) */
    minCharsToSearch?: number;

    /** Overrides default height of the dropdown body */
    dropdownHeight?: number;

    /** Sets focus to component when it's mounted */
    autoFocus?: boolean;

    /** HTML attributes to put directly to the input and body elements */
    rawProps?: {
        input?: IHasRawProps<React.HTMLAttributes<HTMLDivElement>>['rawProps'];
        body?: IHasRawProps<React.HTMLAttributes<HTMLDivElement>>['rawProps'];
    };

    /** Adds custom footer to the dropdown body */
    renderFooter?: (props: PickerInputFooterProps<TItem, TId>) => React.ReactNode;

    /** Disables moving the dropdown body, when togglers is moved. Used in filters panel, to prevent filter selection to 'jump' after adding a filter. */
    fixedBodyPosition?: boolean;

    portalTarget?: HTMLElement;

    /** CSS class(es) to put on input-part component. See https://github.com/JedWatson/classnames#usage for details */
    inputCx?: CX;
    /** CSS class(es) to put on body-part component. See https://github.com/JedWatson/classnames#usage for details */
    bodyCx?: CX;
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

export type PickerListBaseProps<TItem, TId> = PickerBaseProps<TItem, TId> & {
    /**
     * Number of default items to show initially, when nothing is selected.
     * Default it 10 items
     */
    maxDefaultItems?: number;

    /** Maximum total number of items to show, including selected */
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

export interface LastUsedRec<TId> {
    id: TId;
    /* For possible future uses */
    sessionStartTime: number;
    selectionTime: number;
}

export interface UsePickerListStateProps<TId> extends UsePickerStateProps {
    visibleIds?: TId[];
}

export interface PickerListState<TId> extends PickerState {
    visibleIds: TId[];
    setVisibleIds: Dispatch<SetStateAction<TId[]>>;
}

export interface UsePickerModalStateProps<TItem, TId> extends UsePickerStateProps {
    selection: TItem | TId | TId[] | TItem[];
    selectionMode: 'single' | 'multi';
}

export interface PickerModalState<TItem, TId> extends PickerState {
    selection: TItem | TId | TId[] | TItem[];
    setSelection: Dispatch<SetStateAction<TItem | TId | TId[] | TItem[]>>;
}

export interface PickerModalOptions<TItem, TId> extends IHasRawProps<React.HTMLAttributes<HTMLDivElement>> {
    renderFilter?(editableFilter: IEditable<any>): React.ReactNode;
    renderFooter?: (props: PickerFooterProps<TItem, TId> & Partial<IModal<any>>) => React.ReactNode;
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
