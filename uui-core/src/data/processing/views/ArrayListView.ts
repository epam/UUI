import {
    DataRowProps, SortingOption, IEditable, DataSourceState,
    DataSourceListProps, IDataSourceView, BaseListViewProps,
} from "../../../types";
import { BaseListView } from './BaseListView';
import { ITree, Tree } from "./tree";

export interface BaseArrayListViewProps<TItem, TId, TFilter, TSubtotals = void> extends BaseListViewProps<TItem, TId, TFilter, TSubtotals> {
    getSearchFields?(item: TItem): string[];
    sortBy?(item: TItem, sorting: SortingOption): any;
    getFilter?(filter: TFilter): (item: TItem) => boolean;
}

export interface ArrayListViewProps<TItem, TId, TFilter, TSubtotals = void> extends BaseArrayListViewProps<TItem, TId, TFilter, TSubtotals> {
    items?: TItem[] | ITree<TItem, TId, TSubtotals>;
}

export class ArrayListView<TItem, TId, TFilter = any, TSubtotals = void>
    extends BaseListView<TItem, TId, TFilter, TSubtotals> implements IDataSourceView<TItem, TId, TFilter, TSubtotals> {

    protected props: ArrayListViewProps<TItem, TId, TFilter, TSubtotals>;

    originalTree: ITree<TItem, TId, TSubtotals>;
    searchTree: ITree<TItem, TId, TSubtotals>;
    filteredTree: ITree<TItem, TId, TSubtotals>;
    sortedTree: ITree<TItem, TId, TSubtotals>;

    private refreshCache: boolean = false;

    constructor(
        protected editable: IEditable<DataSourceState<TFilter, TId>>,
        props: ArrayListViewProps<TItem, TId, TFilter, TSubtotals>,
    ) {
        super(editable, props);
        this.props = props;
        if (props.items instanceof Tree) {
            this.tree = Tree.create(props, props.items);
        } else {
            this.tree = Tree.blank(props);
        }
        this.update(editable.value, props);
    }

    public update(newValue: DataSourceState<TFilter, TId>, newProps: ArrayListViewProps<TItem, TId, TFilter, TSubtotals>) {
        const currentValue = { ...this.value };
        this.value = newValue;
        const prevItems = this.props.items;
        const newItems = newProps.items || this.props.items;
        this.props = { ...newProps, items: newItems };

        const prevTree = this.tree;
        if (this.props.items) { // Legacy behavior support: there was no items prop, and the view is expected to keep items passes in constructor on updates
            if (prevItems !== newItems || !this.originalTree) {
                this.originalTree = Tree.create<TItem, TId, TSubtotals>(this.props, this.props.items);
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
        const item = this.tree.getById(id);
        return this.getRowProps(item, index);
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
            totalCount: this.tree.getTotalRecursiveCount(),
            selectAll: this.selectAll,
        };
    }

    protected handleOnCheck = (rowProps: DataRowProps<TItem, TId>) => {
        let checked = this.value && this.value.checked || [];
        let isChecked = !rowProps.isChecked;
        checked = this.tree.cascadeSelection(
            checked,
            rowProps.id,
            isChecked,
            {
                cascade: this.props.cascadeSelection,
                isSelectable: (item: TItem) => {
                    const { isCheckable } = this.getRowProps(item, null);
                    return isCheckable;
                },
            },
        );
        this.handleCheckedChange(checked);
    }

    protected handleSelectAll = (checked: boolean) => {
        const rowsToSelect = this.rows.filter(this.canBeSelected).map(({ id }) => id);
        this.handleCheckedChange(checked ? rowsToSelect : []);
    }

    protected getChildCount = (item: TItem): number | undefined => {
        return this.tree.getChildrenByParentId(this.props.getId(item)).length;
    }
}
