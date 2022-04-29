import { DataRowProps, IEditable } from "../../../types";
import { DataSourceState, LazyDataSourceApi } from '../types';
import { DataSourceListProps, IDataSourceView } from './types';
import isEqual from 'lodash.isequal';
import { BaseListView, BaseListViewProps } from "./BaseListView";
import { ListApiCache } from '../ListApiCache';
import { LazyTree, LazyTreeFetchStrategy, LazyTreeItem, LazyTreeList, LazyTreeParams, loadLazyTree } from './LazyTree';

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

    /** Should return ID of the Item's parent. Usually it's i => i.parentId.
     * Used to pre-fetch parents of loaded items, which are required in following cases:
     * - when a child item is pre-selected, but not yet loaded at start. We need to load it's parent chain
     *   to highlight parents with selected children
     * - in flattenSearch mode, we usually want to display a path to each item (e.g. Canada/Ontario/Paris),
     *   We need to load parents with a separate call (if backend doesn't pre-fetch them)
     */
    getParentId?(item: TItem): TId;

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
    fetchStrategy?: LazyTreeFetchStrategy;

    /**
     * Falls back to plain list from tree, if there's search.
     * Default is true.
     *
     * If enabled, and search is active:
     * - API will be called with parentId and parent undefined
     * - getChildCount is ignore, all nodes are assumed to have no children
     *
     * See more here: https://github.com/epam/UUI/issues/8
     */
    flattenSearchResults?: boolean;
}

interface LoadResult<TItem, TId> {
    isUpdated: boolean;
    isOutdated: boolean;
    tree: LazyTree<TItem, TId>;
}

export class LazyListView<TItem, TId, TFilter = any> extends BaseListView<TItem, TId, TFilter> implements IDataSourceView<TItem, TId, TFilter> {
    public props: LazyListViewProps<TItem, TId, TFilter>;
    public value: DataSourceState<TFilter, TId> = null;
    private tree: LazyTree<TItem, TId>;
    private rows: DataRowProps<TItem, TId>[] = [];
    private hasMoreRows: boolean = true;
    private cache: ListApiCache<TItem, TId, TFilter>;
    private isUpdatePending = false;
    private loadedValue: DataSourceState<TFilter, TId> = null;
    private loadedProps: LazyListViewProps<TItem, TId, TFilter>;

    constructor(editable: IEditable<DataSourceState<TFilter, TId>>, props: LazyListViewProps<TItem, TId, TFilter>, cache?: ListApiCache<TItem, TId, TFilter>) {
        super(editable, props);
        this.props = props;
        this.cache = cache;
        if (!this.cache) {
            this.cache = new ListApiCache({
                api: this.props.api,
                getId: this.props.getId,
                onUpdate: () => this._forceUpdate(),
            });
        }
        this.update(editable.value, props);
    }

    protected getParentId = (item: TItem) => {
        try {
            return this.props.getParentId ? this.props.getParentId(item) : (item as any).parentId;
        } catch (err) {
            throw new Error('Attempt to get parentId field for item, if you have it in another field, provide your own getParentId callback');
        }
    }

    public update(newValue: DataSourceState<TFilter, TId>, props: LazyListViewProps<TItem, TId, TFilter>): void {
        this.isUpdatePending = true;

        if (!isEqual(newValue.checked, this.value?.checked)) {
            this.updateCheckedLookup(newValue.checked);
        }

        // We assume value to be immutable. However, we can't guarantee this.
        // Let's shallow-copy value to survive at least simple cases when it's mutated outside
        this.value = { topIndex: 0, visibleCount: 20, ...newValue };

        this.props = props;
    }

    private resetTreeItems(tree: LazyTree<TItem, TId>): LazyTree<TItem, TId> {
        return {
            items: [],
            byKey: tree?.byKey || {},
            byParentKey: tree?.byParentKey || {} ,
        };
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
            this.tree = this.resetTreeItems(this.tree);
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
            return this.getRowProps(item, index, []);
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
                return { items: cachedItems }
            }
        }

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

    private inProgressPromise: Promise<LoadResult<TItem, TId>> = null;

    private loadMissing(abortInProgress: boolean, options?: Partial<LazyTreeParams<TItem, TId, TFilter>>): Promise<LoadResult<TItem, TId>> {
        // Make tree updates sequential, by executing all consequent calls after previous promise completed

        if (this.inProgressPromise === null || abortInProgress) {
            this.inProgressPromise = Promise.resolve({ isUpdated: false, isOutdated: false, tree: this.tree });
        }

        this.inProgressPromise = this.inProgressPromise.then(() => this.loadMissingImpl(options));

        return this.inProgressPromise;
    }

    private async loadMissingImpl(options?: Partial<LazyTreeParams<TItem, TId, TFilter>>): Promise<LoadResult<TItem, TId>> {
        const loadingTree = this.tree;

        const newTreePromise = loadLazyTree(
            this.tree,
            {
                api: this.api,
                filter: this.props.filter,
                getChildCount: this.props.getChildCount,
                getId: this.props.getId,
                getParentId: this.getParentId,
                isFolded: (node) => this.isFolded(node),
                ...options,
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
    }

    // Extracts a flat list of currently visible rows from the tree
    private rebuildRows() {
        const rows: DataRowProps<TItem, TId>[] = [];
        let index = 0;
        let lastIndex = this.value.topIndex + this.value.visibleCount;
        const flatten = this.value.search && this.props.flattenSearchResults;

        const iterateNode = (
            node: LazyTreeList<TItem, TId>,
            appendRows: boolean,
            parents: DataRowProps<TItem, TId>[],
            estimatedCount: number = null,
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

            for (let n = 0; n < node.items.length; n++) {
                const itemNode = node.items[n];
                const item = itemNode.item;
                const row = this.getRowProps(itemNode.item, index, parents);

                if (appendRows && index < lastIndex) {
                    rows.push(row);
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
                row.isLastChild = (n == node.items.length - 1) && (node.count == node.items.length);

                if (!flatten && this.props.getChildCount) {
                    const reportedChildCount = this.props.getChildCount(item);

                    if (reportedChildCount > 0
                        // There can be cases when children were loaded (because getChildCount returned > 0), but there's none
                        // This would make folding icon disappear after unfolding such node
                        && (!itemNode.children || itemNode.children.count != 0)
                    ) {
                        row.isFoldable = true;
                        row.isFolded = this.isFolded(item);
                        row.onFold = row.isFoldable && this.handleOnFold;

                        const parentsWithRow = [...parents, row];

                        if (itemNode.children) { // children loaded
                            const childStats = iterateNode(itemNode.children, appendRows && !row.isFolded, parentsWithRow, reportedChildCount);
                            row.isChildrenChecked = childStats.isSomeChecked;
                            row.isChildrenSelected = childStats.isSomeSelected;
                            stats.isSomeCheckable = stats.isSomeCheckable || childStats.isSomeCheckable;
                            stats.isSomeChecked = stats.isSomeChecked || childStats.isSomeChecked;
                            stats.isAllChecked = stats.isAllChecked && childStats.isAllChecked;
                            stats.hasMoreRows = stats.hasMoreRows || childStats.hasMoreRows;
                        } else { // children are not loaded
                            // stats.isAllChecked = false;
                            // stats.hasMoreRows = true;

                            if (!row.isFolded && appendRows) {
                                for (let m = 0; m < reportedChildCount && index < lastIndex; m++) {
                                    const row = this.getLoadingRow('_loading_' + index, index, parentsWithRow);
                                    row.indent = parentsWithRow.length + 1;
                                    row.isLastChild = m == (reportedChildCount - 1);
                                    rows.push(row);
                                    index++;
                                    addedCount++;
                                }
                            }
                        }
                    }
                }
            }

            if (appendRows) {
                let missingCount: number;

                if (node.count != null) { // exact count known
                    missingCount = node.count - addedCount;
                } else if (estimatedCount == null && rows.length < lastIndex) { // top-level rows, add loading rows up to lastIndex
                    missingCount = lastIndex - rows.length;
                } else if (estimatedCount > addedCount) {
                    // believe getChildCount
                    missingCount = estimatedCount - addedCount;
                } else {
                    // we have a bad estimate - it even less that actual items we have
                    // This would happen is getChildCount provides a guess count, and we scroll thru children past this count
                    // let's guess we have at least 1 item more than loaded
                    missingCount = 1;
                }

                if (missingCount > 0) {
                    stats.hasMoreRows = true;
                }

                while (index < lastIndex && missingCount > 0) {
                    const row = this.getLoadingRow('_loading_' + index, index, parents);
                    rows.push(row);
                    layerRows.push(row);
                    index++;
                    addedCount++;
                    missingCount--;
                }
            }

            const isListFlat = parents.length === 0 && !layerRows.some(r => r.isFoldable);

            const indent = isListFlat ? 0 : parents.length + 1;
            layerRows.forEach(r => r.indent = indent);

            return stats;
        };

        const rootStats = iterateNode(this.tree, true, []);

        if (rootStats.isSomeCheckable && this.isSelectAllEnabled()) {
            this.selectAll = {
                value: rootStats.isAllChecked,
                onValueChange: this.handleSelectAllCheck,
                indeterminate: this.value.checked && this.value.checked.length > 0 && !rootStats.isAllChecked,
            };
        } else if (this.tree.items.length === 0 && this.props.rowOptions?.checkbox?.isVisible && this.isSelectAllEnabled()) {
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
        let checkedKey = rowProps.rowKey;

        this.updateChecked(isChecked, false, id, checkedKey);
    }

    protected handleSelectAllCheck = (value: boolean) => {
        this.updateChecked(value, true);
    }

    private async updateChecked(isChecked: boolean, isRoot: boolean, id: TId | null = null, key: string | null = null) {
        let checked = this.value && this.value.checked || [];

        if (this.props.cascadeSelection || isRoot) {
            let childKeys: string[] = [];
            let checkedKeysSet = new Set(checked.map(id => this.idToKey(id)));

            let result = await this.loadMissing(false, { loadAll: isRoot, loadAllChildren: (i) => this.idToKey(i?.id) == key });
            let tree = result.tree;

            const appendChildIds = (key: string) => {
                const children = tree.byParentKey[key];

                if (children?.length > 0) {
                    children.forEach(item => {
                        const id = this.props.getId(item);
                        const key = this.idToKey(id);

                        childKeys.push(key);
                        appendChildIds(key);
                    });
                }
            };

            const addAllIds = () => {
                Object.keys(tree.byKey).forEach(key => childKeys.push(key));
            };

            isRoot ? addAllIds() : appendChildIds(key);

            if (isChecked) {
                !isRoot && checkedKeysSet.add(key);

                childKeys.forEach(key => {
                    const item = this.cache.itemsById.map.get(key);
                    const { isCheckable } = this.getRowProps(item.value, null, []);
                    if (isCheckable) {
                        checkedKeysSet.add(key);
                    }
                });
            } else {
                const keysToUnset = new Set(childKeys);
                !isRoot && keysToUnset.add(key);

                keysToUnset.forEach(key => {
                    const item = this.cache.itemsById.map.get(key);
                    const { isCheckable } = this.getRowProps(item.value, null, []);
                    if (isCheckable || keysToUnset.has(key)) {
                        checkedKeysSet.delete(key);
                    }
                });
            }

            const getParentIds = (id: TId) => {
                const parentIds: TId[] = [];

                const getParent = (id: TId) => {
                    const node = tree.byKey[this.idToKey(id)];
                    const parentId = this.getParentId(node);
                    if (parentId) {
                        parentIds.push(parentId);
                        getParent(parentId);
                    }
                };

                getParent(id);
                return parentIds;
            };

            // check/uncheck parents if all/no siblings checked
            if (!isRoot) {
                getParentIds(id).forEach(parentId => {
                    const parentKey = this.idToKey(parentId);
                    const children = tree.byParentKey[parentKey];
                    const isAllChildrenChecked = children.every(i => checkedKeysSet.has(this.idToKey(this.props.getId(i))));

                    if (isAllChildrenChecked) {
                        checkedKeysSet.add(parentKey);
                    } else {
                        if (this.idToKey(parentId) !== key) {
                            checkedKeysSet.delete(parentKey);
                        }
                    }
                });
            }

            this.handleCheckedChange(Array.from(checkedKeysSet).map(key => this.keyToId(key)));

        } else {
            let result = [...checked];
            if (isChecked) {
                result.push(id);
            } else {
                result = result.filter(i => i !== id);
            }

            this.handleCheckedChange(result);
        }
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
        let exactRowsCount: number;
        let lastVisibleIndex = this.value.topIndex + this.value.visibleCount;

        if (!this.props.getChildCount && this.tree.count) {
            // We have a flat list, and know exact count of items on top level. So, we can have an exact number of rows w/o iterating the whole tree.
            rowsCount = this.tree.count;
            exactRowsCount = this.tree.count;
            totalCount = this.tree.count;
        } else if (!this.hasMoreRows) {
            // We are at the bottom of the list. Some children might still be loading, but that's ok - we'll re-count everything after we load them.
            rowsCount = this.rows.length;
            exactRowsCount = this.rows.length;
            totalCount = this.tree.recursiveCount;
        }  else {
            // We definitely have more rows to show below the last visible row. Let's tell that we have at least one more than is visible.
            rowsCount = Math.max(this.rows.length, lastVisibleIndex + 1);
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
