import { ColumnsConfig, DataSourceState, DataTableState, IDataSource } from '@epam/uui';
import { Person, PersonGroup } from '@epam/uui-docs';

type PersonTableRecord = Person | PersonGroup;

type PersonTableRecordId = [PersonTableRecord['__typename'], string | number];

// type PersonTableFilter = DataQueryFilter<Person> & { groupBy?: string };
type PersonTableFilter = { [key: string]: any, groupBy?: string };

// field: string; вместо id
// filterKey(key): string;
interface ITableFilter {
    title: string;
    id: string; // key
    field?: string; // columnKey
    type: 'singlePicker' | 'multiPicker' | 'datePicker' | 'rangeDatePicker';
    dataSource: IDataSource<any, any, any>;
}

interface PersonsTableState extends DataTableState {
    isFolded?: boolean;
    presets?: ITablePreset[];
}

interface ITablePreset {
    name: string;
    id: number | null;
    filter: PersonTableFilter;
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
    renamePreset(preset: ITablePreset): void;
    updatePreset(preset: ITablePreset): void;
}

interface ITableStateApi extends IPresetsApi {
    filter: any;
    onFilterChange(filter: any): void;
    columnsConfig: ColumnsConfig;
    onColumnsConfigChange(columnsConfig: ColumnsConfig): void;
    presets: ITablePreset[];
}

export { PersonTableRecord, PersonTableRecordId, PersonTableFilter, ITableFilter, PersonsTableState, ITablePreset, ILocalStoragePresets, IPresetsApi, ITableStateApi };