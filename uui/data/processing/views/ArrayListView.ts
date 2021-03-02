import {DataRowProps, SortingOption, SortDirection, IEditable} from "../../../types";
import { getSearchFilter } from '../../querying';
import {DataSourceState, IArrayDataSource, TreeNode} from "../types";
import { DataSourceListProps, IDataSourceView } from './types';
import { BaseListView, BaseListViewProps } from './BaseListView';
import isEqual from 'lodash.isequal';

export interface ArrayListViewProps<TItem, TId, TFilter> extends BaseListViewProps<TItem, TId, TFilter> {
    getParentId?(item: TItem): TId;
    getSearchFields?(item: TItem): string[];
    sortBy?(item: TItem, sorting: SortingOption): any;
    getFilter?(filter: TFilter): (item: TItem) => boolean;
}

export class ArrayListView<TItem, TId, TFilter = any> extends BaseListView<TItem, TId, TFilter> implements IDataSourceView<TItem, TId, TFilter> {
    visibleRows: DataRowProps<TItem, TId>[] = [];
    props: ArrayListViewProps<TItem, TId, TFilter>;

    constructor(
        private dataSource: IArrayDataSource<TItem, TId, TFilter>,
        editable: IEditable<DataSourceState<TFilter, TId>>,
        props: ArrayListViewProps<TItem, TId, TFilter>,
    ) {
        super(editable, props);
        this.props = props;
        this.updateNodes();
    }

    public update(newValue: DataSourceState<TFilter, TId>, newProps: ArrayListViewProps<TItem, TId, TFilter>) {
        const currentValue = { ...this.value };
        this.value = newValue;
        this.props = newProps;
        if (this.isCacheIsOutdated(newValue, currentValue)) {
            this.updateNodes();
        } else {
            if (newValue.focusedIndex !== currentValue.focusedIndex) {
                this.updateFocusedItem();
            }
        }
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
        const item = this.dataSource.getById(id);
        return this.getRowProps(item, index, []);
    }

    private updateFocusedItem = () => {
        this.visibleRows.forEach(row => {
            row.isFocused = this.value.focusedIndex === row.index;
            return row;
        });
    }

    private updateNodes() {
        const folded = this.value.folded || {};
        const isFoldedByDefault = this.props.isFoldedByDefault || (() => true);
        const applySearch = this.buildSearchFilter(this.value);
        const applyFilter = this.props.getFilter && this.props.getFilter(this.value.filter);
        let fullSelection: TId[] = [];
        let emptySelection: TId[] = [];
        let currentIndex = 0;

        this.updateCheckedLookup(this.value.checked);

        const empty = { rows: [] as DataRowProps<TItem, TId>[], checkedCount: 0, checkableCount: 0, selectedCount: 0 };

        const getNodesRec = (nodes: TreeNode<TItem, TId>[], parents: DataRowProps<TItem, TId>[], depth: number) => {
            let checkedCount = 0;
            let selectedCount = 0;
            let checkableCount = 0;
            let rows: DataRowProps<TItem, TId>[] = [];

            for (let n = 0; n < nodes.length; n++) {
                currentIndex = currentIndex + 1;
                const node = nodes[n];
                const rowProps = this.getRowProps(node.item, currentIndex, parents);
                rowProps.isLastChild = n === (nodes.length - 1);
                let children = empty;
                const isPassedSearch = applySearch ? applySearch(node.item) : true;
                const isPassedFilter = applyFilter ? applyFilter(node.item) : true;

                if (node.children.length > 0) {
                    children = getNodesRec(node.children, [...parents, rowProps], depth + 1);
                    checkedCount += children.checkedCount;
                    selectedCount += children.selectedCount;
                    checkableCount += children.checkableCount;
                }

                let isFolded = folded[node.key];
                if (isFolded == null) {
                    isFolded = isFoldedByDefault(node.item);
                }
                if (applySearch && children.rows.length > 0) {
                    isFolded = false;
                }
                const isFoldable = children && children.rows.length > 0;

                if ((isPassedSearch && isPassedFilter) || children.rows.length > 0) {
                    rowProps.depth = depth;
                    rowProps.isFolded = isFolded;
                    rowProps.isFoldable = isFoldable;
                    rowProps.onFold = isFoldable ? this.handleOnFold : undefined;

                    if (rowProps.checkbox && rowProps.checkbox.isVisible) {
                        if (rowProps.checkbox.isDisabled) {
                            if (rowProps.isChecked) {
                                fullSelection.push(rowProps.id);
                                emptySelection.push(rowProps.id);
                            }
                        } else {
                            checkableCount++;
                            if (rowProps.isChecked) {
                                checkedCount++;
                            }
                            fullSelection.push(rowProps.id);
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

        const sortComparer = this.buildSortingComparer(this.props.sortBy);
        const sortedNodes = this.dataSource.rootNodes.sort(sortComparer);
        this.dataSource.nodes.forEach(node => {
            node.children.sort(sortComparer);
        });

        const all = getNodesRec(
            sortedNodes,
            [],
            this.dataSource.maxDepth == 1 ? 0 : 1, // If the list is flat (not a tree), we don't need a space to place folding icons.
        );

        this.visibleRows = all.rows;

        // A hack to make focus and keyboard navigation work
        this.visibleRows.forEach((row, index) => {
            row.index = index;
            row.isFocused = this.value.focusedIndex === index;
        });


        if (all.checkableCount > 0) {
            this.selectAll = {
                value: all.checkedCount > 0,
                onValueChange: checked => this.handleCheckedChange(checked ? fullSelection : emptySelection),
                indeterminate: 0 < all.checkedCount && all.checkedCount < all.checkableCount,
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
            const sortByFn = sortBy || ((i: TItem) => (i as any)[sorting.field] || '');

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
        return this.visibleRows.slice(this.value.topIndex, this.value.topIndex + this.value.visibleCount);
    }

    public getListProps(): DataSourceListProps {
        return {
            rowsCount: this.visibleRows.length,
            knownRowsCount: this.visibleRows.length,
            exactRowsCount: this.visibleRows.length,
            totalCount: this.dataSource.nodes.length,
            selectAll: this.selectAll,
        };
    }

    protected handleOnCheck = (rowProps: DataRowProps<TItem, TId>) => {
        let checked: TId[];
        let isChecked = !rowProps.isChecked;

        const checkedNode = this.dataSource.byKey[rowProps.rowKey];

        const forEachChildren = (action: (key: string) => void) => {

            const walkChildrenRec = (node: TreeNode<TItem, TId>) => {
                if (true) { /* filter && isSelectable */
                    action(node.key);
                }
                node.children && node.children.forEach(walkChildrenRec);
            };

            walkChildrenRec(checkedNode);
        };

        if (isChecked) {
            this.checkedByKey[checkedNode.key] = true;

            if (this.props.cascadeSelection) {
                if (isChecked) {
                    // check all children recursively
                    forEachChildren(key => this.checkedByKey[key] = true);
                }
            }
        } else {
            delete this.checkedByKey[checkedNode.key];

            if (this.props.cascadeSelection) {
                // uncheck all parents recursively
                checkedNode.path.forEach(key => delete this.checkedByKey[key]);
                // uncheck all children recursively
                forEachChildren(key => delete this.checkedByKey[key]);
            }
        }

        checked = Object.keys(this.checkedByKey).filter(key => this.checkedByKey[key]).map(key => this.dataSource.byKey[key].id);
        this.onValueChange({...this.value, checked});
    }
}
