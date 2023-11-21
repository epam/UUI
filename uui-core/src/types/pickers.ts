import { ReactNode } from 'react';
import { IAnalyticableOnChange, ICanBeInvalid, IDisableable, IEditable, IDropdownToggler, IHasPlaceholder } from './props';
import { IDataSource, IDataSourceView, DataSourceState, CascadeSelection, SortingOption } from './dataSources';
import { DataRowProps, DataRowOptions } from './dataRows';

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
        /** Defines what to use as an empty value. If other value provided, it will be assumed as selection.
         */
        emptyValue?: [] | null;
    } & IEditable<TId[]>)
    | ({
        /** If 'single' provided - only one item is selected. In case of 'multi' - multiple items are selected */
        selectionMode: 'multi';
        /** Defines what to use in value/onValueChange: 'id' - item id (TId). 'entity' - the item itself (TItem) */
        valueType: 'entity';
        /** Defines what to use as an empty value. If other value provided, it will be assumed as selection.
         */
        emptyValue?: [] | null;
    } & IEditable<TItem[]>);

export type PickerBindingProps<TItem, TId> = SinglePickerProps<TId, TItem> | ArrayPickerProps<TId, TItem>;

export type PickerBindingValueType = 'scalar' | 'array';

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

    /** Overrides the default 'no records found' banner.
     * The 'search' callback parameter allows to distinguish cases when there's no records at all, and when current search doesn't find anything.  */
    renderNotFound?: (props: { search: string; onClose: () => void }) => ReactNode;

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
};

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
};

export type PickerBaseProps<TItem, TId> = PickerBaseOptions<TItem, TId> & PickerBindingProps<TItem, TId> & IAnalyticableOnChange<any>;

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
export interface IBasicPickerToggler extends IDropdownToggler {
    /** Call to clear toggler value */
    onClear?(e?: any): void;
}
