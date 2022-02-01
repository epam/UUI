import { ColumnsConfig, DataTableState, IDataSource } from "@epam/uui";
import { Person, PersonGroup, Location } from "@epam/uui-docs";

type PersonTableRecord = Person | PersonGroup | Location;

type PersonTableRecordId = [PersonTableRecord["__typename"], string | number];

// type PersonTableFilter = DataQueryFilter<Person> & { groupBy?: string };
type PersonTableFilter = { [key: string]: any, groupBy?: string };

interface FilterConfig<TFilter extends Record<string, any>> {
    title: string;
    field: keyof TFilter;
    type: "singlePicker" | "multiPicker" | "datePicker" | "rangeDatePicker";
    columnKey?: string;
    dataSource?: IDataSource<any, any, any>;
}

interface PersonsTableState extends DataTableState {
    isFolded?: boolean;
    presets?: ITablePreset[];
}

interface ITablePreset<TFilter = Record<string, any>> {
    name: string;
    id: number | null;
    filter: TFilter;
    isReadonly?: boolean;
    columnsConfig: ColumnsConfig;
}

type ILocalStoragePresets = (Omit<ITablePreset, "isActive">)[];

interface IPresetsApi {
    getActivePresetId(): number;
    isDefaultPresetActive(): boolean;
    choosePreset(preset: ITablePreset): void;
    createNewPreset(name: string): void;
    resetToDefault(): void;
    hasPresetChanged(preset: ITablePreset): boolean;
    duplicatePreset(preset: ITablePreset): void;
    deletePreset(preset: ITablePreset): void;
    updatePreset(preset: ITablePreset): void;
}

interface ITableState<TFilter = Record<string, any>> extends IPresetsApi {
    tableState: DataTableState;
    onTableStateChange(newState: DataTableState): void;
    onFilterChange(filter: TFilter): void;
    onColumnsConfigChange(columnsConfig: ColumnsConfig): void;
    presets: ITablePreset<TFilter>[];
}

export { PersonTableRecord, PersonTableRecordId, PersonTableFilter, FilterConfig, PersonsTableState, ITablePreset, ILocalStoragePresets, IPresetsApi, ITableState };