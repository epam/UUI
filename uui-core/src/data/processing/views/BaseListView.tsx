import { BaseListViewProps, DataRowProps, ICheckable, IEditable, SortingOption, DataSourceState, DataSourceListProps, IDataSourceView, DataRowPathItem } from "../../../types";
import { Tree } from "./Tree";

export abstract class BaseListView<TItem, TId, TFilter> implements IDataSourceView<TItem, TId, TFilter> {
    protected tree: Tree<TItem, TId>;
    protected rows: DataRowProps<TItem, TId>[] = [];
    public value: DataSourceState<TFilter, TId> = {};
    protected onValueChange: (value: DataSourceState<TFilter, TId>) => void;
    protected checkedByKey: Record<string, boolean> = {};
    public selectAll?: ICheckable;
    protected isDestroyed = false;

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
        this.onValueChange({ ...this.value, checked })
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

    protected getRowProps(item: TItem, index: number): DataRowProps<TItem, TId> {
        const id = this.props.getId(item);
        const key = this.idToKey(id);
        const path = this.tree.getPathById(id);
        const parentId = path.length > 0 ? path[path.length - 1].id : undefined;

        const rowProps = {
            id,
            parentId,
            key,
            rowKey: key,
            index,
            value: item,
            depth: path.length,
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

    protected getLoadingRow(id: any, index: number = 0, path: DataRowPathItem<TId, TItem>[] = null): DataRowProps<TItem, TId> {
        const rowOptions = this.props.rowOptions;

        return {
            id,
            rowKey: this.idToKey(id),
            index,
            isLoading: true,
            depth: path ? path.length : 0,
            path: path ?? [],
            checkbox: rowOptions?.checkbox?.isVisible && { isVisible: true, isDisabled: true },
        };
    }
}
