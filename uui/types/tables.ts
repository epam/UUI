import React from 'react';
import * as props from './props';
import {IEditable, IDisableable, ICanBeInvalid, ICheckable, IDndActor, SortDirection, IDropdownToggler, IHasCX, DropParams} from '../types';
import { DataSourceListProps, DataSourceState } from '../data/processing';
import { ScrollManager } from '../services';
import { ILens } from '..';
import { Link } from '../types';

export interface VirtualListState {
    topIndex?: number;
    visibleCount?: number;
}

export interface DataTableState<TFilter = any> extends DataSourceState<TFilter> {
    columnsConfig?: ColumnsConfig;
}

export interface DataColumnProps<TItem, TId = any, TFilter = any> extends props.FlexCellProps {
    key: string;
    filterId?: string;
    caption?: React.ReactNode;
    fix?: 'left' | 'right';
    isSortable?: boolean;
    isAlwaysVisible?: boolean;
    isHiddenByDefault?: boolean;
    info?: React.ReactNode;
    isFilterActive?: (filter: TFilter, column: DataColumnProps<TItem, TId, TFilter>) => boolean;
    render?(d: TItem, rowProps: DataRowProps<TItem, TId>): any;
    renderCell?(props: DataTableCellProps<TItem, TId>): any;
    renderDropdown?(): React.ReactNode;
    renderFilter?(lens: ILens<TFilter>): React.ReactNode;
}

export interface DataTableHeaderCellProps<TItem, TId> extends IEditable<DataTableState>, IDropdownToggler, IHasCX, DataTableColumnsConfigOptions {
    column: DataColumnProps<TItem, TId>;
    isFirstColumn: boolean;
    isLastColumn: boolean;
    selectAll?: ICheckable;
    isFilterActive?: boolean;
    sortDirection?: SortDirection;
    onSort(dir: SortDirection): void;
    onDrop?(params: DropParams<DataColumnProps<TItem, TId>, DataColumnProps<TItem, TId>>): void;
    renderFilter?: () => React.ReactNode;
}

export interface DataTableHeaderRowProps<TItem, TId> extends IEditable<DataTableState>, IHasCX, DataTableColumnsConfigOptions {
    columns: DataColumnProps<TItem, TId>[];
    scrollManager?: ScrollManager;
    selectAll?: ICheckable;
    onConfigButtonClick?: (params: DataTableConfigModalParams) => any;
    renderCell?: (props: DataTableHeaderCellProps<TItem, TId>) => React.ReactNode;
    renderConfigButton?: () => React.ReactNode;
}

export interface DataTableColumnsConfigOptions {
    allowColumnsReordering?: boolean;
    allowColumnsResizing?: boolean;
}

export interface DataTableCellProps<TItem, TId> {
    rowProps: DataRowProps<TItem, TId>;
    column: DataColumnProps<TItem, TId>;
    index: number;
    role: React.HTMLAttributes<HTMLElement>['role'];
}

export interface DataRowOptions<TItem, TId> extends IDisableable {
    checkbox?: { isVisible: boolean } & IDisableable & ICanBeInvalid;
    isSelectable?: boolean;
    dnd?: IDndActor<any, any>;
    onClick?(rowProps: DataRowProps<TItem, TId>): void;
    link?: Link;
    columns?: DataColumnProps<TItem, TId>[];
}

export interface DataRowPathItem<TId, TItem> {
    id: TId;
    value: TItem;
    isLastChild: boolean;
}

/** DataRowProps is a base shape of props, passed to items in various lists or trees.
 *
 * Despite 'Row' in it's name, it doesn't directly connected to a table.
 * We use DataRowProps as a base for DataTableRowProps and DataPickerRowProps.
 * But it can also be used for any user-built list, tree, custom picker rows, or even a grid of cards.
 *
 * Array of DataRowProps describes a part of hierarchical list, while still being a flat array (not a tree of some kind).
 * We use depth, indent, path, and other props to show row's place in the hierarchy.
 * This is very handy to handle rendering, especially in virtual scrolling scenarios.
 *
 * DataSources primary job is to convert various data stores into arrays of DataRowProps.
 */
export type DataRowProps<TItem, TId> = props.FlexRowProps & DataRowOptions<TItem, TId> & {
    /** ID of the TItem rows displays */
    id: TId;

    /** Key of the TItem row displays. This is the ID converted to string.
     * We use this internally to identify rows, and hold rows them in various hash-tables.
     * ID can't be used for this, as it is not guaranteed to be comparable. E.g. one can use TID=[int, string] to hold composite IDs.
     * */
    rowKey: string;

    /** Index of the row, from the top of the list. This doesn't account any hierarchy. */
    index: number;

    /** The data item (TItem) row displays. Will be undefined if isLoading = true. */
    value?: TItem;

    /** Hierarchical path from the root node to the item (excluding the item itself) */
    path?: DataRowPathItem<TId, TItem>[];

    /* visual */

    /** Depth of the row in tree, 0 for the top-level */
    depth?: number;

    /** Indent of the item, to show hierarchy.
     *  Unlike depth, it contains additional logic, to not add unnecessary indents:
     *  if all children of node has no children, all nodes would get the same indent as parent.
     */
    indent?: number;

    /** True if row is in loading state. Value is empty in this case */
    isLoading?: boolean;

    /** True if row contains children and so it can be folded or unfolded */
    isFoldable?: boolean;

    /** True if row is currently unfolded */
    isFolded?: boolean;

    /** True if row is checked with checkbox */
    isChecked?: boolean;

    /** True if some of row's children are checked.
     * Used to show 'indefinite' checkbox state, to show user that something inside is checked */
    isChildrenChecked?: boolean;

    /** True if row is selected (in single-select mode, or in case when interface use both single row selection and checkboxes) */
    isSelected?: boolean;

    /** True if any of row's children is selected. */
    isChildrenSelected?: boolean;

    /** True if row is focused. Focus can be changed via keyboard arrow keys, or by hovering mouse on top of the row */
    isFocused?: boolean;

    /** True if row is the last child of his parent */
    isLastChild?: boolean;

    /* events */

    /** Handles row folding change.
     * We demand to pass the row as well, to avoid creating closures for each row.
     */
    onFold?(rowProps: DataRowProps<TItem, TId>): void;

    /** Handles row click.
     * We demand to pass the row as well, to avoid creating closures for each row.
     */
    onClick?(rowProps: DataRowProps<TItem, TId>): void;

    /** Handles row checkbox change.
     * We demand to pass the row as well, to avoid creating closures for each row.
     */
    onCheck?(rowProps: DataRowProps<TItem, TId>): void;

    /** Handles row selection.
     * We demand to pass the row as well, to avoid creating closures for each row.
     */
    onSelect?(rowProps: DataRowProps<TItem, TId>): void;

    /** Handles row focusing.
     * We demand to pass the row as well, to avoid creating closures for each row.
     */
    onFocus?(focusedIndex: number): void;

    /** ScrollManager instance, which synchronizes horizontal scrolling of rows. Optional, used for tables with horizontal scrolling. */
    scrollManager?: ScrollManager;
};

export type ColumnsConfig = {
    [key: string]: IColumnConfig,
};

export type IColumnConfig =  {
    isVisible?: boolean;
    order?: string;
    width?: number | 'auto' | '100%';
};

export type DataTableProps<TItem, TId> = DataSourceListProps & IEditable<DataSourceState> & {
    getRows(from: number, count: number): DataRowProps<TItem, TId>[];
    columns?: DataColumnProps<TItem, TId>[];
    renderRow?(props: DataRowProps<TItem, TId>): React.ReactNode;
};

export type DataTableConfigModalParams = IEditable<DataSourceState> & {
    columns: DataColumnProps<any, any>[],
};