import React, { Attributes, ReactNode } from 'react';
import * as props from './props';
import { IEditable, IDisableable, ICanBeInvalid, ICheckable, IDndActor, SortDirection,
    IDropdownToggler, IHasCX, DropParams, FilterPredicateName } from '../types';
import { DataSourceListProps, DataSourceState, IDataSource } from '../data/processing';
import { IClickable, IDropdownBodyProps, IHasRawProps } from "./props";
import { ILens } from '..';
import { Link } from '../types';
import * as CSS from 'csstype';


/** Holds state of a Virtual List - top visible item index, and estimated count of visible items */
export interface VirtualListState {
    /**
     * Index of the topmost item, in rendered batch.
     * Note - this item might not be visible, as Virtual List maintain some reserve of rows on top / at the bottom of the list
     */
    topIndex?: number;
    /**
     * Number of currently rendered items.
     * Virtual list updates this value automatically, if it too small.
     * Note Virtual List renders more items, that actually visible,
     * as it need maintain some reserve of rows on top / at the bottom of the list.
     */
    visibleCount?: number;
    /**
     * Virtual list ensures that row with this Index is within the visible area, if not Virtual List .
     * Virtual list updates this value on scroll to null when appear in the visible area.
     * If this value is updated manually, Virtual List would scroll to the specified items.
     * It would attempt to put scroll so this item will be at the top of the list.
     */
    indexToScroll?: number;
    /**
     * Virtual List manually scroll to this Index when it appears not within the visible area.
     * It would attempt to put scroll so this item will be in the middle of the list.
     */
    focusedIndex?: number;
}

export interface DataTableState<TFilter = any> extends DataSourceState<TFilter> {
    columnsConfig?: ColumnsConfig;
    filtersConfig?: FiltersConfig;
    presetId?: number | null;
}

export interface DataColumnProps<TItem = any, TId = any, TFilter = any>
    extends IHasCX, IClickable, IHasRawProps<HTMLDivElement>, Attributes {
    /**
     * Unique key to identify the column. Used to reference columns, e.g. in ColumnsConfig.
     * Also, used as React key for cells, header cells, and other components inside tables.
     */
    key: string;

    /** Column caption. Can be a plain text, or any React Component */
    caption?: React.ReactNode;

    /** If specified, will make column fixed - it would not scroll horizontally */
    fix?: 'left' | 'right';

    /**
     * The width of the column. Usually, columns has exact this width.
     * When all columns fit, and there's spare horizontal space, you can use 'grow' prop to use this space for certain columns.
     * DataTable's columns can't shrink below width - table will add horizontal scrolling instead of shrinking columns
     */
    width: number;

    /** Minimal width to which column can be resized manually */
    minWidth?: number;

    /** The flex grow for the column. Allows column to grow in width if there's spare horizontal space */
    grow?: number;

    /** @deprecated Shrink prop doesn't affect anything in table columns. This prop will be removed in future versions. */
    shrink?: number;

    /** Aligns cell content horizontally */
    textAlign?: 'left' | 'center' | 'right';

    /** Align cell content vertically */
    alignSelf?: CSS.AlignSelfProperty;

    /**
     * Enables sorting arrows on the column.
     * Sorting state is kept in DataSourceState.sorting
     */
    isSortable?: boolean;

    /** Disallows to hide column via ColumnsConfiguration */
    isAlwaysVisible?: boolean;

    /** Makes column hidden by default. User can turn it on later, via ColumnsConfiguration */
    isHiddenByDefault?: boolean;

    /** Info tooltip displayed in the table header */
    info?: React.ReactNode;

    /**
     *  Should return true, if current filter affects the column.
     * Usually, this prop is filled automatically by the useTableState hook.
     * If you use the useTableState hook, you don't need to specify it manually.
     */
    isFilterActive?: (filter: TFilter, column: DataColumnProps<TItem, TId, TFilter>) => boolean;

    /** Render the cell content. The item props is the value of the whole row (TItem). */
    render?(item: TItem, props: DataRowProps<TItem, TId>): any;

    /** Overrides rendering of the whole cell */
    renderCell?(props: DataTableCellProps<TItem, TId>): any;

    /**
     * Renders column header dropdown.
     * Usually, this prop is filled automatically by the useTableState hook.
     * If you use the useTableState hook, you don't need to specify it manually.
     */
    renderDropdown?(): React.ReactNode;

    /**
     * Renders column filter.
     * If you use useTableState hook, and you specify filter for the column, default filter will be rendered automatically.
     * You can use this prop to render a custom filter component.
     */
    renderFilter?(lens: ILens<TFilter>, dropdownProps: IDropdownBodyProps): React.ReactNode;
}

export interface DataTableHeaderCellProps<TItem = any, TId = any> extends IEditable<DataTableState>, IDropdownToggler, IHasCX, DataTableColumnsConfigOptions {
    column: DataColumnProps<TItem, TId>;
    isFirstColumn: boolean;
    isLastColumn: boolean;
    selectAll?: ICheckable;
    isFilterActive?: boolean;
    sortDirection?: SortDirection;
    onSort(dir: SortDirection): void;
    onDrop?(params: DropParams<DataColumnProps<TItem, TId>, DataColumnProps<TItem, TId>>): void;
    renderFilter?: (dropdownProps: IDropdownBodyProps) => React.ReactNode;
}

export interface DataTableHeaderRowProps<TItem = any, TId = any> extends IEditable<DataTableState>, IHasCX, DataTableColumnsConfigOptions {
    columns: DataColumnProps<TItem, TId>[];
    selectAll?: ICheckable;
    onConfigButtonClick?: (params: DataTableConfigModalParams) => any;
    renderCell?: (props: DataTableHeaderCellProps<TItem, TId>) => React.ReactNode;
    renderConfigButton?: () => React.ReactNode;
}

export interface DataTableColumnsConfigOptions {
    allowColumnsReordering?: boolean;
    allowColumnsResizing?: boolean;
}

export interface DataTableCellProps<TItem = any, TId = any> extends IHasCX, props.IHasTabIndex {
    rowProps: DataRowProps<TItem, TId>;
    column: DataColumnProps<TItem, TId>;
    index?: number;
    role?: React.HTMLAttributes<HTMLElement>['role'];
}

export interface DataRowOptions<TItem, TId> extends IDisableable {
    checkbox?: { isVisible: boolean } & IDisableable & ICanBeInvalid;
    isSelectable?: boolean;
    dnd?: IDndActor<any, any>;
    onClick?(rowProps: DataRowProps<TItem, TId>): void;
    link?: Link;
    columns?: DataColumnProps<TItem, TId>[];
}

export interface DataRowPathItem<TId, TItem> {
    id: TId;
    value: TItem;
    isLastChild: boolean;
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
export type DataRowProps<TItem, TId> = props.FlexRowProps & DataRowOptions<TItem, TId> & {
    /** ID of the TItem rows displays */
    id: TId;

    /** Key of the TItem row displays. This is the ID converted to string.
     * We use this internally to identify rows, and hold rows them in various hash-tables.
     * ID can't be used for this, as it is not guaranteed to be comparable. E.g. one can use TID=[int, string] to hold composite IDs.
     * */
    rowKey: string;

    /** Index of the row, from the top of the list. This doesn't account any hierarchy. */
    index: number;

    /** The data item (TItem) row displays. Will be undefined if isLoading = true. */
    value?: TItem;

    /** ID of the parent TItem */
    parentId?: TId;

    /** Hierarchical path from the root node to the item (excluding the item itself) */
    path?: DataRowPathItem<TId, TItem>[];

    /* visual */

    /** Depth of the row in tree, 0 for the top-level */
    depth?: number;

    /** Indent of the item, to show hierarchy */
    indent?: number;

    /** True if row is in loading state. Value is empty in this case */
    isLoading?: boolean;

    /** True if row contains children and so it can be folded or unfolded */
    isFoldable?: boolean;

    /** True if row is currently unfolded */
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
     * We demand to pass the row as well, to avoid creating closures for each row.
     */
    onFocus?(focusedIndex: number): void;
};

export type ColumnsConfig = {
    [key: string]: IColumnConfig,
};

export type IColumnConfig =  {
    isVisible?: boolean;
    order?: string;
    width?: number;
};

export type FiltersConfig = {
    [key: string]: IFilterConfig;
};

export type IFilterConfig = {
    isVisible: boolean;
    order: string;
};

export type DataTableProps<TItem, TId> = DataSourceListProps & IEditable<DataSourceState> & {
    getRows(from: number, count: number): DataRowProps<TItem, TId>[];
    columns?: DataColumnProps<TItem, TId>[];
    renderRow?(props: DataRowProps<TItem, TId>): React.ReactNode;
};

export type DataTableConfigModalParams = IEditable<DataSourceState> & {
    columns: DataColumnProps<any, any>[],
};

export type IFilterPredicate = {
    name: string;
    predicate: FilterPredicateName;
    isDefault?: boolean;
};

type FilterConfigBase<TFilter> = {
    title: string;
    field: keyof TFilter;
    columnKey: string;
    isAlwaysVisible?: boolean;
    predicates?: IFilterPredicate[];
};

type PickerFilterConfig<TFilter> = FilterConfigBase<TFilter> & {
    type: "singlePicker" | "multiPicker";
    dataSource: IDataSource<any, any, any>;
    getName?: (item: any) => string;
    renderRow?: (props: DataRowProps<any, any>) => ReactNode;
    valueType?: "id";
};

type DatePickerFilterConfig<TFilter> = FilterConfigBase<TFilter> & {
    type: "datePicker" | "rangeDatePicker";
    format?: string;
};

export type TableFiltersConfig<TFilter> = PickerFilterConfig<TFilter>
    | DatePickerFilterConfig<TFilter>;

export interface ITablePreset<TFilter = Record<string, any>> {
    name: string;
    id: number | null;
    filter: TFilter;
    isReadonly?: boolean;
    columnsConfig: ColumnsConfig;
}

export interface IPresetsApi {
    activePresetId: number | null;
    isDefaultPresetActive: boolean;
    choosePreset(preset: ITablePreset): void;
    createNewPreset(name: string): Promise<number>;
    resetToDefault(): void;
    hasPresetChanged(preset: ITablePreset): boolean;
    duplicatePreset(preset: ITablePreset): void;
    deletePreset(preset: ITablePreset): Promise<void>;
    updatePreset(preset: ITablePreset): Promise<void>;
    presets: ITablePreset[];
}

export interface ITableState<TFilter = Record<string, any>> extends IPresetsApi {
    tableState: DataTableState;
    setTableState(newState: DataTableState): void;
    setFilter(filter: TFilter): void;
    setColumnsConfig(columnsConfig: ColumnsConfig): void;
    setFiltersConfig(filtersConfig: FiltersConfig): void;
}
