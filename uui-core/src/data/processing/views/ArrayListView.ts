import {
    DataRowProps, SortingOption, IEditable, DataSourceState,
    DataSourceListProps, IDataSourceView, BaseListViewProps,
} from "../../../types";
import { BaseListView } from './BaseListView';
import { ITree, Tree } from "./tree";

export interface BaseArrayListViewProps<TItem, TId, TFilter> extends BaseListViewProps<TItem, TId, TFilter> {
    getSearchFields?(item: TItem): string[];
    sortBy?(item: TItem, sorting: SortingOption): any;
    getFilter?(filter: TFilter): (item: TItem) => boolean;
}

export interface ArrayListViewProps<TItem, TId, TFilter> extends BaseArrayListViewProps<TItem, TId, TFilter> {
    items?: TItem[] | ITree<TItem, TId>;
}

export class ArrayListView<TItem, TId, TFilter = any> extends BaseListView<TItem, TId, TFilter> implements IDataSourceView<TItem, TId, TFilter> {
    protected props: ArrayListViewProps<TItem, TId, TFilter>;

    originalTree: ITree<TItem, TId>;
    searchTree: ITree<TItem, TId>;
    filteredTree: ITree<TItem, TId>;
    sortedTree: ITree<TItem, TId>;
    refreshCache: boolean;

    constructor(
        protected editable: IEditable<DataSourceState<TFilter, TId>>,
        props: ArrayListViewProps<TItem, TId, TFilter>,
    ) {
        super(editable, props);
        this.props = props;
        this.tree = Tree.blank(props);
        this.update(editable.value, props);
    }

    public update(newValue: DataSourceState<TFilter, TId>, newProps: ArrayListViewProps<TItem, TId, TFilter>) {
        const currentValue = { ...this.value };
        this.value = newValue;
        const prevItems = this.props.items;
        const newItems = newProps.items || this.props.items;
        this.props = { ...newProps, items: newItems };

        const prevTree = this.tree;
        if (this.props.items) { // Legacy behavior support: there was no items prop, and the view is expected to keep items passes in constructor on updates
            if (prevItems !== newItems || !this.originalTree) {
                this.originalTree = Tree.create(this.props, this.props.items);
                this.tree = this.originalTree;
                this.refreshCache = true;
            }
        }

        if (prevTree != this.tree || this.isCacheIsOutdated(newValue, currentValue)) {
            this.updateTree(currentValue, newValue);
            this.updateCheckedLookup(this.value.checked);
            this.rebuildRows();
        } else {
            if (newValue.focusedIndex !== currentValue.focusedIndex) {
                this.updateFocusedItem();
            }
        }
        this.updateRowOptions();
    }

    public reload = () => {
        this.update(this.editable.value, { ...this.props, items: [] });
        this._forceUpdate();
    }

    private isCacheIsOutdated(newValue: DataSourceState<TFilter, TId>, prevValue: DataSourceState<TFilter, TId>) {
        return this.shouldRebuildTree(newValue, prevValue) || this.shouldRebuildRows(newValue, prevValue);
    }

    public getById = (id: TId, index: number) => {
        // if originalTree is not created, but blank tree is defined, get item from it
        const item = (this.originalTree ?? this.tree).getById(id);
        if (item) {
            return this.getRowProps(item, index);
        }

        return this.getLoadingRow('_loading_' + id, index, []);
    }

    private updateFocusedItem = () => {
        this.rows.forEach(row => {
            row.isFocused = this.value.focusedIndex === row.index;
            return row;
        });
    }

    private updateTree(prevValue: DataSourceState<TFilter, TId>, newValue: DataSourceState<TFilter, TId>) {
        const { filter, search, sorting } = newValue;
        const { getSearchFields, getFilter, sortBy } = this.props;

        let filterTreeIsUpdated = false;
        if (this.filterWasChanged(prevValue, newValue) || !this.filteredTree || this.refreshCache) {
            this.filteredTree = this.originalTree.filter({ filter, getFilter });
            filterTreeIsUpdated = true;
            this.refreshCache = false;
        }

        let searchTreeIsUpdated = false;
        if (this.searchWasChanged(prevValue, newValue) || !this.searchTree || filterTreeIsUpdated) {
            this.searchTree = this.filteredTree.search({ search, getSearchFields });
            searchTreeIsUpdated = true;
        }

        if (this.sortingWasChanged(prevValue, newValue) || !this.sortedTree || searchTreeIsUpdated) {
            this.sortedTree = this.searchTree.sort({ sorting, sortBy });
        }

        this.tree = this.sortedTree;
    }

    public getVisibleRows = () => {
        return this.rows.slice(this.value.topIndex, this.getLastRecordIndex());
    }

    public getListProps = (): DataSourceListProps => {
        return {
            rowsCount: this.rows.length,
            knownRowsCount: this.rows.length,
            exactRowsCount: this.rows.length,
            totalCount: this.originalTree?.getTotalRecursiveCount() ?? 0,
            selectAll: this.selectAll,
        };
    }

    protected handleOnCheck = (rowProps: DataRowProps<TItem, TId>) => {
        this.checkItems(!rowProps.isChecked, rowProps.id);
    }

    protected handleSelectAll = (checked: boolean) => {
        this.checkItems(checked);
    }

    private checkItems(isChecked: boolean, checkedId?: TId) {
        let checked = (this.value && this.value.checked) ?? [];
        const updatedChecked = this.tree.cascadeSelection(
            checked,
            checkedId,
            isChecked,
            {
                cascade: this.props.cascadeSelection,
                isSelectable: (item: TItem) => {
                    const { isCheckable } = this.getRowProps(item, null);
                    return isCheckable;
                },
            },
        );

        this.handleCheckedChange(updatedChecked);
    }

    protected getChildCount = (item: TItem): number | undefined => {
        return this.tree.getChildrenByParentId(this.props.getId(item)).length;
    }

    protected getLastRecordIndex = () => {
        const lastIndex = this.value.topIndex + this.value.visibleCount;
        const actualCount = this.tree.getTotalRecursiveCount() ?? 0;

        if (actualCount < lastIndex) return actualCount;
        return lastIndex;
    }
}
