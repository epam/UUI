import React, { ReactNode } from 'react';
import { IEditable, IDisableable, ICanBeInvalid, ICheckable, IDropdownToggler, IHasCX, FlexCellProps } from './props';
import { SortDirection } from './dataQuery';
import { DndActorRenderParams, DropParams } from './dnd';
import { DataRowProps, DataSourceListProps, DataSourceState, IDataSource } from './dataSources';
import { ILens } from '..';

export interface DataTableState<TFilter = any> extends DataSourceState<TFilter> {
    columnsConfig?: ColumnsConfig;
    presetId?: number | null;
}

export interface DataColumnProps<TItem = any, TId = any, TFilter = any> extends FlexCellProps {
    key: string;
    caption?: React.ReactNode;
    fix?: "left" | "right";
    isSortable?: boolean;
    isAlwaysVisible?: boolean;
    isHiddenByDefault?: boolean;
    info?: React.ReactNode;
    isFilterActive?: (filter: TFilter, column: DataColumnProps<TItem, TId, TFilter>) => boolean;
    render?(item: TItem, rowProps: DataRowProps<TItem, TId>): any;
    renderCell?(props: DataTableCellProps<TItem, TId>): any;
    renderDropdown?(): React.ReactNode;
    renderFilter?(lens: ILens<TFilter>): React.ReactNode;
}

export interface DataTableHeaderCellProps<TItem = any, TId = any> extends IEditable<DataTableState>, IDropdownToggler, IHasCX, DataTableColumnsConfigOptions {
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

export interface DataTableHeaderRowProps<TItem = any, TId = any> extends IEditable<DataTableState>, IHasCX, DataTableColumnsConfigOptions {
    columns: DataColumnProps<TItem, TId>[];
    selectAll?: ICheckable;
    onConfigButtonClick?: (params: DataTableConfigModalParams) => any;
    renderCell?: (props: DataTableHeaderCellProps<TItem, TId>) => React.ReactNode;
    renderConfigButton?: () => React.ReactNode;
}

export interface DataTableColumnsConfigOptions {
    allowColumnsReordering?: boolean;
    allowColumnsResizing?: boolean;
}

export interface DataTableRowProps<TItem = any, TId = any> extends DataRowProps<TItem, TId> {
    columns?: DataColumnProps<TItem, TId>[];
    renderCell?: (props: DataTableCellProps<TItem, TId>) => ReactNode;
    renderDropMarkers?: (props: DndActorRenderParams) => ReactNode;
}

export interface DataTableCellProps<TItem = any, TId = any> extends IHasCX {
    rowProps: DataTableRowProps<TItem, TId>;
    column: DataColumnProps<TItem, TId>;
    index?: number;
    role?: React.HTMLAttributes<HTMLElement>['role'];
    tabIndex?: React.HTMLAttributes<HTMLElement>['tabIndex'];
}

export type ColumnsConfig = {
    [key: string]: IColumnConfig,
};

export type IColumnConfig =  {
    isVisible?: boolean;
    order?: string;
    width?: number | "auto" | "100%";
};

export type DataTableProps<TItem, TId> = DataSourceListProps & IEditable<DataSourceState> & {
    getRows(from: number, count: number): DataRowProps<TItem, TId>[];
    columns?: DataColumnProps<TItem, TId>[];
    renderRow?(props: DataRowProps<TItem, TId>): React.ReactNode;
};

export type DataTableConfigModalParams = IEditable<DataSourceState> & {
    columns: DataColumnProps<any, any>[],
};

type FilterConfigBase<TFilter extends Record<string, any>> = {
    title: string;
    field: keyof TFilter;
    columnKey?: string;
};

type PickerFilterConfig<TFilter extends Record<string, any>> = FilterConfigBase<TFilter> & {
    type: "singlePicker" | "multiPicker";
    dataSource: IDataSource<any, any, any>;
};

type DatePickerFilterConfig<TFilter extends Record<string, any>> = FilterConfigBase<TFilter> & {
    type: "datePicker" | "rangeDatePicker";
};

export type FilterConfig<TFilter extends Record<string, any>> = PickerFilterConfig<TFilter>
    | DatePickerFilterConfig<TFilter>;

export interface ITablePreset<TFilter = Record<string, any>> {
    name: string;
    id: number | null;
    filter: TFilter;
    isReadonly?: boolean;
    columnsConfig: ColumnsConfig;
}

export interface IPresetsApi {
    activePresetId: number | null;
    isDefaultPresetActive: boolean;
    choosePreset(preset: ITablePreset): void;
    createNewPreset(name: string): void;
    resetToDefault(): void;
    hasPresetChanged(preset: ITablePreset): boolean;
    duplicatePreset(preset: ITablePreset): void;
    deletePreset(preset: ITablePreset): void;
    updatePreset(preset: ITablePreset): void;
}

export interface ITableState<TFilter = Record<string, any>> extends IPresetsApi {
    tableState: DataTableState;
    setTableState(newState: DataTableState): void;
    setFilter(filter: TFilter): void;
    setColumnsConfig(columnsConfig: ColumnsConfig): void;
    presets: ITablePreset<TFilter>[];
    setPage(page: number): void;
}