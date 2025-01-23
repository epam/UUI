import { ReactNode } from 'react';
import {
    IAnalyticableOnChange,
    ICanBeInvalid,
    IDisableable,
    IEditable,
    IHasPlaceholder,
    IHasCX,
    IDropdownTogglerProps,
    ICanFocus, ICanBeReadonly, IHasIcon, IHasRawProps,
} from './props';
import { IDataSource, IDataSourceView, DataSourceState, CascadeSelection, SortingOption } from './dataSources';
import { DataRowProps, DataRowOptions } from './dataRows';
import { Placement } from '@popperjs/core';
import { CX } from './objects';

/**
 * PickerInput element API. Is used to describe ref to the PickerInput component.
 */
export interface PickerInputElement extends HTMLElement {
    /**
     * Closes PickerInput body.
     */
    closePickerBody?: () => void;
}

export type SinglePickerProps<TId, TItem> =
    | ({
        /** If 'single' provided - only one item is selected. In case of 'multi' - multiple items are selected */
        selectionMode: 'single';
        /** Defines what to use in value/onValueChange: 'id' - item id (TId). 'entity' - the item itself (TItem) */
        valueType?: 'id';
    } & IEditable<TId>)
    | ({
        /** If 'single' provided - only one item is selected. In case of 'multi' - multiple items are selected */
        selectionMode: 'single';
        /** Defines what to use in value/onValueChange: 'id' - item id (TId). 'entity' - the item itself (TItem) */
        valueType: 'entity';
    } & IEditable<TItem>);

export type ArrayPickerProps<TId, TItem> =
    | ({
        /** If 'single' provided - only one item is selected. In case of 'multi' - multiple items are selected */
        selectionMode: 'multi';
        /** Defines what to use in value/onValueChange: 'id' - item id (TId). 'entity' - the item itself (TItem) */
        valueType?: 'id';
        /** Defines what to use as an empty value. If other value provided, it will be assumed as selection */
        emptyValue?: [] | null;
    } & IEditable<TId[]>)
    | ({
        /** If 'single' provided - only one item is selected. In case of 'multi' - multiple items are selected */
        selectionMode: 'multi';
        /** Defines what to use in value/onValueChange: 'id' - item id (TId). 'entity' - the item itself (TItem) */
        valueType: 'entity';
        /** Defines what to use as an empty value. If other value provided, it will be assumed as selection */
        emptyValue?: [] | null;
    } & IEditable<TItem[]>);

export type PickerBindingProps<TItem, TId> = SinglePickerProps<TId, TItem> | ArrayPickerProps<TId, TItem>;

export type PickerBindingValueType = 'scalar' | 'array';
/**
 * Options for positioning the search input within PickerInput.
 */
export type PickerInputSearchPosition = 'input' | 'body' | 'none';
/**
 * Options for displaying content in PickerInput.
 */
export type PickerInputEditMode = 'dropdown' | 'modal';

/**
 * Picker empty body configuration.
 */
export interface PickerEmptyBodyProps {
    minCharsToSearch?: number;
    search: string;
    onClose: () => void;
}

export type PickerBaseOptions<TItem, TId> = {
    /** Name of the entity being selected. Affects wording like "Please select [entity]" */
    entityName?: string;

    /** Plural name of the entity being selected. Affects wording like "X [entities] selected" */
    entityPluralName?: string;

    /** Datasource to get data for the picker */
    dataSource: IDataSource<TItem, TId, any>;

    /** A pure function that gets entity name from entity object.
     Default: (item) => item.name.
     */
    getName?: (item: TItem) => string;

    /** Allow to customize how each selectable row is rendered. Can be used to add subtitles, avatars, etc. */
    renderRow?: (props: DataRowProps<TItem, TId>, dataSourceState: DataSourceState) => ReactNode;

    /** Gets options for each row. Allow to make rows non-selectable, as well as many other tweaks. */
    getRowOptions?: (item: TItem, index: number) => DataRowOptions<TItem, TId>;

    /**
     * @deprecated in favor of `renderEmpty` method.
     * Overrides the default 'no records found' banner.
     * The 'search' callback parameter allows to distinguish cases when there's no records at all, and when current search doesn't find anything.
     * */
    renderNotFound?: (props: { search: string; onClose: () => void }) => ReactNode;

    /**
     * Overrides the rendering of PickerBody content when it is empty.
     * It's used for different empty reasons, like: no record find, no record at all, there is not enough search length to start loading(minCharsToSearch prop provided).
     * Consider this all cases where a custom callback is provided.
     * If not provided, default implementation is used.
     */
    renderEmpty?: (props: PickerEmptyBodyProps) => ReactNode;

    /** Defines which value is to set on clear. E.g. you can put an empty array instead of null for empty multi-select Pickers */
    emptyValue?: undefined | null | [];

    /** Defines how items should be sorted. By default, items are shown in order they are provided to the DataSource */
    sortBy?(item: TItem, sorting: SortingOption): any;

    /** Additional filter to apply to the DataSource. Can be used to limit selection somehow, w/o re-building the DataSource. E.g. in the linked pickers scenario. */
    filter?: any;

    /** Defines sorting to pass to the DataSource */
    sorting?: SortingOption;

    /**
     * Controls how the selection (checking items) of a parent node affects the selection of its all children, and vice versa.
     * - false: All nodes are selected independently (default).
     * - true or 'explicit': Selecting a parent node explicitly selects all its children. Unchecking the last parent's child unchecks its parent.
     * - 'implicit': Selecting a parent node means that all children are considered checked.
     *   The user sees all these nodes as checked on the UI, but only the selected parent is visible in the PickerInput tags, and only the checked
     *   parent is present in the Picker's value or DataSourceState.checked array. When the user unchecks the first child of such a parent,
     *   its parents become unchecked and all children but the unchecked one become checked, making children's selection explicit. If the last
     *   unchecked child gets checked, all children from the checked are removed, returning to the implicit state when only the parent is checked.
     */
    cascadeSelection?: CascadeSelection;

    /** You can return true for all, or some items to fold them. */
    isFoldedByDefault?(item: TItem): boolean;

    /** Given an item, should return an array of string fields to search on. By default, the search is performed on item.name field. */
    getSearchFields?(item: TItem): string[];
    /** Component ref */
    ref?: React.Ref<PickerInputElement>;
};

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

export type PickerFooterProps<TItem, TId> = {
    /** Instance of picker DataSource view */
    view: IDataSourceView<TItem, TId, any>;
    /** IEditable interface for the 'Show only selected' toggler */
    showSelected: IEditable<boolean>;
    /** Call to clear picker selection */
    clearSelection: () => void;
    /** If 'single' provided - only one item is selected. In case of 'multi' - multiple items are selected */
    selectionMode: 'single' | 'multi';
    /** If true, 'Clear' button will be disabled */
    disableClear?: boolean;
    /** Current selected items */
    selection: PickerBindingProps<TItem, TId>['value'];
    /** Defines a search value */
    search: string;
    /**
     * Indicates whether the search does not contain enough characters to load data.
     */
    isSearchTooShort?: boolean;
};

/**
 * Show selected rows only in Picker.
 */
export interface PickerShowSelectedOnly {
    /**
     * Enables/disables selected rows only in Picker.
     */
    showSelectedOnly?: boolean;
}

export type PickerBaseProps<TItem, TId> =
PickerBaseOptions<TItem, TId>
& PickerBindingProps<TItem, TId>
& IAnalyticableOnChange<any>
& PickerShowSelectedOnly;

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
    /** Array of selected rows */
    selection?: DataRowProps<TItem, TId>[];
    /** Amount of selected items */
    selectedRowsCount?: number;
}

/**
 * Component can be used as Toggler control for pickers.
 * This interface is enough for basic pickers.
 * Picker togglers with search or advanced selection display should implement IPickerToggler interface
 */
export interface IBasicPickerToggler extends IDropdownTogglerProps {
    /** Call to clear toggler value */
    onClear?(e?: any): void;
}

/** Props for cells in pickers. */
export interface DataPickerCellProps<TItem = any, TId = any> extends IHasCX {
    /** Key to use as component's key. */
    key: string;

    /** DataRowProps object for the picker row where a cell is placed. */
    rowProps: DataRowProps<TItem, TId>;

    /** Render the cell content. The item props is the value of the whole row (TItem). */
    renderItem(item: TItem, rowProps: DataRowProps<TItem, TId>): ReactNode;
}
