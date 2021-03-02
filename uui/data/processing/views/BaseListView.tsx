import { DataRowOptions, DataRowProps, ICheckable, IEditable, SortingOption } from "../../../types";
import { DataSourceState, IDataSource } from "../types";
import { DataSourceListProps, IDataSourceView } from './types';

export interface BaseListViewProps<TItem, TId, TFilter> {
    /**
     * Should return unique ID of the TItem
     * If omitted, we assume that every TItem has and unique id in its 'id' field.
     * @param item An item to get ID of
     */
    getId?(item: TItem): TId;

    /**
     * Can be specified to set row options: if row is selectable, checkable, draggable, clickable, or have its own set of columns
     * See DataRowOptions for more details.
     * If your options depends on the item itself, use getRowOptions.
     * However, specifying both rowOptions and getRowOptions might help to render better loading skeletons
     * - we use only rowOptions in this case, as we haven't loaded an item yet.
     * @param item An item to get options for
     */
    rowOptions?: DataRowOptions<TItem, TId>;

    /**
     * Can be specified to set row options: if row is selectable, checkable, draggable, clickable, or have its own set of columns
     * See DataRowOptions for more details.
     * If both getRowOptions and rowOptions specified, we'll use getRowOptions for loaded rows, and rowOptions only for loading rows.
     * @param item An item to get options for
     */
    getRowOptions?(item: TItem, index: number): DataRowOptions<TItem, TId>;

    /**
     * Can be specified to unfold all or some items at start.
     * If not specified, all rows would be folded.
     */
    isFoldedByDefault?(item: TItem): boolean;

    /**
     * If selection (checking items) of a parent node should select all children, and vice versa
     */
    cascadeSelection?: boolean;
}

export abstract class BaseListView<TItem, TId, TFilter> implements IDataSourceView<TItem, TId, TFilter> {
    public value: DataSourceState<TFilter, TId> = {};
    protected onValueChange: (value: DataSourceState<TFilter, TId>) => void;
    protected checkedByKey: Record<string, boolean> = {};
    public selectAll?: ICheckable;

    abstract getById(id: TId, index: number): DataRowProps<TItem, TId>;
    abstract getVisibleRows(): DataRowProps<TItem, TId>[];
    abstract getListProps(): DataSourceListProps;

    _forceUpdate() {
        this.onValueChange({ ...this.value });
    }

    protected constructor(editable: IEditable<DataSourceState<TFilter, TId>>, protected props: BaseListViewProps<TItem, TId, TFilter>) {
        this.onValueChange = editable.onValueChange;
        this.value = editable.value;
        this.updateCheckedLookup(this.value && this.value.checked);
    }

    protected updateCheckedLookup(checked: TId[]) {
        this.checkedByKey = {};
        (checked || []).forEach(id => {
            this.checkedByKey[this.idToKey(id)] = true;
        });
    }

    protected handleCheckedChange(checked: TId[]) {
        this.updateCheckedLookup(checked);
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

    public getSelectedRows(): DataRowProps<TItem, TId>[] {
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
            return folded[key]
        }

        if (this.props.isFoldedByDefault) {
            return this.props.isFoldedByDefault(item);
        }

        return true;
    }

    protected getRowProps(item: TItem, index: number, parents: DataRowProps<TItem, TId>[]): DataRowProps<TItem, TId> {
        const id = this.props.getId(item);
        const key = this.idToKey(id);

        const value = this.value;

        const rowOptions = this.props.getRowOptions ? this.props.getRowOptions(item, index) : this.props.rowOptions;

        const isCheckable = rowOptions && rowOptions.checkbox && rowOptions.checkbox.isVisible && !rowOptions.checkbox.isDisabled;
        const isSelectable = rowOptions && rowOptions.isSelectable;

        const path = parents.map(p => ({ id: p.id, isLastChild: p.isLastChild }));

        const rowProps = {
            id,
            rowKey: key,
            index,
            value: item,
            depth: 0,
            path,
            ...rowOptions,
            isFocused: value.focusedIndex === index,
            isChecked: !!this.checkedByKey[key],
            isSelected: value.selectedId === id,
            onCheck: isCheckable && this.handleOnCheck,
            onSelect: rowOptions && rowOptions.isSelectable && this.handleOnSelect,
            onFocus: (isSelectable || isCheckable) && this.handleOnFocus,
        } as DataRowProps<TItem, TId>;

        return rowProps;
    }

    protected getLoadingRow(id: any, index: number = 0, depth = 0): DataRowProps<any, any> {
        const rowOptions = this.props.rowOptions;

        return {
            id,
            rowKey: JSON.stringify(id),
            index,
            isLoading: true,
            depth,
            checkbox: rowOptions?.checkbox.isVisible && { isVisible: true, isDisabled: true },
        };
    }
}

