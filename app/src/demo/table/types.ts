import { ColumnsConfig, DataTableState, IDataSource } from "@epam/uui";
import { Person, PersonGroup, Location } from "@epam/uui-docs";

type PersonTableRecord = Person | PersonGroup | Location;

type PersonTableRecordId = [PersonTableRecord["__typename"], string | number];

type PersonTableFilter = { [key: string]: any, groupBy?: string };

import { ITablePreset, IPresetsApi } from '@epam/uui';

interface ITableFilter {
    title: string;
    id: string;
    key: string;
    type: "singlePicker" | "multiPicker" | "datePicker" | "rangeDatePicker";
    dataSource?: IDataSource<any, any, any>;
}

interface PersonsTableState extends DataTableState {
    isFolded?: boolean;
    presets?: ITablePreset[];
}

type ILocalStoragePresets = (Omit<ITablePreset, "isActive">)[];

interface ITableState<TFilter = Record<string, any>> extends IPresetsApi {
    tableState: DataTableState;
    onTableStateChange(newState: DataTableState): void;
    onFilterChange(filter: TFilter): void;
    onColumnsConfigChange(columnsConfig: ColumnsConfig): void;
    presets: ITablePreset<TFilter>[];
}

export { PersonTableRecord, PersonTableRecordId, PersonTableFilter, ITableFilter, PersonsTableState, ILocalStoragePresets, ITableState };