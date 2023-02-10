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
    tree: Tree<TItem, TId>;

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
            this.updateNodes();
        } else {
            if (newValue.focusedIndex !== currentValue.focusedIndex) {
                this.updateFocusedItem();
            }
        }
        this.updateRowOptions();
    }

    private isCacheIsOutdated(newValue: DataSourceState, prevValue: DataSourceState) {
        if (newValue.search !== prevValue.search ||
            !isEqual(newValue.checked, prevValue.checked) ||
            !isEqual(newValue.sorting, prevValue.sorting) ||
            newValue.selectedId !== prevValue.selectedId ||
            newValue.folded !== prevValue.folded ||
            newValue.filter !== prevValue.filter
        ) {
            return true;
        }
        return false;
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

    private updateNodes() {
        const { getSearchFields } = this.props;
        const searchIsApplied = this.value?.search && getSearchFields;

        let fullSelection: TId[] = [];
        let emptySelection: TId[] = [];
        let currentIndex = 0;
        let isFlatList = this.tree.isFlatList();

        const empty = { rows: [] as DataRowProps<TItem, TId>[], checkedCount: 0, checkableCount: 0, selectedCount: 0 };

        const getNodesRec = (items: TItem[], parents: DataRowProps<TItem, TId>[], depth: number) => {
            let checkedCount = 0;
            let selectedCount = 0;
            let checkableCount = 0;
            let rows: DataRowProps<TItem, TId>[] = [];

            for (let n = 0; n < items.length; n++) {
                const item = items[n];
                const childrenItems = this.tree.getChildren(item);
                const rowProps = this.getRowProps(item, currentIndex, parents);
                rowProps.isLastChild = n === (items.length - 1);
                let children = empty;

                if (childrenItems.length > 0) {
                    children = getNodesRec(childrenItems, [...parents, rowProps], depth + 1);
                    checkedCount += children.checkedCount;
                    selectedCount += children.selectedCount;
                    checkableCount += children.checkableCount;
                }

                let isFolded = this.isFolded(item);

                if (searchIsApplied && children.rows.length > 0) {
                    isFolded = false;
                }

                const isFoldable = children && children.rows.length > 0;

                rowProps.indent = isFlatList ? 0 : depth;
                rowProps.depth = depth;
                rowProps.isFolded = isFolded;
                rowProps.isFoldable = isFoldable;
                rowProps.onFold = isFoldable ? this.handleOnFold : undefined;

                if (rowProps.checkbox && rowProps.checkbox.isVisible && !rowProps.checkbox.isDisabled) {
                    fullSelection.push(rowProps.id);
                    checkableCount++;
                    if (rowProps.isChecked) {
                        checkedCount++;
                    }

                    rowProps.isChildrenChecked = children.checkedCount > 0;
                }

                if (rowProps.isSelectable && rowProps.isSelected) {
                    selectedCount++;
                }

                rowProps.isChildrenSelected = children.selectedCount > 0;
                rows.push(rowProps);


                if (!isFolded && children) {
                    rows = rows.concat(children.rows);
                }

                currentIndex++;
            }

            return { rows, checkableCount, checkedCount, selectedCount };
        };

        const all = getNodesRec(
            this.tree.getRootItems(),
            [],
            this.tree.isFlatList() ? 0 : 1, // If the list is flat (not a tree), we don't need a space to place folding icons.
        );

        this.rows = all.rows;

        // A hack to make focus and keyboard navigation work
        this.rows.forEach((row, index) => {
            row.index = index;
            row.isFocused = this.value.focusedIndex === index;
        });

        if (all.checkableCount > 0 && this.isSelectAllEnabled()) {
            const isAllChecked = all.checkedCount === fullSelection.length;
            this.selectAll = {
                value: isAllChecked,
                onValueChange: checked => this.handleCheckedChange(checked ? fullSelection : emptySelection),
                indeterminate: all.checkedCount > 0 && !isAllChecked,
            };
        }
    }

    public getVisibleRows = () => {
        return this.rows.slice(this.value.topIndex, this.value.topIndex + this.value.visibleCount);
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
}
