import React, { Attributes, Dispatch, ForwardedRef, ReactNode, SetStateAction } from 'react';
import {
    IEditable, ICheckable, IHasCX, IClickable, IHasRawProps, ICanBeInvalid, ICanFocus, IDropdownBodyProps,
    IDropdownToggler, IHasValidationMessage,
} from './props';
import { PickerBaseOptions } from './pickers';
import { DataRowProps } from './dataRows';
import { FilterPredicateName } from './dataQuery';
import { DndActorRenderParams, DndEventHandlers, DropParams } from './dnd';
import {
    DataSourceState, SortDirection, SortingOption,
} from './dataSources';
import { ILens } from '../data/lenses/types';
import * as CSS from 'csstype';
import { CommonDatePickerProps, TooltipCoreProps } from './components';
import { IFilterItemBodyProps } from './components/filterItemBody';

export interface DataTableState<TFilter = any, TViewState = any> extends DataSourceState<TFilter> {
    /** Configuration of columns at the DataTable. Used to define column visibility, width and order */
    columnsConfig?: ColumnsConfig;
    /** Configuration of filter at the FilterPanel. Used to define filter visibility and order */
    filtersConfig?: FiltersConfig;
    /** ID of currently selected preset */
    presetId?: number | null;
    /** State which will not trigger data reloading, but will be stored in presets or URL */
    viewState?: TViewState;
}

export type ICanBeFixed = {
    /** If specified, will make column fixed - it would not scroll horizontally */
    fix?: 'left' | 'right';
};

export interface DataColumnProps<TItem = any, TId = any, TFilter = any> extends ICanBeFixed, IHasCX, IClickable, IHasRawProps<HTMLDivElement>, Attributes {
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

    /** Aligns cell and header content horizontally */
    textAlign?: 'left' | 'center' | 'right';

    /** Aligns only cell content horizontally */
    justifyContent?: CSS.JustifyContentProperty;

    /** Align cell content vertically */
    alignSelf?: CSS.AlignSelfProperty;

    /**
     * Enables sorting arrows on the column.
     * Sorting state is kept in DataSourceState.sorting
     */
    isSortable?: boolean;

    /** Makes this column locked, which means that you can't hide, unpin or reorder this column. Usually applicable for such column without which table because useless.
     * Note, that isAlwaysVisible column should be always fixed to any side of the table, if you didn't specify `column.fix` prop for such column, 'left' value will be used by default.
     * Also, if you have a few isAlwaysVisible columns, it's necessary to place it together in the start or end(depends on `fix` prop) of columns array.
     * */
    isAlwaysVisible?: boolean;

    /** Makes column hidden by default. User can turn it on later, via ColumnsConfiguration */
    isHiddenByDefault?: boolean;

    /** Info tooltip displayed in the table header */
    info?: React.ReactNode;

    /**
     * Should return true, if current filter affects the column.
     * Usually, this prop is filled automatically by the useTableState hook.
     * If you use the useTableState hook, you don't need to specify it manually.
     */
    isFilterActive?: (filter: TFilter, column: DataColumnProps<TItem, TId, TFilter>) => boolean;

    /** A pure function that defines that column value can be copied to the other column. */
    canCopy?: (cell: DataTableSelectedCellData<TItem, TId, TFilter>) => boolean;

    /** A pure function that defines that column accepts copying other column value into it */
    canAcceptCopy?: (from: DataTableSelectedCellData<TItem, TId, TFilter>, to: DataTableSelectedCellData<TItem, TId, TFilter>) => boolean;

    /** Pass true, to enable column resizing. By default, will be used global 'allowColumnsResizing' value from DataTable component.  */
    allowResizing?: boolean

    /** Render the cell content. The item props is the value of the whole row (TItem). */
    render?(item: TItem, props: DataRowProps<TItem, TId>): any;

    /** Overrides rendering of the whole cell */
    renderCell?(cellProps: RenderCellProps<TItem, TId>): any;
    /**
     * Overrides rendering of the whole header cell.
     */
    renderHeaderCell?(cellProps: DataTableHeaderCellProps<TItem, TId>): any;

    /**
     *  Render callback for column header dropdown.
     * Usually, this prop is filled automatically by the useTableState hook.
     * If you use the useTableState hook, you don't need to specify it manually.
     */
    renderDropdown?(): React.ReactNode;

    /**
     *  Render callback for column filter.
     * If you use useTableState hook, and you specify filter for the column, default filter will be rendered automatically.
     * You can use this prop to render a custom filter component.
     */
    renderFilter?(lens: ILens<TFilter>, dropdownProps: IDropdownBodyProps): React.ReactNode;

    /** Render callback for column header tooltip.
     * This tooltip will appear on cell hover with 600ms delay.
     *
     * If omitted, default implementation with column.caption + column.info will be rendered.
     * Pass `() => null` to disable tooltip rendering.
     */
    renderTooltip?(column: DataColumnProps<TItem, TId, TFilter>): React.ReactNode;
}

export interface DataTableHeaderCellProps<TItem = any, TId = any> extends IEditable<DataTableState>, IDropdownToggler, IHasCX, DataTableColumnsConfigOptions {
    key: string;
    column: DataColumnProps<TItem, TId>;
    isFirstColumn: boolean;
    isLastColumn: boolean;
    selectAll?: ICheckable;
    /**
     * Enables collapse/expand all functionality.
     * */
    showFoldAll?: boolean;
    /**
     * Fold all click handler.
     * If `showFoldAll` is not enabled, onFoldAll is not passed.
     * */
    onFoldAll?(): void;
    /**
     * Indicates if all nodes are folded.
     */
    areAllFolded?: boolean;
    isFilterActive?: boolean;
    sortDirection?: SortDirection;
    onSort(dir: SortDirection): void;
    onDrop?(params: DropParams<DataColumnProps<TItem, TId>, DataColumnProps<TItem, TId>>): void;
    renderFilter?: (dropdownProps: IDropdownBodyProps) => React.ReactNode;
}

export type DataTableConfigModalParams = IEditable<DataSourceState> & {
    /** Array of all table columns */
    columns: DataColumnProps[];
};

export interface DataTableHeaderRowProps<TItem = any, TId = any> extends IEditable<DataTableState>, IHasCX, DataTableColumnsConfigOptions {
    columns: DataColumnProps<TItem, TId>[];
    selectAll?: ICheckable;
    /**
     * Enables collapse/expand all functionality.
     * */
    showFoldAll?: boolean;
    onConfigButtonClick?: (params: DataTableConfigModalParams) => any;
    renderCell?: (props: DataTableHeaderCellProps<TItem, TId>) => React.ReactNode;
    renderConfigButton?: () => React.ReactNode;
}

export interface DataTableColumnsConfigOptions {
    /** If true, allows user to change columns order
     * @default false
     * */
    allowColumnsReordering?: boolean;
    /** If true, allows user to change columns width
     * @default false
     * */
    allowColumnsResizing?: boolean;
}

export interface DataTableRowProps<TItem = any, TId = any> extends DataRowProps<TItem, TId> {
    /** Array of visible columns */
    columns?: DataColumnProps<TItem, TId>[];
    /**
     * Render callback for each cell at row.
     * If omitted, default cell renderer will be used.
     * */
    renderCell?: (props: DataTableCellProps<TItem, TId, any>) => ReactNode;
    /**
     * Render callback for the drop marker. Rendered only if 'dnd' option was provided via getRowProps.
     * If omitted, default renderer will be used.
     * */
    renderDropMarkers?: (props: DndActorRenderParams) => ReactNode;
}

export interface RenderEditorProps<TItem, TId, TCellValue> extends IEditable<TCellValue>, IHasValidationMessage, ICanFocus<any> {
    /** DataRowProps object of rendered row */
    rowProps: DataRowProps<TItem, TId>;
    /** Cell mode signal the editor component to adapt it's visuals to cell editor */
    mode: 'cell';
    /** Ref to pass to the editor component.
     * It's required for correct focus/blur behavior.
     * */
    ref?: ForwardedRef<HTMLElement>;
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

export interface DataTableCellProps<TItem = any, TId = any, TCellValue = any> extends
    DataTableCellOptions<TItem, TId>, IHasCX, Partial<IEditable<TCellValue>>, IHasValidationMessage {
    /** Add-on controls to put before the cell content (folding arrow, checkbox, etc.) */
    addons?: React.ReactNode;

    /** Overrides default loading placeholder ('skeleton') rendering.
     * By default: () => <Text> Unknown </Text>
     * */
    renderPlaceholder?(cellProps: DataTableCellProps<TItem, TId, TCellValue>): React.ReactNode;

    /** Overrides default unknown item rendering */
    renderUnknown?(cellProps: DataTableCellProps<TItem, TId, TCellValue>): React.ReactNode;

    /**
     * If passed, the cell is rendered as editable - receives focus, show validation errors.
     * All necessary props for the editor are passed as argument:
     * - props implements IEditable and can be passed directly to suitable component (like TextInput)
     * - ICanFocus props are passed as well. Component should implement it so cell focus highlight works properly
     * - mode='cell' prop is passed to render UUI components in 'cell' mode
     * - rowProps is passed, so you depend on additional info about the row itself
     */
    renderEditor?(props: RenderEditorProps<TItem, TId, TCellValue>): React.ReactNode;

    /** Overrides default tooltip, used to show validation message if the cell is invalid */
    renderTooltip?: (props: ICanBeInvalid & TooltipCoreProps) => React.ReactElement;

    /**
     * Drag'n'drop marker event handlers.
     */
    eventHandlers?: DndEventHandlers;
    style?: React.CSSProperties;
}

export interface RenderCellProps<TItem = any, TId = any> extends DataTableCellOptions<TItem, TId> {
    /**
     * Lens instance, wrapping IEditable on the row, to help binding to row's value.
     * E.g. <TextInput { ...rowLens.prop('name').toProps() } />
     */
    rowLens: ILens<TItem>;

    /**
     * Drag'n'drop marker event handlers.
     */
    eventHandlers?: DndEventHandlers;
}

export type ColumnsConfig = {
    /** Config for each column */
    [key: string]: IColumnConfig;
};

export type IColumnConfig = {
    /** If true, the column will be shown in the FiltersPanel */
    isVisible?: boolean;
    /**
     * Determines the order in which this column should appear in the table.
     * The columns are sorted in ascending alphabetical order.
     */
    order?: string;
    /** The width of the column */
    width?: number;
} & ICanBeFixed;

export type FiltersConfig<TFilter = any> = {
    [key in keyof TFilter]: IFilterConfig;
};

export type IFilterConfig = {
    /** If true, the filter will be shown in the FiltersPanel */
    isVisible: boolean;
    /**
     * Determines the order in which this filter should appear in the filters list.
     * The filters are sorted in ascending alphabetical order.
     */
    order?: string;
};

export type IFilterPredicate = {
    /** Name of the predicate, used to display */
    name: string;
    /** Predicate key, which wraps filter value.
     *  E.g. your have 'in' predicate for locationIds filter, the resulted filter object will be:
     *  filter: {
     *      locationIds: {
     *          in: [/selected location ids/]
     *      }
     *  }
     *  */
    predicate: FilterPredicateName;
    /** Pass true to make this predicate selected by default */
    isDefault?: boolean;
};

type FilterConfigBase<TFilter> = {
    /** Title of the filter, displayed in filter toggler and filter body */
    title: string;
    /** Field of filters object, where store the filter value */
    field: keyof TFilter;
    /**
     * Key of the column to which the filter is attached.
     * If omitted, filter won't be attached to the column.
     * */
    columnKey?: string;
    /** Pass true to make filter always visible in FilterPanel. User can't hide it via 'Add filter' dropdown */
    isAlwaysVisible?: boolean;
    /** Array of available predicates for the filter. This predicated can be chosen by user and applied to the filter value. */
    predicates?: IFilterPredicate[];
    /** Count of words to show in the Filter toggler. By default, 2 item will be shown. */
    maxCount?: number;
    /** Defines maxWidth of the filter toggler */
    togglerWidth?: number;
};

export type PickerFilterConfig<TFilter> = FilterConfigBase<TFilter> & Pick<PickerBaseOptions<any, any>, 'dataSource' | 'getName' | 'renderRow'> & {
    /** Type of the filter */
    type: 'singlePicker' | 'multiPicker';
    /**
     * Pass false to hide search in picker body.
     * If omitted, true value will be used.
     */
    showSearch?: boolean;
    /** Height of picker items list in px. This height doesn't include height of body toolbars(sorting, predicates) */
    maxBodyHeight?: number;
    /**
     * Enables highlighting of the items' text with search-matching results.
     */
    highlightSearchMatches?: boolean;
};

type DatePickerFilterConfig<TFilter> = FilterConfigBase<TFilter> & Pick<CommonDatePickerProps, 'filter' | 'format'> & {
    /** Type of the filter */
    type: 'datePicker';
};

type RangeDatePickerFilterConfig<TFilter> = FilterConfigBase<TFilter> & Pick<CommonDatePickerProps, 'filter' | 'format'> & {
    /** Type of the filter */
    type: 'rangeDatePicker';
};

type NumericFilterConfig<TFilter> = FilterConfigBase<TFilter> & {
    /** Type of the filter */
    type: 'numeric';
};

type CustomFilterConfig<TFilter> = FilterConfigBase<TFilter> & {
    /** Type of the filter */
    type: 'custom';
    /** Render callback for filter body */
    render: (props: IFilterItemBodyProps<any>) => React.ReactElement;
    /** A pure function that gets value to display in filter toggler */
    getTogglerValue: (props: IFilterItemBodyProps<any>) => ReactNode;
};

export type TableFiltersConfig<TFilter> = PickerFilterConfig<TFilter> | DatePickerFilterConfig<TFilter> |
NumericFilterConfig<TFilter> | RangeDatePickerFilterConfig<TFilter> | CustomFilterConfig<TFilter>;

export interface ITablePreset<TFilter = any, TViewState = any> {
    /** Name of the filter */
    name: string;
    /** Unique Id of the filter */
    id: number | null;
    /** If true, this preset can't be deleted or modified */
    isReadonly?: boolean;
    /**
     * Determines the order in which this preset should appear in the presets list.
     * The columns are sorted in ascending alphabetical order.
     */
    order?: string;
    /** Filter value stored in the preset */
    filter?: TFilter;
    /** Columns config value stored in the preset */
    columnsConfig?: ColumnsConfig;
    /** Filters config value stored in the preset */
    filtersConfig?: FiltersConfig;
    /** Sorting value stored in the preset */
    sorting?: SortingOption[];
    /** View state value stored in the preset */
    viewState?: TViewState;
}

export interface IPresetsApi<TFilter = any, TViewState = any> {
    /** ID of selected preset */
    activePresetId: number | null;
    /** Function that selects given preset  */
    choosePreset(preset: ITablePreset<TFilter, TViewState>): void;
    /** Function that gives preset name and create new preset with this name and current table state  */
    createNewPreset(name: string): Promise<number>;
    /** Function that gives preset and return if this preset changed or not  */
    hasPresetChanged(preset: ITablePreset<TFilter, TViewState>): boolean;
    /** Function that gives the preset and creat their duplicate  */
    duplicatePreset(preset: ITablePreset<TFilter, TViewState>): void;
    /** Function that deletes given preset  */
    deletePreset(preset: ITablePreset<TFilter, TViewState>): Promise<void>;
    /** Function that updates given preset  */
    updatePreset(preset: ITablePreset<TFilter, TViewState>): Promise<void>;
    /** Function that gives preset and return URL link on given preset  */
    getPresetLink(preset: ITablePreset<TFilter, TViewState>): string;
    /** Array of presets  */
    presets: ITablePreset<TFilter, TViewState>[];
}

export interface ITableState<TFilter = Record<string, any>, TViewState = any> extends IPresetsApi<TFilter, TViewState> {
    /** Table state value */
    tableState: DataTableState<TFilter, TViewState>;
    /** Function that updates table state value */
    setTableState: Dispatch<SetStateAction<DataTableState<TFilter, TViewState>>>;
    /** Function that updates filter value */
    setFilter(filter: TFilter): void;
    /** Function that updates columns config value */
    setColumnsConfig(columnsConfig: ColumnsConfig): void;
    /** Function that updates filters config value */
    setFiltersConfig(filtersConfig: FiltersConfig): void;
}

export interface DataTableSelectedCellData<TItem = any, TId = any, TFilter = any> {
    /** Column props of the selected cell */
    column: DataColumnProps<TItem, TId, TFilter>;
    /** Row props of the selected cell */
    row: DataRowProps<TItem, TId>;
}
