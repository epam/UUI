import React, { Attributes, ReactNode } from 'react';
import { IEditable, ICheckable, IDropdownToggler, IHasCX, IClickable, IHasRawProps,
    ICanBeInvalid, ICanFocus, IDropdownBodyProps } from './props';
import { FilterPredicateName, SortDirection, SortingOption } from './dataQuery';
import { DndActorRenderParams, DropParams } from './dnd';
import { DataRowProps, DataSourceState, IDataSource } from './dataSources';
import { ILens } from '../data';
import * as CSS from 'csstype';
import { TooltipCoreProps } from './components';

export interface DataTableState<TFilter = any, TViewState = any> extends DataSourceState<TFilter> {
    columnsConfig?: ColumnsConfig;
    filtersConfig?: FiltersConfig;
    presetId?: number | null;
    viewState?: TViewState;
}

export type ICanBeFixed = {
    /** If specified, will make column fixed - it would not scroll horizontally */
    fix?: 'left' | 'right';
};

export interface DataColumnProps<TItem = any, TId = any, TFilter = any>
    extends ICanBeFixed, IHasCX, IClickable, IHasRawProps<HTMLDivElement>, Attributes {
    /**
     * Unique key to identify the column. Used to reference columns, e.g. in ColumnsConfig.
     * Also, used as React key for cells, header cells, and other components inside tables.
     */
    key: string;

    /** Column caption. Can be a plain text, or any React Component */
    caption?: React.ReactNode;

    /**
     * The width of the column. Usually, columns has exact this width.
     * When all columns fit, and there's spare horizontal space, you can use 'grow' prop to use this space for certain columns.
     * DataTable's columns can't shrink below width - table will add horizontal scrolling instead of shrinking columns
     */
    width: number;

    /** Minimal width to which column can be resized manually */
    minWidth?: number;

    /** The flex grow for the column. Allows column to grow in width if there's spare horizontal space */
    grow?: number;

    /** @deprecated Shrink prop doesn't affect anything in table columns. This prop will be removed in future versions. */
    shrink?: number;

    /** Aligns cell content horizontally */
    textAlign?: 'left' | 'center' | 'right';

    justifyContent?: CSS.JustifyContentProperty;

    /** Align cell content vertically */
    alignSelf?: CSS.AlignSelfProperty;

    /**
     * Enables sorting arrows on the column.
     * Sorting state is kept in DataSourceState.sorting
     */
    isSortable?: boolean;

    /** Disallows to hide column via ColumnsConfiguration */
    isAlwaysVisible?: boolean;

    /** Makes column hidden by default. User can turn it on later, via ColumnsConfiguration */
    isHiddenByDefault?: boolean;

    /** Info tooltip displayed in the table header */
    info?: React.ReactNode;

    /**
     *  Should return true, if current filter affects the column.
     * Usually, this prop is filled automatically by the useTableState hook.
     * If you use the useTableState hook, you don't need to specify it manually.
     */
    isFilterActive?: (filter: TFilter, column: DataColumnProps<TItem, TId, TFilter>) => boolean;

    canCopy?: (cell: DataTableSelectedCellData<TItem, TId, TFilter>) => boolean;
    canAcceptCopy?: (from: DataTableSelectedCellData<TItem, TId, TFilter>, to: DataTableSelectedCellData<TItem, TId, TFilter>) => boolean;

    /** Render the cell content. The item props is the value of the whole row (TItem). */
    render?(item: TItem, props: DataRowProps<TItem, TId>): any;

    /** Overrides rendering of the whole cell */
    renderCell?(cellProps: RenderCellProps<TItem, TId>): any;

    /**
     * Renders column header dropdown.
     * Usually, this prop is filled automatically by the useTableState hook.
     * If you use the useTableState hook, you don't need to specify it manually.
     */
    renderDropdown?(): React.ReactNode;

    /**
     * Renders column filter.
     * If you use useTableState hook, and you specify filter for the column, default filter will be rendered automatically.
     * You can use this prop to render a custom filter component.
     */
    renderFilter?(lens: ILens<TFilter>, dropdownProps: IDropdownBodyProps): React.ReactNode;
}

export interface DataTableHeaderCellProps<TItem = any, TId = any> extends IEditable<DataTableState>, IDropdownToggler, IHasCX, DataTableColumnsConfigOptions {
    key: string;
    column: DataColumnProps<TItem, TId>;
    isFirstColumn: boolean;
    isLastColumn: boolean;
    selectAll?: ICheckable;
    isFilterActive?: boolean;
    sortDirection?: SortDirection;
    onSort(dir: SortDirection): void;
    onDrop?(params: DropParams<DataColumnProps<TItem, TId>, DataColumnProps<TItem, TId>>): void;
    renderFilter?: (dropdownProps: IDropdownBodyProps) => React.ReactNode;
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
    renderCell?: (props: DataTableCellProps<TItem, TId, any>) => ReactNode;
    renderDropMarkers?: (props: DndActorRenderParams) => ReactNode;
}

export interface RenderEditorProps<TItem, TId, TCellValue> extends IEditable<TCellValue>, ICanFocus<any> {
    rowProps: DataRowProps<TItem, TId>;
    isFocused: boolean;
    mode: 'cell'; // This can signal the editor component to adapt it's visuals to cell editor
}

export interface DataTableCellOptions<TItem = any, TId = any> {
    /** Key to use as component's key */
    key: string;

    /** DataTableRowsProps object for the table row the cell is at */
    rowProps: DataTableRowProps<TItem, TId>;

    /** DataColumnProps object for the column the cell is at */
    column: DataColumnProps<TItem, TId>;

    /** Column index in table  */
    index?: number;

    /** True if the cell is in the first column */
    isFirstColumn: boolean;

    /** True if the cell is in the last column */
    isLastColumn: boolean;

    /** HTML tabIndex attribute to set on the cell */
    tabIndex?: React.HTMLAttributes<HTMLElement>['tabIndex'];
}

export interface DataTableCellProps<TItem = any, TId = any, TCellValue = any> extends DataTableCellOptions<TItem, TId>, IHasCX, Partial<IEditable<TCellValue>> {
    /** Add-on controls to put before the cell content (folding arrow, checkbox, etc.) */
    addons?: React.ReactNode;

    /** Overrides default loading placeholder ('skeleton') rendering  */
    renderPlaceholder?(cellProps: DataTableCellProps<TItem, TId, TCellValue>): React.ReactNode;

    /**
     * If passed, the cell is rendered as editable - receives focus, show validation errors.
     * All necessary props for the editor are passed as argument:
     * - props implements IEditable and can be passed directly to suitable component (like TextInput)
     * - ICanFocus props are passed as well. Component should implement it so cell focus highlight works properly
     * - mode='cell' prop is passed to render UUI components in 'cell' mode
     * - rowProps is passed so you depend on additional info about the row itself
     */
    renderEditor?(props: RenderEditorProps<TItem, TId, TCellValue>): React.ReactNode;

    /** Overrides default tooltip, used to show validation message if the cell is invalid */
    renderTooltip?: (props: ICanBeInvalid & TooltipCoreProps) => React.ReactElement;
}

export interface RenderCellProps<TItem = any, TId = any> extends DataTableCellOptions<TItem, TId> {
    /**
     * Lens instance, wrapping IEditable on the row, to help binding to row's value.
     * E.g. <TextInput { ...rowLens.prop('name').toProps() } />
     */
    rowLens: ILens<TItem>;
}

export type ColumnsConfig = {
    [key: string]: IColumnConfig,
};

export type IColumnConfig =  {
    isVisible?: boolean;
    order?: string;
    width?: number;
} & ICanBeFixed;

export type FiltersConfig<TFilter = any> = {
    [key in keyof TFilter]: IFilterConfig;
};

export type IFilterConfig = {
    isVisible: boolean;
    order?: string;
};

export type DataTableConfigModalParams = IEditable<DataSourceState> & {
    columns: DataColumnProps<any, any>[],
};

export type IFilterPredicate = {
    name: string;
    predicate: FilterPredicateName;
    isDefault?: boolean;
};

type FilterConfigBase<TFilter> = {
    title: string;
    field: keyof TFilter;
    columnKey: string;
    isAlwaysVisible?: boolean;
    predicates?: IFilterPredicate[];
};

type PickerFilterConfig<TFilter> = FilterConfigBase<TFilter> & {
    type: "singlePicker" | "multiPicker";
    dataSource: IDataSource<any, any, any>;
    getName?: (item: any) => string;
    renderRow?: (props: DataRowProps<any, any>) => ReactNode;
    valueType?: "id";
};

type DatePickerFilterConfig<TFilter> = FilterConfigBase<TFilter> & {
    type: "datePicker" | "rangeDatePicker";
    format?: string;
};

type NumericFilterConfig<TFilter> = FilterConfigBase<TFilter> & {
    type: "numeric";
};

export type TableFiltersConfig<TFilter> = PickerFilterConfig<TFilter>
    | DatePickerFilterConfig<TFilter> | NumericFilterConfig<TFilter>;

export interface ITablePreset<TFilter = any, TViewState = any> {
    name: string;
    id: number | null;
    filter?: TFilter;
    isReadonly?: boolean;
    columnsConfig?: ColumnsConfig;
    filtersConfig?: FiltersConfig;
    sorting?: SortingOption[];
    order?: string;
    viewState?: TViewState;
}

export interface IPresetsApi<TFilter = any, TViewState = any> {
    activePresetId: number | null;
    choosePreset(preset: ITablePreset): void;
    createNewPreset(name: string): Promise<number>;
    hasPresetChanged(preset: ITablePreset): boolean;
    duplicatePreset(preset: ITablePreset): void;
    deletePreset(preset: ITablePreset): Promise<void>;
    updatePreset(preset: ITablePreset): Promise<void>;
    getPresetLink(preset: ITablePreset): string;
    presets: ITablePreset[];
}

export interface ITableState<TFilter = Record<string, any>, TViewState = any> extends IPresetsApi<TFilter, TViewState> {
    tableState: DataTableState<TFilter, TViewState>;
    setTableState(newState: DataTableState): void;
    setFilter(filter: TFilter): void;
    setColumnsConfig(columnsConfig: ColumnsConfig): void;
    setFiltersConfig(filtersConfig: FiltersConfig): void;
}

export interface DataTableSelectedCellData <TItem = any, TId = any, TFilter = any> {
    column: DataColumnProps<TItem, TId, TFilter>;
    row: DataRowProps<TItem, TId>;
}
