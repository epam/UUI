import { SortingOption } from "./dataQuery";
import { FlexRowProps, ICanBeInvalid, ICheckable, IDisableable, IEditable } from "./props";
import { IDndActor } from './dnd';
import { Link } from './objects';

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

export interface IDataSource<TItem, TId, TFilter> {
    getId(item: TItem): TId;
    getById(id: TId): TItem;
    setItem(item: TItem): void;
    getView(value: DataSourceState<any, TId>, onValueChange: (val: DataSourceState<any, TId>) => any, options?: any): IDataSourceView<TItem, TId, TFilter>;
    useView(value: DataSourceState<any, TId>, onValueChange: (val: DataSourceState<any, TId>) => any, options?: any): IDataSourceView<TItem, TId, TFilter>;
    unsubscribeView(onValueChange: (val: DataSourceState<any, TId>) => any): void;
}

/** Holds state of a components displaying lists - like tables. Holds virtual list position, filter, search, selection, etc. */
export interface DataSourceState<TFilter = Record<string, any>, TId = any> extends VirtualListState {
    search?: string;
    checked?: TId[];
    folded?: Record<string, boolean>;
    filter?: TFilter;
    sorting?: SortingOption[];
    selectedId?: TId;
    focusedIndex?: number;
    page?: number;
    pageSize?: number;
}

/** Holds parent info for data rows */
export interface DataRowPathItem<TId, TItem> {
    id: TId;
    value: TItem;
    isLastChild: boolean;
}

export const CascadeSelectionTypes = {
    IMPLICIT: 'implicit',
    EXPLICIT: 'explicit',
} as const;

export type CascadeSelection =
    | boolean
    | typeof CascadeSelectionTypes.EXPLICIT
    | typeof CascadeSelectionTypes.IMPLICIT;

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
export type DataRowProps<TItem, TId> = FlexRowProps & DataRowOptions<TItem, TId> & {
    /** ID of the TItem rows displays */
    id: TId;

    /** Key to be used as component's key when rendering. Usually, it's stringified ID */
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

    /** Indent of the item, to show hierarchy.
     *  Unlike depth, it contains additional logic, to not add unnecessary indents:
     *  if all children of node has no children, all nodes would get the same indent as parent.
     */
    indent?: number;

    /** True if row is in loading state. 'value' is empty in this case */
    isLoading?: boolean;

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

export interface BaseListViewProps<TItem, TId, TFilter> {
    /**
     * Should return unique ID of the TItem
     * If omitted, we assume that every TItem has and unique id in its 'id' field.
     * @param item An item to get ID of
     */
    getId?(item: TItem): TId;

    /**
     * Set to true, if you use IDs which can't act as javascript Map key (objects or arrays).
     * In this case, IDs will be internally JSON.stringify-ed to be used as Maps keys.
     */
    complexIds?: boolean;

    /** Should return ID of the Item's parent. Usually it's i => i.parentId.
     * If specified, Data Source will build items hierarchy.
     *
     * Also, it is used by LazyDataSource to pre-fetch missing parents of loaded items. This is required in following cases:
     * - when a child item is pre-selected, but not yet loaded at start. We need to load it's parent chain
     *   to highlight parents with selected children
     * - in flattenSearch mode, we usually want to display a path to each item (e.g. Canada/Ontario/Paris),
     *   We need to load parents with a separate call (if backend doesn't pre-fetch them)
     */
    getParentId?(item: TItem): TId | undefined;

    /**
     * Specifies if rows are selectable, checkable, draggable, clickable, and more.
     * See DataRowOptions for more details.
     * If options depends on the item itself, use getRowOptions.
     * Specifying both rowOptions and getRowOptions might help to render better loading skeletons: we use only rowOptions in this case, as we haven't loaded an item yet.
     * Make sure all callbacks are properly memoized, as changing them will trigger re-renders or row, which would impact performance
     * @param item An item to get options for
     */
    rowOptions?: DataRowOptions<TItem, TId>;

    /**
     * For each row, specify if row is selectable, editable, checkable, draggable, clickable, have its own set of columns, and more.
     * To make rows editable, pass IEditable interface to each row. This works the same way as for other editable components.
     * See DataRowOptions for more details.
     * If both getRowOptions and rowOptions specified, we'll use getRowOptions for loaded rows, and rowOptions only for loading rows.
     * Make sure all callbacks are properly memoized, as changing them will trigger re-renders or row, which would impact performance
     * @param item An item to get options for
     */
    getRowOptions?(item: TItem, index: number): DataRowOptions<TItem, TId>;

    /**
     * Can be specified to unfold all or some items at start.
     * If not specified, all rows would be folded.
     */
    isFoldedByDefault?(item: TItem): boolean;

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

    /**
     * Enables or disables "select all" checkbox. Default is true.
     */
    selectAll?: true | false;
}

export type IDataSourceView<TItem, TId, TFilter> = {
    getById(id: TId, index: number): DataRowProps<TItem, TId>;
    getListProps(): DataSourceListProps;
    getVisibleRows(): DataRowProps<TItem, TId>[];
    getSelectedRows(topIndex: number, visibleCount?: number): DataRowProps<TItem, TId>[];
    getSelectedRowsCount(): number;
    reload(): void;
    destroy(): void;
    loadData(): void;
    _forceUpdate(): void;
    selectAll?: ICheckable;
};

export type DataSourceListCounts = {
    /**
     * Count of rows, after applying filter, and folding on tree nodes.
     * Obsolete! Please switch to exactRowsCount / knownRowsCount
     */
    rowsCount?: number;

    /** Count of rows, if all rows loaded. Can be null while initial loading, or if API doesn't return count  */
    exactRowsCount?: number;

    /**
     * There's at least knownRowsCount rows. There can be more if list is lazy loaded.
     * Equals to exactRowsCount if all rows are loaded, or if API returns rows count
     * Otherwise, exactRowsCount will be null, and knownRowsCount will specify number of loaded rows.
     */
    knownRowsCount?: number;

    /** Total count of items, before applying the filter. If there's a tree, it counts all nodes, including folded children  */
    totalCount?: number;
};

export interface DataSourceListProps extends DataSourceListCounts {
    selectAll?: ICheckable;
}


// Lazy Data Source API


/** The common part of LazyDataSourceApiRequest, which defines how list should be filtered and sorted */
export interface LazyDataSourceApiRequestOptions<TItem, TFilter> {
    filter?: TFilter;
    sorting?: SortingOption[];
    search?: string;
}

/** The range (from/count) of required rows for LazyDataSourceApiRequest */
export interface LazyDataSourceApiRequestRange {
    from: number;
    count?: number;
}

/** Defines input arguments for Lazy Data Source APIs */
export interface LazyDataSourceApiRequest<TItem, TId = any, TFilter = {}> extends LazyDataSourceApiRequestOptions<TItem, TFilter> {
    range?: LazyDataSourceApiRequestRange;
    page?: number;
    pageSize?: number;
    ids?: TId[];
}

/** Defines Lazy Data Source APIs response shape */
export interface LazyDataSourceApiResponse<TItem> {
    /** List of items which was requested via API */
    items: TItem[];

    /**
     * API can set 'from' field if it wants to return more items than what was requested in request.range.
     * This can be used to return all items at once (with from:0, count: totalCount), or align response to pages.
     */
    from?: number;

    /** Total count of items which match current filter. If not specified, total count will be detected only when user scrolls to the end of the list. */
    count?: number;
}

/** Defines the context of API request. E.g. parent if we require to retrieve sub-list of the tree */
export interface LazyDataSourceApiRequestContext<TItem, TId> {
    parentId?: TId | null;
    parent?: TItem | null;
}

/** Defines API to retrieve data for DataSources */
export type LazyDataSourceApi<TItem, TId, TFilter> =
    (
        request: LazyDataSourceApiRequest<TItem, TId, TFilter>,
        context?: LazyDataSourceApiRequestContext<TItem, TId>,
    ) => Promise<LazyDataSourceApiResponse<TItem>>;



