import {
    DataRowProps, SortingOption, IEditable, DataSourceState,
    DataSourceListProps, IDataSourceView, BaseListViewProps,
} from "../../../types";
import { BaseListView } from './BaseListView';
import isEqual from 'lodash.isequal';
import { Tree } from "./Tree";

export interface ArrayListViewProps<TItem, TId, TFilter> extends BaseListViewProps<TItem, TId, TFilter> {
    items?: TItem[] | Tree<TItem, TId>;
    getSearchFields?(item: TItem): string[];
    sortBy?(item: TItem, sorting: SortingOption): any;
    getFilter?(filter: TFilter): (item: TItem) => boolean;
}

export class ArrayListView<TItem, TId, TFilter = any> extends BaseListView<TItem, TId, TFilter> implements IDataSourceView<TItem, TId, TFilter> {
    props: ArrayListViewProps<TItem, TId, TFilter>;
    originalTree: Tree<TItem, TId>;

    constructor(
        editable: IEditable<DataSourceState<TFilter, TId>>,
        props: ArrayListViewProps<TItem, TId, TFilter>,
    ) {
        super(editable, props);
        this.props = props;
        this.update(editable.value, props);
    }

    public update(newValue: DataSourceState<TFilter, TId>, newProps: ArrayListViewProps<TItem, TId, TFilter>) {
        const currentValue = { ...this.value };
        this.value = newValue;
        this.props = newProps;

        const prevTree = this.tree;

        if (this.props.items) { // Legacy behavior support: there was no items prop, and the view is expected to keep items passes in constructor on updates
            this.originalTree = Tree.create(this.props, this.props.items);
            if (!this.tree) {
                this.tree = this.originalTree;
            }
        }

        if (prevTree != this.tree || this.isCacheIsOutdated(newValue, currentValue)) {
            this.tree = this.getUpdatedTree(newValue);
            this.updateCheckedLookup(this.value.checked);
            this.rebuildRows();
        } else {
            if (newValue.focusedIndex !== currentValue.focusedIndex) {
                this.updateFocusedItem();
            }
        }
        this.updateRowOptions();
    }

    private isCacheIsOutdated(newValue: DataSourceState<TFilter, TId>, prevValue: DataSourceState<TFilter, TId>) {
        return this.shouldRebuildTree(newValue, prevValue) || this.shouldRebuildRows(newValue, prevValue);
    }

    public getById = (id: TId, index: number) => {
        const item = this.tree.getById(id);
        return this.getRowProps(item, index, []);
    }

    private updateFocusedItem = () => {
        this.rows.forEach(row => {
            row.isFocused = this.value.focusedIndex === row.index;
            return row;
        });
    }

    private getUpdatedTree({ filter, search, sorting }: DataSourceState<TFilter, TId>) {
        const { getSearchFields, getFilter, sortBy } = this.props;
        return this.originalTree
            .filter({ filter, getFilter })
            .search({ search, getSearchFields })
            .sort({ sorting, sortBy });
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
                    const { isCheckable } = this.getRowProps(item, null, []);
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
