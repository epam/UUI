import { ColumnsConfig, DataTableState, IDataSource } from "@epam/uui";
import { Person, PersonGroup, Location } from "@epam/uui-docs";

type PersonTableRecord = Person | PersonGroup | Location;

type PersonTableRecordId = [PersonTableRecord["__typename"], string | number];

type PersonTableFilter = { [key: string]: any, groupBy?: string };

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

interface ITableState<TFilter = Record<string, any>> extends IPresetsApi {
    tableState: DataTableState;
    setTableState(newState: DataTableState): void;
    setFilter(filter: TFilter): void;
    setColumnsConfig(columnsConfig: ColumnsConfig): void;
    presets: ITablePreset<TFilter>[];
    setPage(page: number): void;
}

export { PersonTableRecord, PersonTableRecordId, PersonTableFilter, PersonsTableState, ITablePreset, ILocalStoragePresets, IPresetsApi, ITableState };