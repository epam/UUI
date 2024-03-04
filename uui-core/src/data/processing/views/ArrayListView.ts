import {
    DataRowProps, SortingOption, IEditable, DataSourceState, DataSourceListProps, IDataSourceView, BaseListViewProps,
} from '../../../types';
import { BaseListView } from './BaseListView';
import { ITree, NOT_FOUND_RECORD, Tree } from './tree';

export interface BaseArrayListViewProps<TItem, TId, TFilter> extends BaseListViewProps<TItem, TId, TFilter> {
    /** A pure function that gets search value for each item.
     Default: (item) => item.name.
     */
    getSearchFields?(item: TItem): string[];
    /** A pure function that gets sorting value for current sorting value */
    sortBy?(item: TItem, sorting: SortingOption): any;
    /** A pure function that returns filter callback to be applied for each item.
     * The callback should return true, if item passed the filter.
     *  */
    getFilter?(filter: TFilter): (item: TItem) => boolean;
    /**
     * Enables sorting of search results by relevance.
     * - The highest priority has records, which have a full match with a search keyword.
     * - The lower one has records, which have a search keyword at the 0 position, but not the full match.
     * - Then, records, which contain a search keyword as a separate word, but not at the beginning.
     * - And the lowest one - any other match of the search keyword.
     *
     * Example:
     * - `search`: 'some'
     * - `record string`: 'some word', `rank` = 4
     * - `record string`: 'someone', `rank` = 3
     * - `record string`: 'I know some guy', `rank` = 2
     * - `record string`: 'awesome', `rank` = 1
     *
     * @default true
     */
    sortSearchByRelevance?: boolean;
}

export interface ArrayListViewProps<TItem, TId, TFilter> extends BaseArrayListViewProps<TItem, TId, TFilter> {
    /** Data, which should be represented by a DataSource. */
    items?: TItem[] | ITree<TItem, TId>;
}

export class ArrayListView<TItem, TId, TFilter = any> extends BaseListView<TItem, TId, TFilter> implements IDataSourceView<TItem, TId, TFilter> {
    protected props: ArrayListViewProps<TItem, TId, TFilter>;
    fullTree: ITree<TItem, TId>;
    searchTree: ITree<TItem, TId>;
    filteredTree: ITree<TItem, TId>;
    sortedTree: ITree<TItem, TId>;
    refreshCache: boolean;
    constructor(protected editable: IEditable<DataSourceState<TFilter, TId>>, props: ArrayListViewProps<TItem, TId, TFilter>) {
        const newProps = { ...props, sortSearchByRelevance: props.sortSearchByRelevance ?? true };
        super(editable, newProps);
        this.props = newProps;
        this.visibleTree = Tree.blank(newProps);
        this.update(editable, props);
    }

    public update({ value, onValueChange }: IEditable<DataSourceState<TFilter, TId>>, newProps: ArrayListViewProps<TItem, TId, TFilter>) {
        const currentValue = { ...this.value };
        this.value = value;
        this.onValueChange = onValueChange;
        const prevItems = this.props.items;
        const newItems = newProps.items || this.props.items;
        this.props = { ...newProps, items: newItems, sortSearchByRelevance: newProps.sortSearchByRelevance ?? true };

        const prevTree = this.visibleTree;
        if (this.props.items) {
            // Legacy behavior support: there was no items prop, and the view is expected to keep items passes in constructor on updates
            if (prevItems !== newItems || !this.fullTree) {
                this.fullTree = Tree.create(this.props, this.props.items);
                this.visibleTree = this.fullTree;
                this.refreshCache = true;
            }
        }

        if (this.fullTree && (prevTree !== this.visibleTree || this.isCacheIsOutdated(value, currentValue))) {
            this.updateTree(currentValue, value);
            this.updateCheckedLookup(this.value.checked);
            this.updateSelectedLookup(this.value.selectedId);
            this.rebuildRows();
        } else {
            if (value.focusedIndex !== currentValue.focusedIndex) {
                this.updateFocusedItem();
            }
        }
        this.updateRowOptions();
    }

    public reload() {
        this.update(this.editable, { ...this.props, items: [] });
        this.isForceReloading = true;
        this._forceUpdate();
    }

    private isCacheIsOutdated(newValue: DataSourceState<TFilter, TId>, prevValue: DataSourceState<TFilter, TId>) {
        return this.shouldRebuildTree(newValue, prevValue) || this.shouldRebuildRows(newValue, prevValue);
    }

    public getById = (id: TId, index: number) => {
        // if originalTree is not created, but blank tree is defined, get item from it
        const item = (this.fullTree ?? this.visibleTree).getById(id);
        if (item === NOT_FOUND_RECORD) {
            return this.getUnknownRow(id, index, []);
        }

        return this.getRowProps(item, index);
    };

    private updateFocusedItem = () => {
        this.rows.forEach((row) => {
            row.isFocused = this.value.focusedIndex === row.index;
            return row;
        });
    };

    private updateTree(prevValue: DataSourceState<TFilter, TId>, newValue: DataSourceState<TFilter, TId>) {
        const { filter, search, sorting } = newValue;
        const { getSearchFields, getFilter, sortBy, sortSearchByRelevance } = this.props;
        let filterTreeIsUpdated = false;
        if (this.filterWasChanged(prevValue, newValue) || !this.filteredTree || this.refreshCache) {
            this.filteredTree = this.fullTree.filter({ filter, getFilter });
            filterTreeIsUpdated = true;
            this.refreshCache = false;
        }

        let sortingTreeIsUpdated = false;
        if (this.sortingWasChanged(prevValue, newValue) || !this.sortedTree || filterTreeIsUpdated) {
            this.sortedTree = this.filteredTree.sort({ sorting, sortBy });
            sortingTreeIsUpdated = true;
        }

        if (this.searchWasChanged(prevValue, newValue) || !this.searchTree || sortingTreeIsUpdated) {
            this.searchTree = this.sortedTree.search({ search, getSearchFields, sortSearchByRelevance });
        }

        this.visibleTree = this.searchTree;
    }

    public getVisibleRows = () => {
        const rows = this.rows.slice(this.value.topIndex, this.getLastRecordIndex());
        return this.getRowsWithPinned(rows);
    };

    public getListProps = (): DataSourceListProps => {
        return {
            rowsCount: this.rows.length,
            knownRowsCount: this.rows.length,
            exactRowsCount: this.rows.length,
            totalCount: this.fullTree?.getTotalRecursiveCount() ?? 0,
            selectAll: this.selectAll,
        };
    };

    protected handleOnCheck = (rowProps: DataRowProps<TItem, TId>) => {
        this.checkItems(!rowProps.isChecked, rowProps.id);
    };

    protected handleSelectAll = (checked: boolean) => {
        this.checkItems(checked);
    };

    private checkItems(isChecked: boolean, checkedId?: TId) {
        const checked = (this.value && this.value.checked) ?? [];
        const updatedChecked = this.sortedTree.cascadeSelection(checked, checkedId, isChecked, {
            cascade: this.props.cascadeSelection,
            isSelectable: (id: TId, item: TItem | typeof NOT_FOUND_RECORD) => {
                let currentItem = item;
                if (currentItem === NOT_FOUND_RECORD) {
                    const row = this.getById(id, null);
                    if (row.isLoading) {
                        return false;
                    }
                    if (row.isUnknown) {
                        return true;
                    }

                    currentItem = row.value;
                }

                const { isCheckable } = this.getRowProps(currentItem, null);
                return isCheckable;
            },
        });

        this.handleCheckedChange(updatedChecked);
    }

    protected getChildCount = (item: TItem): number | undefined => {
        return this.visibleTree.getChildrenByParentId(this.props.getId(item)).length;
    };

    protected getLastRecordIndex = () => {
        const lastIndex = this.value.topIndex + this.value.visibleCount;
        const actualCount = this.visibleTree.getTotalRecursiveCount() ?? 0;

        if (actualCount < lastIndex) return actualCount;
        return lastIndex;
    };
}
