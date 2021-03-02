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

export interface DataTableState extends DataSourceState {
    columnsConfig?: ColumnsConfig;
}

export interface DataColumnProps<TItem, TId = any, TFilter = any> extends props.FlexCellProps {
    key: string;
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
}

export interface DataRowOptions<TItem, TId> extends IDisableable {
    checkbox?: { isVisible: boolean } & IDisableable & ICanBeInvalid;
    isSelectable?: boolean;
    dnd?: IDndActor<any, any>;
    onClick?(rowProps: DataRowProps<TItem, TId>): void;
    link?: Link;
    columns?: DataColumnProps<TItem, TId>[];
}

export interface DataRowPathItem<TId> {
    id: TId;
    isLastChild: boolean;
}

export type DataRowProps<TItem, TId> = props.FlexRowProps & DataRowOptions<TItem, TId> & {
    id: TId;
    rowKey: string;
    index: number;
    value?: TItem;
    path?: DataRowPathItem<TId>[];

    /* visual */
    depth?: number;
    isLoading?: boolean;
    isFoldable?: boolean;
    isFolded?: boolean;
    isChecked?: boolean;
    isChildrenChecked?: boolean;
    isChildrenSelected?: boolean;
    isSelected?: boolean;
    isFocused?: boolean;
    isLastChild?: boolean;

    /* events */
    onFold?(rowProps: DataRowProps<TItem, TId>): void;
    onClick?(rowProps: DataRowProps<TItem, TId>): void;
    onCheck?(rowProps: DataRowProps<TItem, TId>): void;
    onSelect?(rowProps: DataRowProps<TItem, TId>): void;
    onFocus?(focusedIndex: number): void;

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