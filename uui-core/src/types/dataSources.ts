import { SortingOption } from './dataQuery';
import { ICheckable } from './props';
import { DataRowOptions, DataRowProps } from './dataRows';

export interface VirtualListRange {
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
}

export interface ScrollToConfig {
    index?: number;
}

/** Holds state of a Virtual List - top visible item index, and estimated count of visible items */
export interface VirtualListState extends VirtualListRange {
    /**
     * Virtual list ensures that row with this Index is within the visible area, if not Virtual List .
     * Virtual list updates this value on scroll to null when appear in the visible area.
     * If this value is updated manually, Virtual List would scroll to the specified items.
     * It would attempt to put scroll so this item will be at the top of the list.
     */
    scrollTo?: ScrollToConfig;
    /**
     * Virtual List manually scroll to this Index when it appears not within the visible area.
     * It would attempt to put scroll so this item will be in the middle of the list.
     */
    focusedIndex?: number;
}

export interface IDataSource<TItem, TId, TFilter> {
    getId(item: TItem): TId;
    getById(id: TId): TItem | void;
    setItem(item: TItem): void;
    getView(value: DataSourceState<any, TId>, onValueChange: (val: DataSourceState<any, TId>) => any, options?: any): IDataSourceView<TItem, TId, TFilter>;
    useView(value: DataSourceState<any, TId>, onValueChange: (val: DataSourceState<any, TId>) => any, options?: any, deps?: any[]): IDataSourceView<TItem, TId, TFilter>;
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

export const CascadeSelectionTypes = {
    IMPLICIT: 'implicit',
    EXPLICIT: 'explicit',
} as const;

export type CascadeSelection = boolean | typeof CascadeSelectionTypes.EXPLICIT | typeof CascadeSelectionTypes.IMPLICIT;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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

    backgroundReload?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type IDataSourceView<TItem, TId, TFilter> = {
    getById(id: TId, index: number): DataRowProps<TItem, TId>;
    getListProps(): DataSourceListProps;
    getVisibleRows(): DataRowProps<TItem, TId>[];
    getSelectedRows(range?: VirtualListRange): DataRowProps<TItem, TId>[];
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
    isReloading?: boolean;
}

// Lazy Data Source API

/** The common part of LazyDataSourceApiRequest, which defines how list should be filtered and sorted */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
export type LazyDataSourceApi<TItem, TId, TFilter> = (
    request: LazyDataSourceApiRequest<TItem, TId, TFilter>,
    context?: LazyDataSourceApiRequestContext<TItem, TId>
) => Promise<LazyDataSourceApiResponse<TItem>>;
