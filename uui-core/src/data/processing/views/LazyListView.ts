import {
    DataRowProps,
    IEditable,
    DataSourceState,
    LazyDataSourceApi,
    DataSourceListProps,
    IDataSourceView,
    BaseListViewProps,
    CascadeSelectionTypes,
} from '../../../types';
import isEqual from 'lodash.isequal';
import { BaseListView } from './BaseListView';
import { ListApiCache } from '../ListApiCache';
import {
    Tree, LoadTreeOptions, ITree, ROOT_ID, NOT_FOUND_RECORD,
} from './tree';

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
     * Usually, this value should be returned from API, as a field of a parent, e.g. { id: 1, name: 'London', childCount: 12 }.
     * In this case, you can implement getChildCount as (i) => i.childCount.
     *
     * If you can't get number of children via API, you can return a guess value (avg number of children for this type of entity).
     * Note, that this can lead to more API calls, and increased load times in the 'parallel' fetch mode.
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

    /**
     * This option is added for the purpose of supporting legacy behavior of fetching data
     * on `getVisibleRows` and `getListProps`, not to break users' own implementation of dataSources.
     * @default true
     */
    legacyLoadDataBehavior?: boolean;
}

interface LoadResult<TItem, TId> {
    isUpdated: boolean;
    isOutdated: boolean;
    tree: ITree<TItem, TId>;
}

export class LazyListView<TItem, TId, TFilter = any> extends BaseListView<TItem, TId, TFilter> implements IDataSourceView<TItem, TId, TFilter> {
    public props: LazyListViewProps<TItem, TId, TFilter>;
    public value: DataSourceState<TFilter, TId> = null;
    private cache: ListApiCache<TItem, TId, TFilter>;
    private isUpdatePending = false;
    private loadedValue: DataSourceState<TFilter, TId> = null;
    private loadedProps: LazyListViewProps<TItem, TId, TFilter>;
    private fullTree: ITree<TItem, TId> = null;
    private listProps?: DataSourceListProps;

    constructor(
        editable: IEditable<DataSourceState<TFilter, TId>>,
        { legacyLoadDataBehavior = true, ...props }: LazyListViewProps<TItem, TId, TFilter>,
        cache?: ListApiCache<TItem, TId, TFilter>,
    ) {
        const newProps = { legacyLoadDataBehavior, ...props };
        super(editable, newProps);
        this.props = this.applyDefaultsToProps(newProps);
        this.visibleTree = Tree.blank<TItem, TId>(newProps);
        this.fullTree = Tree.blank<TItem, TId>(newProps);
        this.cache = cache;
        if (!this.cache) {
            this.cache = new ListApiCache({
                api: this.props.api,
                getId: this.props.getId,
                onUpdate: () => this._forceUpdate(),
            });
        }
        this.update(editable, this.props);
    }

    private defaultGetId = (i: any) => i.id;
    protected applyDefaultsToProps(props: LazyListViewProps<TItem, TId, TFilter>): LazyListViewProps<TItem, TId, TFilter> {
        const newProps = {
            ...props,
            getId: props.getId ?? this.defaultGetId,
            flattenSearchResults: props.flattenSearchResults ?? true,
        };

        if (newProps.getChildCount && (newProps.cascadeSelection || newProps.flattenSearchResults) && !newProps.getParentId) {
            console.warn('LazyListView: getParentId prop is mandatory if cascadeSelection or flattenSearchResults are enabled');
        }

        return newProps;
    }

    public update(
        { value, onValueChange }: IEditable<DataSourceState<TFilter, TId>>,
        props: LazyListViewProps<TItem, TId, TFilter>,
    ): void {
        this.isUpdatePending = true;
        const { checked: prevChecked } = this.value ?? {};
        // We assume value to be immutable. However, we can't guarantee this.
        // Let's shallow-copy value to survive at least simple cases when it's mutated outside
        this.value = { topIndex: 0, visibleCount: 20, ...value };
        this.onValueChange = onValueChange;

        if (!isEqual(value?.checked, prevChecked)) {
            this.updateCheckedLookup(value.checked);
        }

        this.props = {
            ...props,
            legacyLoadDataBehavior: props.legacyLoadDataBehavior ?? this.props.legacyLoadDataBehavior,
            flattenSearchResults: this.props.flattenSearchResults ?? props.flattenSearchResults ?? true,
        };

        this.updateRowOptions();
    }

    public loadData(): void {
        if (!this.isUpdatePending) {
            return;
        }

        const prevValue = this.loadedValue;
        const prevProps = this.loadedProps;
        this.loadedValue = this.value;
        this.loadedProps = this.props;
        this.isUpdatePending = false;

        let completeReset = false;
        const shouldReloadData = this.isForceReloading
            || !isEqual(this.props?.filter, prevProps?.filter)
            || this.shouldRebuildTree(prevValue, this.value);

        if (prevValue == null || prevProps == null || shouldReloadData) {
            this.isReloading = true;
            this.visibleTree = this.visibleTree.clearStructure();
            if (this.onlySearchWasUnset(prevValue, this.value)) {
                this.visibleTree = this.fullTree;
            }
            completeReset = true;
        }

        if (completeReset || this.shouldRebuildRows(prevValue, this.value)) {
            this.updateCheckedLookup(this.value.checked);
        }

        const shouldShowPlacehodlers = !shouldReloadData
            || (shouldReloadData && !this.props.backgroundReload)
            || this.isForceReloading;

        const moreRowsNeeded = this.areMoreRowsNeeded(prevValue, this.value);
        const isFoldingChanged = !prevValue || this.value.folded !== prevValue.folded;
        if (
            // on filters change skeleton should not appear
            (completeReset && shouldShowPlacehodlers)
            || this.shouldRebuildRows(prevValue, this.value)
            || isFoldingChanged
            || moreRowsNeeded
        ) {
            this.rebuildRows();
        }

        if (!prevValue || this.value.focusedIndex !== prevValue.focusedIndex) {
            this.updateFocusedItem();
        }

        if (completeReset || isFoldingChanged || moreRowsNeeded) {
            this.isForceReloading = false;

            this.loadMissing(completeReset)
                .then(({ isUpdated, isOutdated }) => {
                    if (isUpdated && !isOutdated) {
                        this.updateCheckedLookup(this.value.checked);
                        this.rebuildRows();
                    }
                }).finally(() => {
                    this.isReloading = false;
                    this._forceUpdate();
                });
        }
    }

    private updateFocusedItem() {
        this.rows.forEach((row) => {
            row.isFocused = this.value.focusedIndex === row.index;
            return row;
        });
    }

    private initCache() {
        this.cache = new ListApiCache({
            api: this.props.api,
            getId: this.props.getId,
            onUpdate: () => this._forceUpdate(),
        });
    }

    public reload = () => {
        this.visibleTree = Tree.blank(this.props);
        this.isForceReloading = true;
        this.initCache();
        this.update({ value: this.value, onValueChange: this.onValueChange }, this.props);
        this._forceUpdate();
    };

    public getById = (id: TId, index: number) => {
        const item = this.cache.byId(id);
        if (item === NOT_FOUND_RECORD) {
            return this.getUnknownRow(id, index, []);
        }

        if (item === null) {
            return this.getLoadingRow(id, index, []);
        }

        return this.getRowProps(item, index);
    };

    // Wrap props.api to update items in the items store
    private api: LazyDataSourceApi<TItem, TId, TFilter> = async (rq, ctx) => {
        const cachedItems: TItem[] = [];
        if (this.cache && rq.ids && rq.ids.length > 0) {
            const missingIds: TId[] = [];
            rq.ids.forEach((id) => {
                const cachedItem = this.cache.byId(id, false);
                if (cachedItem !== NOT_FOUND_RECORD) {
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
            response.items.forEach((item) => {
                this.cache.setItem(item);
            });
        }

        response.items = [...response.items, ...cachedItems];

        return response;
    };

    // Loads node. Returns promise to a loaded node.

    private inProgressPromise: Promise<LoadResult<TItem, TId>> = null;

    private loadMissing(
        abortInProgress: boolean,
        options?: Partial<LoadTreeOptions<TItem, TId, TFilter>>,
        withNestedChildren?: boolean,
        value?: DataSourceState<TFilter, TId>,
        byFullTree: boolean = false,
    ): Promise<LoadResult<TItem, TId>> {
        // Make tree updates sequential, by executing all consequent calls after previous promise completed

        if (this.inProgressPromise === null || abortInProgress) {
            const tree = byFullTree ? this.fullTree : this.visibleTree;
            this.inProgressPromise = Promise.resolve({ isUpdated: false, isOutdated: false, tree });
        }

        this.inProgressPromise = this.inProgressPromise.then(() =>
            this.loadMissingImpl(options, withNestedChildren, value, byFullTree));

        return this.inProgressPromise;
    }

    private async loadMissingImpl(
        options?: Partial<LoadTreeOptions<TItem, TId, TFilter>>,
        withNestedChildren?: boolean,
        value?: DataSourceState<TFilter, TId>,
        byFullTree: boolean = false,
    ): Promise<LoadResult<TItem, TId>> {
        const localValue = { ...this.value, ...value };
        const tree = byFullTree ? this.fullTree : this.visibleTree;
        const loadingTree = tree;

        try {
            const newTreePromise = tree.load(
                {
                    ...this.props,
                    ...options,
                    isFolded: (node) => this.isFolded(node),
                    api: this.api,
                    filter: { ...{}, ...this.props.filter, ...localValue.filter },
                },
                localValue,
                withNestedChildren,
            );

            const newTree = await newTreePromise;

            const linkToTree = byFullTree ? this.fullTree : this.visibleTree;

            // If tree is changed during this load, than there was reset occurred (new value arrived)
            // We need to tell caller to reject this result
            const isOutdated = linkToTree !== loadingTree;
            const isUpdated = linkToTree !== newTree;

            if (!isOutdated) {
                if (!this.value.search) {
                    this.visibleTree = newTree;
                    this.fullTree = newTree;
                } else {
                    this.visibleTree = byFullTree ? this.visibleTree.mergeItems(newTree) : newTree;
                    this.fullTree = byFullTree ? newTree : this.fullTree.mergeItems(newTree);
                }
            }
            return { isUpdated, isOutdated, tree: newTree };
        } catch (e) {
            // TBD - correct error handling
            console.error('LazyListView: Error while loading items.', e);
            return { isUpdated: false, isOutdated: false, tree: loadingTree };
        }
    }

    protected handleOnCheck = (rowProps: DataRowProps<TItem, TId>) => {
        const id = rowProps.id;
        const isChecked = !rowProps.isChecked;

        this.checkItems(isChecked, false, id);
    };

    protected handleSelectAll = (value: boolean) => {
        if (value) {
            this.checkItems(value, true);
        } else {
            // if cascadeSelection mode (implicit or explicit) is enabled, mostly all the rows
            // should be loaded. It is very expensive and slow.
            // To avoid it, only those items, which are selectable, should be unchecked, avoiding cascading logic.
            const checked = this.fullTree.cascadeSelection(this.value.checked, undefined, value, {
                cascade: false,
                isSelectable: (item: TItem) => {
                    const { isCheckable } = this.getRowProps(item, null);
                    return isCheckable;
                },
            });

            this.handleCheckedChange(checked);
        }
    };

    private async checkItems(isChecked: boolean, isRoot: boolean, checkedId?: TId) {
        let checked = (this.value && this.value.checked) || [];

        let tree = this.visibleTree;

        const isImplicitMode = this.props.cascadeSelection === CascadeSelectionTypes.IMPLICIT;
        if (this.props.cascadeSelection || isRoot) {
            const loadNestedLayersChildren = !isImplicitMode;
            const parents = this.fullTree.getParentIdsRecursive(checkedId);

            const result = await this.loadMissing(
                false,
                {
                    // If cascadeSelection is implicit and the element is unchecked, it is necessary to load all children
                    // of all parents of the unchecked element to be checked explicitly. Only one layer of each parent should be loaded.
                    // Otherwise, should be loaded only checked element and all its nested children.
                    loadAllChildren: (id) => {
                        if (!this.props.cascadeSelection) {
                            return isChecked && isRoot;
                        }

                        if (isImplicitMode) {
                            return id === ROOT_ID || parents.some((parent) => isEqual(parent, id));
                        }

                        // `isEqual` is used, because complex ids can be recreated after fetching of parents.
                        // So, they should be compared not by reference, but by value.
                        return isRoot || isEqual(id, checkedId) || (this.value.search && parents.some((parent) => isEqual(parent, id)));
                    },
                    isLoadStrict: true,
                },
                loadNestedLayersChildren,
                { search: null },
                true,
            );

            tree = result.tree;
        }

        checked = tree.cascadeSelection(checked, checkedId, isChecked, {
            cascade: isImplicitMode ? this.props.cascadeSelection : (isRoot && isChecked) || this.props.cascadeSelection,
            isSelectable: (item: TItem) => {
                const { isCheckable } = this.getRowProps(item, null);
                return isCheckable;
            },
        });

        this.handleCheckedChange(checked);
    }

    public getVisibleRows = () => {
        if (this.props.legacyLoadDataBehavior) {
            this.loadData();
        }

        const from = this.value.topIndex;
        const count = this.value.visibleCount;

        const rows = this.rows.slice(from, from + count);
        const visibleRows = this.getRowsWithPinned(rows);
        const listProps = this.getListProps();

        if (this.hasMoreRows) {
            // We don't run rebuild rows on scrolling. We rather wait for the next load to happen.
            // So there can be a case when we haven't updated rows (to add more loading rows), and view is scrolled down
            // We need to add more loading rows in such case.

            const lastRow = this.rows[this.rows.length - 1];

            while (visibleRows.length < count && from + visibleRows.length < listProps.rowsCount) {
                const index = from + visibleRows.length;
                const row = this.getLoadingRow('_loading_' + index, index);
                row.indent = lastRow.indent;
                row.path = lastRow.path;
                row.depth = lastRow.depth;
                visibleRows.push(row);
            }
        }

        return visibleRows;
    };

    public getListProps = (): DataSourceListProps => {
        if (this.props.legacyLoadDataBehavior) {
            this.loadData();
        }

        // if data is reloading, to prevent twitching the UI (of pagination, for example)
        // it is required to return previous listProps.
        if (this.isReloading && this.listProps) {
            this.listProps = { ...this.listProps, isReloading: this.isReloading };
            return this.listProps;
        }

        let rowsCount: number;
        const lastVisibleIndex = this.getLastRecordIndex();
        const rootInfo = this.visibleTree.getNodeInfo(undefined);

        const rootCount = rootInfo.count;

        if (!this.props.getChildCount && rootCount != null) {
            // We have a flat list, and know exact count of items on top level. So, we can have an exact number of rows w/o iterating the whole tree.
            rowsCount = rootCount;
        } else if (!this.hasMoreRows) {
            // We are at the bottom of the list. Some children might still be loading, but that's ok - we'll re-count everything after we load them.
            rowsCount = this.rows.length;
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

        this.listProps = {
            rowsCount,
            knownRowsCount: this.rows.length,
            exactRowsCount: this.rows.length,
            totalCount: rootInfo.totalCount ?? this.visibleTree.getTotalRecursiveCount(),
            selectAll: this.selectAll,
            isReloading: this.isReloading,
        };

        return this.listProps;
    };

    protected getChildCount = (item: TItem): number | undefined => {
        return this.props.getChildCount?.(item);
    };

    protected isFlattenSearch = () => {
        return this.value.search && this.props.flattenSearchResults;
    };

    protected isPartialLoad = () => true;
    private areMoreRowsNeeded = (prevValue?: DataSourceState<TFilter, TId>, newValue?: DataSourceState<TFilter, TId>) => {
        const isFetchPositionAndAmountChanged = prevValue?.topIndex !== newValue?.topIndex || prevValue?.visibleCount !== newValue?.visibleCount;
        const lastIndex = this.getLastRecordIndex();

        return isFetchPositionAndAmountChanged && lastIndex > this.rows.length;
    };

    public getConfig() {
        return {
            ...super.getConfig(),
            flattenSearchResults: this.props.flattenSearchResults,
        };
    }
}
