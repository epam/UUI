import { ColumnsConfig, DataTableState, IDataSource, ITablePreset } from "@epam/uui";
import { Person, PersonGroup, Location } from "@epam/uui-docs";

type PersonTableRecord = Person | PersonGroup | Location;

type PersonTableRecordId = [PersonTableRecord["__typename"], string | number];

type PersonTableFilter = { [key: string]: any, groupBy?: string };

interface PersonsTableState extends DataTableState {
    isFolded?: boolean;
    presets?: ITablePreset[];
}

type ILocalStoragePresets = (Omit<ITablePreset, "isActive">)[];

export { PersonTableRecord, PersonTableRecordId, PersonTableFilter, PersonsTableState, ILocalStoragePresets };