import { DataRowProps, IEditable } from "../../../types";
import { DataSourceState, LazyDataSourceApi } from '../types';
import { DataSourceListProps, IDataSourceView } from './types';
import isEqual from 'lodash.isequal';
import {BaseListView, BaseListViewProps } from "./BaseListView";
import { ListApiCache } from '../ListApiCache';
import { LazyTreeItem, LazyTreeList, LazyTreeParams, loadLazyTree } from './LazyTree';

export interface LazyListViewProps<TItem, TId, TFilter> extends BaseListViewProps<TItem, TId, TFilter> {
    /**
     * An function to retrieve the data, asynchronously.
     * This function usually performs a REST API call.
     * API is used to retrieve lists of items.
     * It is expected to:
     * - be able to handle paging (via from/count params)
     * - be able to retrieve specific items by the list of their ids
     * - be able to retrieve children by parents (when getChildCount is specified, and ctx.parentId is passed)
     * */
    api: LazyDataSourceApi<TItem, TId, TFilter>;

    /**
     * Should return number of children of the item.
     * If it returns > 0, the item is assumed to have children and to be foldable.
     * Usually, this value should be returned from API.
     *
     * If you can't get number of children via API, you can return a guess value (avg number of children for this type of entity).
     * Note, that this can lead to more API calls, and increased load times.
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
}

export class LazyListView<TItem, TId, TFilter = any> extends BaseListView<TItem, TId, TFilter> implements IDataSourceView<TItem, TId, TFilter> {
    public props: LazyListViewProps<TItem, TId, TFilter>;
    public value: DataSourceState<TFilter, TId> = null;
    private tree: LazyTreeList<TItem, TId>;
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

    public update(newValue: DataSourceState<TFilter, TId>, props: LazyListViewProps<TItem, TId, TFilter>): void {
        this.isUpdatePending = true;

        // We assume value to be immutable. However, we can't guarantee this.
        // Let's shallow-copy value to survive at least simple cases when it's mutated outside
        this.value = { topIndex: 0, ...newValue };

        this.props = props;
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
        ) {
            this.tree = { items: [], value: this.value } as any;
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
                .then((isUpdated) => {
                    if (isUpdated) {
                        this.rebuildRows();
                        this._forceUpdate();
                    }
                })
                .catch(() => {}); // ignore 'request changed errors' here. They are needed for selection cascading.
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
            return this.getLoadingRow('_loading_' + id as any, index);
        }
    }

    // Wrap props.api to update items in the items store
    private api: LazyDataSourceApi<TItem, TId, TFilter> = async (rq, ctx) => {
        const response = await this.props.api(rq, ctx);
        if (this.cache && response.items) {
            response.items.forEach(item => {
                this.cache.setItem(item);
            });
        }
        return response;
    }

    // Loads node. Returns promise to a loaded node.

    private inProgressPromise: Promise<any> = Promise.resolve();

    private loadMissing(abortInProgress: boolean, options?: Partial<LazyTreeParams<TItem, TId, TFilter>>): Promise<any> {
        if (abortInProgress) {
            this.inProgressPromise = Promise.resolve();
        }

        this.inProgressPromise = this.inProgressPromise.then(() => this.loadMissingImpl(options))

        return this.inProgressPromise;
    }

    private async loadMissingImpl(options?: Partial<LazyTreeParams<TItem, TId, TFilter>>): Promise<boolean> {
        const loadingTree = this.tree;

        const newTreePromise = loadLazyTree(
            this.tree,
            {
                api: this.api,
                filter: this.props.filter,
                getChildCount: this.props.getChildCount,
                getId: this.props.getId,
                isFolded: (node) => this.isFolded(node),
                ...options,
            },
            this.value,
        );

        const newTree = await newTreePromise;

        // If this.tree is changed during this load, than there was reset occurred (new value arrived)
        // We need to drop this result, and reject the promise to stop further processing
        if (this.tree != loadingTree) {
            throw new Error("Tree loading aborted - state changed during loading");
        }

        const isUpdated = this.tree !== newTree;

        this.tree = newTree;

        return isUpdated;
    }

    // Extracts a flat list of currently visible rows from the tree
    private rebuildRows() {
        const rows: DataRowProps<TItem, TId>[] = [];
        let index = 0;
        let lastIndex = this.value.topIndex + this.value.visibleCount;

        const iterateNode = (
            node: LazyTreeList<TItem, TId>,
            appendRows: boolean,
            parents: DataRowProps<TItem, TId>[],
            estimatedCount: number = null
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
                    } else {
                        stats.isAllChecked = false;
                    }
                }

                if (row.isSelected) {
                    stats.isSomeSelected = true;
                }

                row.isFoldable = false;
                row.isLastChild = (n == node.items.length - 1) && (node.count == node.items.length);

                if (this.props.getChildCount) {
                    const reportedChildCount = this.props.getChildCount(item);

                    if (reportedChildCount > 0
                        // There can be cases when children were loaded (because getChildCount returned > 0), but there's none
                        // This would make folding icon disappear after unfolding such node
                        && (!itemNode.children || itemNode.children.count != 0)
                    ) {
                        row.isFoldable = true;
                        row.isFolded = this.isFolded(item);
                        row.onFold = row.isFoldable && this.handleOnFold;

                        if (itemNode.children) { // children loaded
                            const childStats = iterateNode(itemNode.children, appendRows && !row.isFolded, [...parents, row], reportedChildCount);
                            row.isChildrenChecked = childStats.isSomeChecked;
                            row.isChildrenSelected = childStats.isSomeSelected;
                            stats.isSomeCheckable = stats.isSomeCheckable || childStats.isSomeCheckable;
                            stats.isSomeChecked = stats.isSomeChecked || childStats.isSomeChecked;
                            stats.isAllChecked = stats.isAllChecked && childStats.isAllChecked;
                            stats.hasMoreRows = stats.hasMoreRows || childStats.hasMoreRows;
                        } else { // children are not loaded
                            // stats.isAllChecked = false;
                            // stats.hasMoreRows = true;

                            if (!row.isFolded) {
                                for (let m = 0; m < reportedChildCount && index < lastIndex; m++) {
                                    rows.push(this.getLoadingRow('_loading_' + index  as any, index, parents.length + 1));
                                    index++;
                                    addedCount++;
                                }
                            }
                        }
                    }
                }
            }

            const isAnyChildren = layerRows.some(r => r.isFoldable);
            const depth = isAnyChildren ? (parents.length + 1) : parents.length;
            layerRows.forEach(r => r.depth = depth);

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

                while(index < lastIndex && missingCount > 0) {
                    rows.push(this.getLoadingRow('_loading_' + index  as any, index, depth));
                    index++;
                    addedCount++;
                    missingCount--;
                }
            }

            return stats;
        }

        const rootStats = iterateNode(this.tree, true, []);

        if (rootStats.isSomeCheckable) {
            this.selectAll = {
                value: rootStats.isAllChecked,
                onValueChange: this.handleSelectAllCheck,
                indeterminate: !rootStats.isAllChecked && this.value.checked && this.value.checked.length > 0,
            };
        } else if (this.tree.items.length === 0 && this.props.rowOptions?.checkbox?.isVisible) {
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
        let tree = this.tree;

        if (this.props.cascadeSelection) {
            await this.loadMissing(false, { loadAll: isRoot, loadAllChildren: (i) => this.idToKey(i?.id) == key });
            tree = this.tree;
        }

        let checked = this.value && this.value.checked || [];
        let childKeys: string[] = [];

        if (this.props.cascadeSelection) {
            const appendChildIds = (list: LazyTreeList<TItem, TId>) => {
                for (let n = 0; n < list.items.length; n++) {
                    let node = list.items[n];
                    childKeys.push(this.idToKey(node.id));
                    node.children && appendChildIds(node.children);
                }
            };

            const findNode = (list: LazyTreeList<TItem, TId>): { node: LazyTreeItem<TItem, TId>; list: LazyTreeList<TItem, TId>; parentIds: TId[]; } => {
                for (let n = 0; n < list.items.length; n++) {
                    let node = list.items[n];

                    if (this.idToKey(node.id) == key) {
                        return { node, list, parentIds: [] };
                    }

                    if (node.children) {
                        const found = findNode(node.children);
                        if (found != null) {
                            found.parentIds.unshift(node.id);
                            return found;
                        }
                    }
                }
            };

            const nodeInfo = isRoot ? { node: { children: tree } } : findNode(tree);
            nodeInfo.node.children && appendChildIds(nodeInfo.node.children);

            // TBD: check/uncheck parents if all/no siblings checked?
            // const allSiblingsChecked = nodeInfo.list.items.every(i => checkedSet.has(i.id));
            // const noSiblingsChecked = nodeInfo.list.items.some(i => !checkedSet.has(i.id));
        }

        if (isChecked) {
            const checkedKeysSet = new Set(checked.map(c => this.idToKey(c)));
            checked = [...checked];
            !isRoot && checked.push(id);
            childKeys.filter(key => !checkedKeysSet.has(key)).forEach(key => checked.push(this.keyToId(key)));
        } else {
            const keysToUnset = new Set(childKeys);
            !isRoot && keysToUnset.add(key);
            checked = checked.filter(id => !(this.idToKey(id) === key || keysToUnset.has(this.idToKey(id))));
        }

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
            while (rows.length < count && (from + rows.length) < listProps.rowsCount) {
                const index = from + rows.length;
                rows.push(this.getLoadingRow('_loading_' + index as any, index));
            }
        }

        return rows;
    }

    public getListProps = (): DataSourceListProps => {
        this.updateRowsAndLoadMissing();

        let rowsCount: number;
        let totalCount: number;
        let lastVisibleIndex = this.value.topIndex + this.value.visibleCount;

        if (!this.props.getChildCount && this.tree.count) {
            // We have a flat list, and know exact count of items on top level. So, we can have an exact number of rows w/o iterating the whole tree.
            rowsCount = this.tree.count;
            totalCount = this.tree.count;
        } else if (!this.hasMoreRows) {
            // We are at the bottom of the list. Some children might still be loading, but that's ok - we'll re-count everything after we load them.
            rowsCount = this.rows.length;
        }  else {
            // We definitely have more rows to show below the last visible row. Let's tell that we have at least one more than is visible.
            rowsCount = Math.max(this.rows.length, lastVisibleIndex + 1);
        }

        return {
            rowsCount,
            knownRowsCount: this.rows.length,
//            exactRowsCount: this.rows.length,
            totalCount,
            selectAll: this.selectAll,
        };
    }
}
