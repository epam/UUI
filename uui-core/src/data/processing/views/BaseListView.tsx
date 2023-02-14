import { BaseListViewProps, DataRowProps, ICheckable, IEditable, SortingOption, DataSourceState, DataSourceListProps, IDataSourceView } from "../../../types";
import { Tree } from "./Tree";

export abstract class BaseListView<TItem, TId, TFilter> implements IDataSourceView<TItem, TId, TFilter> {
    protected rows: DataRowProps<TItem, TId>[] = [];
    protected tree: Tree<TItem, TId>;
    public value: DataSourceState<TFilter, TId> = {};
    protected onValueChange: (value: DataSourceState<TFilter, TId>) => void;
    protected checkedByKey: Record<string, boolean> = {};
    public selectAll?: ICheckable;
    protected isDestroyed = false;
    protected hasMoreRows = false;

    abstract getById(id: TId, index: number): DataRowProps<TItem, TId>;
    abstract getVisibleRows(): DataRowProps<TItem, TId>[];
    abstract getListProps(): DataSourceListProps;

    _forceUpdate() {
        !this.isDestroyed && this.onValueChange({ ...this.value });
    }

    public destroy() {
        this.isDestroyed = true;
    }

    protected constructor(editable: IEditable<DataSourceState<TFilter, TId>>, protected props: BaseListViewProps<TItem, TId, TFilter>) {
        this.onValueChange = editable.onValueChange;
        this.value = editable.value;
        this.updateCheckedLookup(this.value && this.value.checked);
    }

    protected updateRowOptions(): void {
        if (this.props.getRowOptions) {
            for (let n = 0; n < this.rows.length; n++) {
                const row = this.rows[n];
                if (!row.isLoading) {
                    this.applyRowOptions(row);
                }
            }
        }
    }

    protected updateCheckedLookup(checked: TId[]) {
        this.checkedByKey = {};
        (checked || []).forEach(id => {
            this.checkedByKey[this.idToKey(id)] = true;
        });
    }

    protected handleCheckedChange(checked: TId[]) {
        this.onValueChange({ ...this.value, checked });
    }

    protected idToKey(id: TId) {
        return JSON.stringify(id);
    }

    protected keyToId(key: string) {
        return JSON.parse(key);
    }

    protected setObjectFlag(object: any, key: string, value: boolean) {
        return { ...object, [key]: value };
    }

    public getSelectedRows: () => DataRowProps<TItem, TId>[] = () => {
        if (this.value.selectedId !== null && this.value.selectedId !== undefined) {
            return [this.getById(this.value.selectedId, 0)];
        } else if (this.value.checked) {
            return this.value.checked.map((id, n) => this.getById(id, n));
        }
        return [];
    }

    protected handleOnCheck = (rowProps: DataRowProps<TItem, TId>) => {
        let checked = this.value && this.value.checked || [];
        if (rowProps.isChecked) {
            checked = checked.filter(id => id !== rowProps.id);
            this.handleCheckedChange(checked);
        } else {
            checked = [...checked, rowProps.id];
            this.handleCheckedChange(checked);
        }
    }

    protected isSelectAllEnabled() {
        return this.props.selectAll == undefined ? true : this.props.selectAll;
    }

    protected handleOnSelect = (rowProps: DataRowProps<TItem, TId>) => {
        this.onValueChange({
            ...this.value,
            selectedId: rowProps.id,
        });
    }

    protected handleOnFocus = (focusIndex: number) => {
        if (this.onValueChange) {
            this.onValueChange({
                ...this.value,
                focusedIndex: focusIndex,
            });
        }
    }

    protected handleOnFold = (rowProps: DataRowProps<TItem, TId>) => {
        if (this.onValueChange) {
            this.onValueChange({
                ...this.value,
                folded: this.setObjectFlag(this.value && this.value.folded, rowProps.rowKey, !rowProps.isFolded),
            });
        }
    }

    protected handleSort = (sorting: SortingOption) => {
        if (this.onValueChange) {
            this.onValueChange({
                ...this.value,
                sorting: [sorting],
            });
        }
    }

    protected isFolded(item: TItem) {
        const folded = this.value.folded || {};

        const key = this.idToKey(this.props.getId(item));

        if (folded[key] != null) {
            return folded[key];
        }

        if (this.props.isFoldedByDefault) {
            return this.props.isFoldedByDefault(item);
        }

        return true;
    }

    protected getRowProps(item: TItem, index: number, parents: DataRowProps<TItem, TId>[]): DataRowProps<TItem, TId> {
        const id = this.props.getId(item);
        const key = this.idToKey(id);

        const path = parents.map(p => ({ id: p.id, isLastChild: p.isLastChild, value: p.value }));
        const parentId = path.length > 0 ? path[path.length - 1].id : undefined;

        const rowProps = {
            id,
            parentId,
            key,
            rowKey: key,
            index,
            value: item,
            depth: parents.length,
            path,
        } as DataRowProps<TItem, TId>;

        this.applyRowOptions(rowProps);

        return rowProps;
    }

    protected applyRowOptions(row: DataRowProps<TItem, TId>) {
        const rowOptions = this.props.getRowOptions ? this.props.getRowOptions(row.value, row.index) : this.props.rowOptions;
        const isCheckable = rowOptions && rowOptions.checkbox && rowOptions.checkbox.isVisible && !rowOptions.checkbox.isDisabled;
        const isSelectable = rowOptions && rowOptions.isSelectable;
        if (rowOptions != null) {
            const rowValue = row.value;
            Object.assign(row, rowOptions);
            row.value = rowOptions.value ?? rowValue;
        }
        row.isFocused = this.value.focusedIndex === row.index;
        row.isChecked = !!this.checkedByKey[row.rowKey];
        row.isSelected = this.value.selectedId === row.id;
        row.isCheckable = isCheckable;
        row.onCheck = isCheckable && this.handleOnCheck;
        row.onSelect = rowOptions && rowOptions.isSelectable && this.handleOnSelect;
        row.onFocus = (isSelectable || isCheckable) && this.handleOnFocus;
    }

    protected getLoadingRow(id: any, index: number = 0, parents: DataRowProps<TItem, TId>[] = null): DataRowProps<TItem, TId> {
        const rowOptions = this.props.rowOptions;

        const path = parents ? parents.map(p => ({ id: p.id, isLastChild: p.isLastChild, value: p.value })) : [];

        return {
            id,
            rowKey: this.idToKey(id),
            index,
            isLoading: true,
            depth: parents ? parents.length : 0,
            path,
            checkbox: rowOptions?.checkbox?.isVisible && { isVisible: true, isDisabled: true },
        };
    }

    // Extracts a flat list of currently visible rows from the tree
    protected rebuildRows() {
        const rows: DataRowProps<TItem, TId>[] = [];
        let index = 0;
        let lastIndex = this.value.topIndex + this.value.visibleCount;
        const isFlattenSearch = this.isFlattenSearch?.() ?? false;
        const searchIsApplied = !!this.value?.search;

        const iterateNode = (
            parentId: TId,
            appendRows: boolean, // Will be false, if we are iterating folded nodes.
            // We still need to iterate them to get their stats. E.g if there are any item of if any item inside is checked.
            parents: DataRowProps<TItem, TId>[], // Parents from top to lower level
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
            const nodeInfo = this.tree.getNodeInfo(parentId);

            const ids = this.tree.getChildrenIdsByParentId(parentId);
            for (let n = 0; n < ids.length; n++) {
                const id = ids[n];
                const item = this.tree.getById(id);
                const row = this.getRowProps(item, index, parents);

                if (appendRows && (!this.isPartialLoad() || (this.isPartialLoad() && index < lastIndex))) {
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
                row.isLastChild = (n == ids.length - 1) && (nodeInfo.count === ids.length);
                row.indent = isFlattenSearch ? 0 : parents.length + 1;

                const estimatedChildrenCount = this.getEstimatedChildrenCount(id);
                if (!isFlattenSearch && estimatedChildrenCount !== undefined) {
                    const childrenIds = this.tree.getChildrenIdsByParentId(id);

                    if (estimatedChildrenCount > 0) {
                        row.isFoldable = true;
                        let isFolded = this.isFolded(item);
                        if (searchIsApplied && childrenIds.length > 0) {
                            isFolded = false;
                        }
                        row.isFolded = isFolded;
                        row.onFold = row.isFoldable && this.handleOnFold;

                        const parentsWithRow = [...parents, row];

                        if (childrenIds.length > 0) { // some children are loaded
                            const childStats = iterateNode(id, appendRows && !row.isFolded, parentsWithRow);
                            row.isChildrenChecked = childStats.isSomeChecked;
                            row.isChildrenSelected = childStats.isSomeSelected;
                            stats.isSomeCheckable = stats.isSomeCheckable || childStats.isSomeCheckable;
                            stats.isSomeChecked = stats.isSomeChecked || childStats.isSomeChecked;
                            stats.isAllChecked = stats.isAllChecked && childStats.isAllChecked;
                            stats.hasMoreRows = stats.hasMoreRows || childStats.hasMoreRows;
                        } else { // children are not loaded
                            if (!row.isFolded && appendRows) {
                                for (let m = 0; m < estimatedChildrenCount && index < lastIndex; m++) {
                                    const row = this.getLoadingRow('_loading_' + index, index, parentsWithRow);
                                    row.indent = parentsWithRow.length + 1;
                                    row.isLastChild = m == (estimatedChildrenCount - 1);
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
                let missingCount: number = this.getMissingRecordsCount(parentId, rows.length, addedCount);

                if (missingCount > 0) {
                    stats.hasMoreRows = true;
                }

                // Append loading rows, stop at lastIndex (last row visible)
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

        const rootStats = iterateNode(undefined, true, []);

        if (rootStats.isSomeCheckable && this.isSelectAllEnabled()) {
            this.selectAll = {
                value: rootStats.isAllChecked,
                onValueChange: this.handleSelectAll,
                indeterminate: this.value.checked && this.value.checked.length > 0 && !rootStats.isAllChecked,
            };
        } else if (this.tree.getRootIds().length === 0 && this.props.rowOptions?.checkbox?.isVisible && this.isSelectAllEnabled()) {
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

    private getEstimatedChildrenCount = (id: TId) => {
        if (!id) return undefined;

        const item = this.tree.getById(id);
        const childCount = this.getChildCount(item);
        if (childCount === undefined) return undefined;

        const nodeInfo = this.tree.getNodeInfo(id);
        if (nodeInfo?.count !== undefined) {
            // nodes are already loaded, and we know the actual count
            return nodeInfo.count;
        }

        return childCount;
    }

    private getMissingRecordsCount(id: TId, rowsCount: number, addedRowsCount: number) {
        const nodeInfo = this.tree.getNodeInfo(id);

        const estimatedChildCount = this.getEstimatedChildrenCount(id);

        // Estimate how many more nodes there are at current level, to put 'loading' placeholders.
        if (nodeInfo.count !== undefined) { // Exact count known
            return nodeInfo.count - addedRowsCount;
        }

        const lastIndex = this.getLastRecordIndex();
        // estimatedChildCount = undefined for top-level rows only.
        if (!id && rowsCount < lastIndex) {
            return lastIndex - rowsCount; // let's put placeholders down to the bottom of visible list
        }

        if (estimatedChildCount > addedRowsCount) { // According to getChildCount (put into estimatedChildCount), there are more rows on this level
            return estimatedChildCount - addedRowsCount;
        }

        // We have a bad estimate - it even less that actual items we have
        // This would happen is getChildCount provides a guess count, and we scroll thru children past this count
        // let's guess we have at least 1 item more than loaded
        return 1;
    }

    private getLastRecordIndex = () => this.value.topIndex + this.value.visibleCount;

    protected abstract handleSelectAll(checked: boolean): void;
    protected abstract getChildCount(item: TItem): number | undefined;
    protected isFlattenSearch = () => false;
    protected isPartialLoad = () => false;
}

