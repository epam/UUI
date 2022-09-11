import { DataRowProps, SortingOption, IEditable, DataSourceState,
    DataSourceListProps, IDataSourceView, BaseListViewProps } from "../../../types";
import { getSearchFilter } from '../../querying';
import { BaseListView } from './BaseListView';
import isEqual from 'lodash.isequal';
import { Tree, TreeNode } from "./Tree";

export interface ArrayListViewProps<TItem, TId, TFilter> extends BaseListViewProps<TItem, TId, TFilter> {
    items?: TItem[] | Tree<TItem, TId>;
    getSearchFields?(item: TItem): string[];
    sortBy?(item: TItem, sorting: SortingOption): any;
    getFilter?(filter: TFilter): (item: TItem) => boolean;
}

export class ArrayListView<TItem, TId, TFilter = any> extends BaseListView<TItem, TId, TFilter> implements IDataSourceView<TItem, TId, TFilter> {
    props: ArrayListViewProps<TItem, TId, TFilter>;
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
            this.tree = Tree.create(this.props, this.props.items);
        }

        if (prevTree != this.tree || this.isCacheIsOutdated(newValue, currentValue)) {
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

    private updateNodes() {
        const applySearch = this.buildSearchFilter(this.value);
        const applyFilter = this.props.getFilter && this.props.getFilter(this.value.filter);
        const sortComparer = this.buildSortingComparer(this.props.sortBy);
        let fullSelection: TId[] = [];
        let emptySelection: TId[] = [];
        let currentIndex = 0;
        let isFlatList = this.tree.isFlatList();

        this.updateCheckedLookup(this.value.checked);

        const empty = { rows: [] as DataRowProps<TItem, TId>[], checkedCount: 0, checkableCount: 0, selectedCount: 0 };

        const getNodesRec = (nodes: TreeNode<TItem, TId>[], parents: DataRowProps<TItem, TId>[], depth: number) => {
            let checkedCount = 0;
            let selectedCount = 0;
            let checkableCount = 0;
            let rows: DataRowProps<TItem, TId>[] = [];
            nodes.sort(sortComparer);

            for (let n = 0; n < nodes.length; n++) {
                currentIndex = currentIndex + 1;
                const node = nodes[n];
                const childrenNodes = this.tree.getNodesByParentId(node.id);
                const rowProps = this.getRowProps(node.item, currentIndex, parents);
                rowProps.isLastChild = n === (nodes.length - 1);
                let children = empty;
                const isPassedSearch = applySearch ? applySearch(node.item) : true;
                const isPassedFilter = applyFilter ? applyFilter(node.item) : true;

                if (childrenNodes.length > 0) {
                    children = getNodesRec(childrenNodes, [...parents, rowProps], depth + 1);
                    checkedCount += children.checkedCount;
                    selectedCount += children.selectedCount;
                    checkableCount += children.checkableCount;
                }

                let isFolded = this.isFolded(node.item);

                if (applySearch && children.rows.length > 0) {
                    isFolded = false;
                }

                const isFoldable = children && children.rows.length > 0;

                if ((isPassedSearch && isPassedFilter) || children.rows.length > 0) {
                    rowProps.indent = isFlatList ? 0 : depth;
                    rowProps.depth = depth;
                    rowProps.isFolded = isFolded;
                    rowProps.isFoldable = isFoldable;
                    rowProps.onFold = isFoldable ? this.handleOnFold : undefined;

                    if (rowProps.checkbox && rowProps.checkbox.isVisible && !rowProps.checkbox.isDisabled) {
                        if (rowProps.checkbox.isDisabled) {
                            if (rowProps.isChecked) {
                                fullSelection.push(rowProps.id);
                                emptySelection.push(rowProps.id);
                            }
                        } else {
                            fullSelection.push(rowProps.id);
                        }
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
                }


                if (!isFolded && children) {
                    rows = rows.concat(children.rows);
                }
            }

            return { rows, checkableCount, checkedCount, selectedCount };
        };

        const all = getNodesRec(
            this.tree.getRootNodes(),
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

    private buildSearchFilter(value: DataSourceState) {
        if (value && value.search) {
            if (this.props.getSearchFields) {
                const searchFilter = getSearchFilter(value.search);
                return (i: TItem) => searchFilter(this.props.getSearchFields(i));
            } else {
                console.warn("[ArrayDataSource] Search value is set, but props.getSearchField is not specified. Nothing to search on.");
                return null;
            }
        } else {
            return null;
        }
    }

    private buildSortingComparer(sortBy?: (item: TItem, sorting: SortingOption) => any) {
        const compareScalars = (new Intl.Collator(undefined, {numeric: true, sensitivity: 'base'})).compare;

        const comparers: ((a: TreeNode<TItem, TId>, b: TreeNode<TItem, TId>) => number)[] = [];

        this.value.sorting && this.value.sorting.forEach(sorting => {
            const sortByFn = sortBy || ((i: TItem) => i[sorting.field as keyof TItem] || '');
            const sign = sorting.direction == 'asc' ? 1 : -1;
            comparers.push((a, b) => sign * compareScalars(sortByFn(a.item, sorting) + '', sortByFn(b.item, sorting) + ''));
        });

        // to make sort stable, always compare by default sorting, or by IDs at the last step
        const baseSortBy = (i: TreeNode<TItem, TId>) => i.index.toString();
        comparers.push((a, b) => compareScalars(baseSortBy(a), baseSortBy(b)));

        let fn = (a: TreeNode<TItem, TId>, b: TreeNode<TItem, TId>) => {
            for (let n = 0; n < comparers.length; n++) {
                const comparer = comparers[n];
                const result = comparer(a, b);
                if (result != 0) {
                    return result;
                }
            }

            return 0;
        };

        return fn;
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
        let checkedIdsSet = new Set(checked);

        const checkedNode = this.tree.getNodeById(rowProps.id);

        const forEachChildren = (action: (id: TId) => void) => {
            this.tree.forEach(node => {
                const { isCheckable } = this.getRowProps(node.item, null, []);
                if (isCheckable) { /* filter && isSelectable */
                    action(node.id);
                }
            }, { parentId: checkedNode.id });
        };

        const checkParentsRecursively = (node: TreeNode<TItem, TId>) => {
            const children = this.tree.getNodesByParentId(node.parentId);

            if (children && children.every(i => checkedIdsSet.has(i.id))) {
                const parentNode = this.tree.getNodeById(node.parentId);
                checkedIdsSet.add(parentNode.id);
                checkParentsRecursively(parentNode);
            }
        };

        if (isChecked) {
            checkedIdsSet.add(checkedNode.id);

            if (this.props.cascadeSelection) {
                // check all children recursively
                forEachChildren(key => checkedIdsSet.add(key));

                // check parents if all children is checked
                this.tree.getParentNodesRecursive(checkedNode.id).reverse().forEach(node => {
                    const children = this.tree.getNodesByParentId(node.id);

                    if (children && children.every(i => checkedIdsSet.has(i.id))) {
                        checkedIdsSet.add(node.id);
                    }
                });

            }
        } else {
            checkedIdsSet.delete(checkedNode.id);

            if (this.props.cascadeSelection) {
                // uncheck all parents recursively
                this.tree.getParentNodesRecursive(checkedNode.id).forEach(node => checkedIdsSet.delete(node.id));
                // uncheck all children recursively
                forEachChildren(id => checkedIdsSet.delete(id));
            }
        }

        this.handleCheckedChange(Array.from(checkedIdsSet));
    }
}
