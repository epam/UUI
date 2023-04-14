import {
    DataRowProps, IEditable, DataSourceState,
    LazyDataSourceApi, DataSourceListProps, IDataSourceView, BaseListViewProps, DataRowPathItem
} from "../../../types";
import isEqual from 'lodash.isequal';
import { BaseListView } from "./BaseListView";
import { ListApiCache } from '../ListApiCache';
import { Tree, LoadTreeOptions } from './Tree';

export type SearchResultItem<TItem> = TItem & { parents?: [TItem] };

export interface LazyListViewProps<TItem, TId, TFilter> extends BaseListViewProps<TItem, TId, TFilter> {
    /**
     * A function to retrieve the data, asynchronously.
     * This function usually performs a REST API call.
     * API is used to retrieve lists of items.
     * It is expected to:
     * - be able to handle paging (via from/count params)
     * - be able to retrieve specific items by the list of their ids
     * - be able to retrieve children by parents (when getChildCount is specified, and ctx.parentId is passed)
     */
    api: LazyDataSourceApi<TItem, TId, TFilter>;

    /**
     * Should return number of children of the item.
     * If it returns > 0, the item is assumed to have children and to be foldable.
     * Usually, this value should be returned from API.
     *
     * If you can't get number of children via API, you can return a guess value (avg number of children for this type of entity).
     * Note, that this can lead to more API calls, and increased load times in the 'parallel' fetch mode.
     * @param item
     */
    getChildCount?(item: TItem): number;

    /**
     * A filter to pass to API.
     * Note, that the DataSourceState also has a filter fields. These two filters are merged before API calls.
     * Use this prop if you need to apply some filter in any case.
     * Prefer to use filter in the DataSourceState for end-user editable filters.
     */
    filter?: TFilter;

    /**
     * Defines how to fetch children:
     * sequential (default) - fetch children for each parent one-by-one. Makes minimal over-querying, at cost of some speed.
     * parallel - fetch children for several parents simultaneously. Can make a lot of over-querying for deep trees.
     *      Recommended for 2 level trees (grouping), as it makes no over-querying in this case, and is faster than sequential strategy.
     */
    fetchStrategy?: 'sequential' | 'parallel';

    /**
     * Falls back to plain list from tree, if there's search.
     * Default is true.
     *
     * If enabled, and search is active:
     * - API will be called with parentId and parent undefined
     * - getChildCount is ignored, all nodes are assumed to have no children
     *
     * See more here: https://github.com/epam/UUI/issues/8
     */
    flattenSearchResults?: boolean;
}

interface LoadResult<TItem, TId, TFilter> {
    isUpdated: boolean;
    isOutdated: boolean;
    tree: Tree<TItem, TId>;
}

export class LazyListView<TItem, TId, TFilter = any> extends BaseListView<TItem, TId, TFilter> implements IDataSourceView<TItem, TId, TFilter> {
    public props: LazyListViewProps<TItem, TId, TFilter>;
    public value: DataSourceState<TFilter, TId> = null;
    private hasMoreRows: boolean = true;
    private cache: ListApiCache<TItem, TId, TFilter>;
    private isUpdatePending = false;
    private loadedValue: DataSourceState<TFilter, TId> = null;
    private loadedProps: LazyListViewProps<TItem, TId, TFilter>;

    constructor(editable: IEditable<DataSourceState<TFilter, TId>>, props: LazyListViewProps<TItem, TId, TFilter>, cache?: ListApiCache<TItem, TId, TFilter>) {
        super(editable, props);
        this.props = this.applyDefaultsToProps(props);
        this.tree = Tree.blank<TItem, TId>(props);
        this.cache = cache;
        if (!this.cache) {
            this.cache = new ListApiCache({
                api: this.props.api,
                getId: this.props.getId,
                onUpdate: () => this._forceUpdate(),
            });
        }
        this.update(editable.value, this.props);
    }

    private defaultGetId = (i: any) => i.id;

    protected applyDefaultsToProps(props: LazyListViewProps<TItem, TId, TFilter>): LazyListViewProps<TItem, TId, TFilter> {
        if ((props.cascadeSelection || props.flattenSearchResults) && !props.getParentId) {
            console.warn("LazyListView: getParentId prop is mandatory if cascadeSelection or flattenSearchResults are enabled");
        }

        return {
            ...props,
            getId: props.getId ?? this.defaultGetId,
        }
    }

    public update(newValue: DataSourceState<TFilter, TId>, props: LazyListViewProps<TItem, TId, TFilter>): void {
        this.isUpdatePending = true;

        if (!isEqual(newValue?.checked, this.value?.checked)) {
            this.updateCheckedLookup(newValue.checked);
        }

        // We assume value to be immutable. However, we can't guarantee this.
        // Let's shallow-copy value to survive at least simple cases when it's mutated outside
        this.value = { topIndex: 0, visibleCount: 20, ...newValue };

        this.props = props;

        this.updateRowOptions();
    }

    private updateRowsAndLoadMissing(): void {
        if (!this.isUpdatePending) {
            return;
        }

        const prevValue = this.loadedValue;
        const prevProps = this.loadedProps;
        this.loadedValue = this.value;
        this.loadedProps = this.props;
        this.isUpdatePending = false;

        let completeReset = false;

        if (prevValue == null
            || prevProps == null
            || this.tree == null
            || this.value.search !== prevValue.search
            || !isEqual(this.value.sorting, prevValue.sorting)
            || !isEqual(this.value.filter, prevValue.filter)
            || !isEqual(this.props.filter, prevProps.filter)
            || this.value.page !== prevValue.page
            || this.value.pageSize !== prevValue.pageSize
        ) {
            this.tree = this.tree ? this.tree.clearStructure() : Tree.blank<TItem, TId>(this.props);
            completeReset = true;
        }

        let isFoldingChanged = !prevValue || this.value.folded !== prevValue.folded;

        const newValueLastIndex = this.value.topIndex + this.value.visibleCount;
        const moreRowsNeeded = newValueLastIndex > this.rows.length;

        if (completeReset
            || !isEqual(this.value.checked, prevValue.checked)
            || this.value.selectedId !== prevValue.selectedId
            || isFoldingChanged
            || !isEqual(this.props.rowOptions, prevProps.rowOptions)
            || this.props.getRowOptions !== prevProps.getRowOptions
            || moreRowsNeeded
        ) {
            this.updateCheckedLookup(this.value.checked);
            this.rebuildRows();
        }

        if (!prevValue || this.value.focusedIndex != prevValue.focusedIndex) {
            this.updateFocusedItem();
        }

        if (completeReset || isFoldingChanged || moreRowsNeeded) {
            this.loadMissing(completeReset)
                .then(({ isUpdated, isOutdated }) => {
                    if (isUpdated && !isOutdated) {
                        this.rebuildRows();
                        this._forceUpdate();
                    }
                });
        }
    }

    private updateFocusedItem() {
        this.rows.forEach(row => {
            row.isFocused = this.value.focusedIndex === row.index;
            return row;
        });
    }

    public reload() {
        this.tree = null;
        this.update(this.value, this.props);
    }

    public getById = (id: TId, index: number) => {
        const item = this.cache.byId(id);
        if (item !== null) {
            return this.getRowProps(item, index);
        } else {
            return this.getLoadingRow('_loading_' + id, index, []);
        }
    }

    // Wrap props.api to update items in the items store
    private api: LazyDataSourceApi<TItem, TId, TFilter> = async (rq, ctx) => {
        const cachedItems: TItem[] = [];
        if (this.cache && rq.ids && rq.ids.length > 0) {
            const missingIds: TId[] = [];
            rq.ids.forEach(id => {
                const cachedItem = this.cache.byId(id, false);
                if (cachedItem) {
                    cachedItems.push(cachedItem);
                } else {
                    missingIds.push(id);
                }
            });

            if (missingIds.length > 0) {
                rq.ids = missingIds;
            } else {
                return { items: cachedItems };
            }
        }

        // TBD: don't fetch at all, if all IDS were in cache
        const response = await this.props.api(rq, ctx);

        if (this.cache && response.items) {
            response.items.forEach(item => {
                this.cache.setItem(item);
            });
        }

        response.items = [...response.items, ...cachedItems];

        return response;
    }

    // Loads node. Returns promise to a loaded node.

    private inProgressPromise: Promise<LoadResult<TItem, TId, TFilter>> = null;

    private loadMissing(abortInProgress: boolean, options?: Partial<LoadTreeOptions<TItem, TId, TFilter>>): Promise<LoadResult<TItem, TId, TFilter>> {
        // Make tree updates sequential, by executing all consequent calls after previous promise completed

        if (this.inProgressPromise === null || abortInProgress) {
            this.inProgressPromise = Promise.resolve({ isUpdated: false, isOutdated: false, tree: this.tree });
        }

        this.inProgressPromise = this.inProgressPromise.then(() => this.loadMissingImpl(options));

        return this.inProgressPromise;
    }

    private async loadMissingImpl(options?: Partial<LoadTreeOptions<TItem, TId, TFilter>>): Promise<LoadResult<TItem, TId, TFilter>> {
        const loadingTree = this.tree;

        try {
            const newTreePromise = this.tree.load(
                {
                    ...this.props,
                    ...options,
                    isFolded: (node) => this.isFolded(node),
                    api: this.api,
                    filter: { ...{}, ...this.props.filter, ...this.value.filter },
                },
                this.value,
            );

            const newTree = await newTreePromise;

            // If this.tree is changed during this load, than there was reset occurred (new value arrived)
            // We need to tell caller to reject this result
            const isOutdated = this.tree != loadingTree;
            const isUpdated = this.tree !== newTree;

            if (!isOutdated) {
                this.tree = newTree;
            }

            return { isUpdated, isOutdated, tree: newTree };

        } catch (e) {
            // TBD - correct error handling
            console.error("LazyListView: Error while loading items.", e);
            return { isUpdated: false, isOutdated: false, tree: loadingTree };
        }
    }

    // Extracts a flat list of currently visible rows from the tree
    private rebuildRows() {
        const rows: DataRowProps<TItem, TId>[] = [];
        let index = 0;
        let lastIndex = this.value.topIndex + this.value.visibleCount;
        const flatten = this.value.search && this.props.flattenSearchResults;

        const iterateNode = (
            parentId: TId,
            appendRows: boolean, // Will be false, if we are iterating folded nodes.
            estimatedCount: number = null,
            indent: number = 0,
        ) => {
            let addedCount = 0;
            let stats = {
                isSomeCheckable: false,
                isSomeChecked: false,
                isAllChecked: true,
                isSomeSelected: false,
                hasMoreRows: false,
            };

            const layerRows: DataRowProps<TItem, TId>[] = [];
            const nodeInfo = this.tree.getNodeInfo(parentId);

            const ids = this.tree.getChildrenIdsByParentId(parentId);
            if (ids.includes(parentId)) {
                throw new Error(`LazyListView: element with parentId = ${ parentId } was specified as its own child. Possibly, you API is requesting wrong data.`);
            }

            for (let n = 0; n < ids.length; n++) {
                const id = ids[n];
                const item = this.tree.getById(id);

                const row = this.getRowProps(item, index);
                if (appendRows && index < lastIndex) {
                    rows.push(row);
                    row.indent = indent + 1;
                    layerRows.push(row);
                    index++;
                    addedCount++;
                }

                if (row.checkbox) {
                    stats.isSomeCheckable = true;
                    if (row.isChecked) {
                        stats.isSomeChecked = true;
                    } else if (!row.checkbox.isDisabled) {
                        stats.isAllChecked = false;
                    }
                }

                if (row.isSelected) {
                    stats.isSomeSelected = true;
                }

                row.isFoldable = false;
                row.isLastChild = (n == ids.length - 1) && (nodeInfo.count === ids.length);
                if (!flatten && this.props.getChildCount) {
                    let estimatedChildrenCount = this.props.getChildCount(item);
                    const childrenIds = this.tree.getChildrenIdsByParentId(id);
                    const childrenInfo = this.tree.getNodeInfo(id);

                    if (childrenInfo && childrenInfo.count != null) {
                        // nodes are already loaded, and we know the actual count
                        estimatedChildrenCount = childrenInfo.count;
                    }

                    if (estimatedChildrenCount > 0) {
                        row.isFoldable = true;
                        row.isFolded = this.isFolded(item);
                        row.onFold = row.isFoldable && this.handleOnFold;

                        if (childrenIds.length > 0) { // some children are loaded
                            const childStats = iterateNode(id, appendRows && !row.isFolded, estimatedChildrenCount, indent + 1);
                            row.isChildrenChecked = childStats.isSomeChecked;
                            row.isChildrenSelected = childStats.isSomeSelected;
                            stats.isSomeCheckable = stats.isSomeCheckable || childStats.isSomeCheckable;
                            stats.isSomeChecked = stats.isSomeChecked || childStats.isSomeChecked;
                            stats.isAllChecked = stats.isAllChecked && childStats.isAllChecked;
                            stats.hasMoreRows = stats.hasMoreRows || childStats.hasMoreRows;
                        } else { // children are not loaded
                            const parentsWithRow = [...row.path, this.tree.getPathItem(item)];

                            if (!row.isFolded && appendRows) {
                                for (let m = 0; m < estimatedChildrenCount && index < lastIndex; m++) {
                                    const row = this.getLoadingRow('_loading_' + index, index, parentsWithRow);
                                    row.indent = parentsWithRow.length + 1;
                                    row.isLastChild = m == (estimatedChildrenCount - 1);
                                    rows.push(row);
                                    index++;
                                    addedCount++;
                                }
                            }
                        }
                    }
                }
            }

            const pathToParent = this.tree.getPathById(parentId);
            const path = parentId ? [...pathToParent, this.tree.getPathItem(this.tree.getById(parentId))] : pathToParent;

            if (appendRows) {
                let missingCount: number;

                // Estimate how many more nodes there are at current level, to put 'loading' placeholders.

                if (nodeInfo.count != null) { // Exact count known
                    missingCount = nodeInfo.count - addedCount;
                } else if (estimatedCount == null && rows.length < lastIndex) { // estimatedCount = null for top-level rows only.
                    missingCount = lastIndex - rows.length; // let's put placeholders down to the bottom of visible list
                } else if (estimatedCount > addedCount) { // According to getChildCount (put into estimatedCount), there are more rows on this level
                    missingCount = estimatedCount - addedCount;
                } else {
                    // We have a bad estimate - it even less that actual items we have
                    // This would happen is getChildCount provides a guess count, and we scroll thru children past this count
                    // let's guess we have at least 1 item more than loaded
                    missingCount = 1;
                }

                if (missingCount > 0) {
                    stats.hasMoreRows = true;
                }

                // Append loading rows, stop at lastIndex (last row visible)
                while (index < lastIndex && missingCount > 0) {
                    const row = this.getLoadingRow('_loading_' + index, index, path);
                    rows.push(row);
                    layerRows.push(row);
                    index++;
                    addedCount++;
                    missingCount--;
                }
            }

            const isListFlat = path.length === 0 && !layerRows.some(r => r.isFoldable);
            if (isListFlat || flatten) {
                layerRows.forEach(r => r.indent = 0);
            }
            return stats;
        };

        const rootStats = iterateNode(undefined, true);

        if (rootStats.isSomeCheckable && this.isSelectAllEnabled()) {
            this.selectAll = {
                value: rootStats.isAllChecked,
                onValueChange: this.handleSelectAllCheck,
                indeterminate: this.value.checked && this.value.checked.length > 0 && !rootStats.isAllChecked,
            };
        } else if (this.tree.getRootIds().length === 0 && this.props.rowOptions?.checkbox?.isVisible && this.isSelectAllEnabled()) {
            // Nothing loaded yet, but we guess that something is checkable. Add disabled checkbox for less flicker.
            this.selectAll = {
                value: false,
                onValueChange: () => {},
                isDisabled: true,
                indeterminate: this.value.checked?.length > 0,
            };
        } else {
            this.selectAll = null;
        }

        this.rows = rows;
        this.hasMoreRows = rootStats.hasMoreRows;
    }

    protected handleOnCheck = (rowProps: DataRowProps<TItem, TId>) => {
        let id = rowProps.id;
        let isChecked = !rowProps.isChecked;

        this.updateChecked(isChecked, false, id);
    }

    protected handleSelectAllCheck = (value: boolean) => {
        this.updateChecked(value, true);
    }

    private async updateChecked(isChecked: boolean, isRoot: boolean, checkedId?: TId) {
        let checked = this.value && this.value.checked || [];

        let tree = this.tree;

        if (this.props.cascadeSelection || isRoot) {
            let result = await this.loadMissing(
                false,
                { loadAllChildren: id => isRoot || (id === checkedId) }
            );
            tree = result.tree;
        }

        checked = tree.cascadeSelection(
            checked,
            checkedId,
            isChecked,
            {
                cascade: isRoot || this.props.cascadeSelection,
                isSelectable: (item: TItem) => {
                    const { isCheckable } = this.getRowProps(item, null);
                    return isCheckable;
                }
            }
        );

        this.handleCheckedChange(checked);
    }

    public getVisibleRows = () => {
        this.updateRowsAndLoadMissing();

        const from = this.value.topIndex;
        const count = this.value.visibleCount;

        const rows = this.rows.slice(from, from + count);

        const listProps = this.getListProps();

        if (this.hasMoreRows) {
            // We don't run rebuild rows on scrolling. We rather wait for the next load to happen.
            // So there can be a case when we haven't updated rows (to add more loading rows), and view is scrolled down
            // We need to add more loading rows in such case.

            const lastRow = this.rows[this.rows.length - 1];

            while (rows.length < count && (from + rows.length) < listProps.rowsCount) {
                const index = from + rows.length;
                const row = this.getLoadingRow('_loading_' + index, index);
                row.indent = lastRow.indent;
                row.path = lastRow.path;
                row.depth = lastRow.depth;
                rows.push(row);
            }
        }

        return rows;
    }

    public getListProps = (): DataSourceListProps => {
        this.updateRowsAndLoadMissing();

        let rowsCount: number;
        let totalCount: number;
        let lastVisibleIndex = this.value.topIndex + this.value.visibleCount;
        let rootInfo = this.tree.getNodeInfo(undefined);
        let rootCount = rootInfo.count;

        if (!this.props.getChildCount && rootCount) {
            // We have a flat list, and know exact count of items on top level. So, we can have an exact number of rows w/o iterating the whole tree.
            rowsCount = rootCount;
            totalCount = rootCount;
        } else if (!this.hasMoreRows) {
            // We are at the bottom of the list. Some children might still be loading, but that's ok - we'll re-count everything after we load them.
            rowsCount = this.rows.length;
            totalCount = this.tree.getTotalRecursiveCount();
        } else {
            // We definitely have more rows to show below the last visible row.
            // We need to add at least 1 row below, so VirtualList or other component would not detect the end of the list, and query loading more rows later.
            // We have to balance this number.
            // To big - would make scrollbar size to shrink when we hit bottom
            // To small - and VirtualList will re-request rows until it will fill it's last block.
            // So, it should be at least greater than VirtualList block size (default is 20)
            // Probably, we'll move this const to props later if needed;
            const rowsToAddBelowLastKnown = 20;

            rowsCount = Math.max(this.rows.length, lastVisibleIndex + rowsToAddBelowLastKnown);
        }

        return {
            rowsCount,
            knownRowsCount: this.rows.length,
            exactRowsCount: this.rows.length,
            totalCount,
            selectAll: this.selectAll,
        };
    }
}
